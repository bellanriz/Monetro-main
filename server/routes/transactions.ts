import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";
import admin from "firebase-admin";

const router = Router();

const SUSPICIOUS_THRESHOLD = 2000; // RM 2,000

// GET /api/transactions - Get transactions for the authenticated user (or their kid)
router.get("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { kidId, limit = "50", status } = req.query;

    let query: admin.firestore.Query = adminDb.collection("transactions");

    if (kidId) {
      // Parent viewing kid's transactions — verify parent relationship
      const kidDoc = await adminDb.collection("users").doc(kidId as string).get();
      if (!kidDoc.exists || kidDoc.data()?.parentId !== uid) {
        return res.status(403).json({ error: "Not authorized to view this kid's transactions" });
      }
      query = query.where("userId", "==", kidId);
    } else {
      query = query.where("userId", "==", uid);
    }

    if (status) {
      query = query.where("status", "==", status);
    }

    query = query.orderBy("timestamp", "desc").limit(parseInt(limit as string));

    const snapshot = await query.get();
    const transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json({ transactions });
  } catch (error: any) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST /api/transactions - Create a new transaction
router.post("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { amount, type, category, description, location, isOverseas, cardType } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ error: "Amount and type are required" });
    }

    const isSuspicious = amount > SUSPICIOUS_THRESHOLD;

    const transactionData = {
      userId: uid,
      amount,
      type,
      category: category || "General",
      description: description || "",
      status: isSuspicious ? "pending" : "completed",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      isSuspicious,
      scamReport: isSuspicious
        ? `Exceeds RM ${SUSPICIOUS_THRESHOLD.toLocaleString()} safety threshold. Parent approval required.`
        : null,
      location: location || null,
      isOverseas: isOverseas || false,
      cardType: cardType || null,
    };

    const docRef = await adminDb.collection("transactions").add(transactionData);

    // If suspicious, create a notification for the parent
    if (isSuspicious) {
      const userDoc = await adminDb.collection("users").doc(uid).get();
      const userData = userDoc.data();
      if (userData?.parentId) {
        await adminDb.collection("notifications").add({
          userId: userData.parentId,
          title: "Limit Exceeded — Approval Needed",
          message: `${userData.displayName || "Your child"} wants to spend RM ${amount.toLocaleString()} on ${category || "a purchase"} at ${location || "unknown location"}.`,
          amount,
          location: location || "Unknown",
          transactionId: docRef.id,
          type: "approval_required",
          read: false,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    // Update user balance for completed transactions
    if (!isSuspicious && type === "spending") {
      await adminDb
        .collection("users")
        .doc(uid)
        .update({
          balance: admin.firestore.FieldValue.increment(-amount),
        });
    }

    res.status(201).json({ transaction: { id: docRef.id, ...transactionData } });
  } catch (error: any) {
    console.error("Create transaction error:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// PATCH /api/transactions/:id/approve - Parent approves a pending transaction
router.patch("/:id/approve", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;

    const txDoc = await adminDb.collection("transactions").doc(id).get();
    if (!txDoc.exists) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const txData = txDoc.data()!;

    // Verify the requester is the parent of the transaction owner
    const kidDoc = await adminDb.collection("users").doc(txData.userId).get();
    if (!kidDoc.exists || kidDoc.data()?.parentId !== uid) {
      return res.status(403).json({ error: "Not authorized to approve this transaction" });
    }

    await adminDb.collection("transactions").doc(id).update({
      status: "completed",
      isSuspicious: false,
      scamReport: null,
      approvedBy: uid,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Deduct from kid's balance
    await adminDb
      .collection("users")
      .doc(txData.userId)
      .update({
        balance: admin.firestore.FieldValue.increment(-txData.amount),
      });

    res.json({ message: "Transaction approved" });
  } catch (error: any) {
    console.error("Approve transaction error:", error);
    res.status(500).json({ error: "Failed to approve transaction" });
  }
});

// PATCH /api/transactions/:id/reject - Parent rejects a pending transaction
router.patch("/:id/reject", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;

    const txDoc = await adminDb.collection("transactions").doc(id).get();
    if (!txDoc.exists) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const txData = txDoc.data()!;

    const kidDoc = await adminDb.collection("users").doc(txData.userId).get();
    if (!kidDoc.exists || kidDoc.data()?.parentId !== uid) {
      return res.status(403).json({ error: "Not authorized to reject this transaction" });
    }

    await adminDb.collection("transactions").doc(id).update({
      status: "rejected",
      isSuspicious: false,
      rejectedBy: uid,
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: "Transaction rejected" });
  } catch (error: any) {
    console.error("Reject transaction error:", error);
    res.status(500).json({ error: "Failed to reject transaction" });
  }
});

export default router;

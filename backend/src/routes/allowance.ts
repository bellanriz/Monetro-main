import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";
import admin from "firebase-admin";

const router = Router();

// POST /api/allowance/send - Parent sends allowance to a kid
router.post("/send", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { kidId, amount, description } = req.body;

    if (!kidId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Kid ID and a positive amount are required" });
    }

    // Verify parent-kid relationship
    const kidDoc = await adminDb.collection("users").doc(kidId).get();
    if (!kidDoc.exists || kidDoc.data()?.parentId !== uid) {
      return res.status(403).json({ error: "Not authorized to send allowance to this user" });
    }

    // Deduct from parent balance
    await adminDb.collection("users").doc(uid).update({
      balance: admin.firestore.FieldValue.increment(-amount),
    });

    // Add to kid balance
    await adminDb.collection("users").doc(kidId).update({
      balance: admin.firestore.FieldValue.increment(amount),
    });

    // Record transaction for the kid
    const txData = {
      userId: kidId,
      amount,
      type: "allowance",
      category: "Allowance",
      description: description || "Allowance from parent",
      status: "completed",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      isSuspicious: false,
      fromUserId: uid,
    };

    const docRef = await adminDb.collection("transactions").add(txData);

    res.status(201).json({ transaction: { id: docRef.id, ...txData }, message: "Allowance sent" });
  } catch (error: any) {
    console.error("Send allowance error:", error);
    res.status(500).json({ error: "Failed to send allowance" });
  }
});

export default router;

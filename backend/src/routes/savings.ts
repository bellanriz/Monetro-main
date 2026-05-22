import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";
import admin from "firebase-admin";

const router = Router();

// GET /api/savings - Get savings goals for the authenticated user (or their kid)
router.get("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { kidId } = req.query;

    let query: admin.firestore.Query = adminDb.collection("savingsGoals");

    if (kidId) {
      // Parent viewing kid's goals
      const kidDoc = await adminDb.collection("users").doc(kidId as string).get();
      if (!kidDoc.exists || kidDoc.data()?.parentId !== uid) {
        return res.status(403).json({ error: "Not authorized to view this kid's savings" });
      }
      query = query.where("userId", "==", kidId);
    } else {
      query = query.where("userId", "==", uid);
    }

    const snapshot = await query.get();
    const goals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json({ goals });
  } catch (error: any) {
    console.error("Get savings error:", error);
    res.status(500).json({ error: "Failed to fetch savings goals" });
  }
});

// POST /api/savings - Create a new savings goal
router.post("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { title, targetAmount, category, deadline } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ error: "Title and target amount are required" });
    }

    const goalData = {
      userId: uid,
      title,
      targetAmount,
      currentAmount: 0,
      category: category || "General",
      deadline: deadline || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("savingsGoals").add(goalData);
    res.status(201).json({ goal: { id: docRef.id, ...goalData } });
  } catch (error: any) {
    console.error("Create savings goal error:", error);
    res.status(500).json({ error: "Failed to create savings goal" });
  }
});

// PATCH /api/savings/:id/deposit - Add money to a savings goal
router.patch("/:id/deposit", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "A positive amount is required" });
    }

    const goalDoc = await adminDb.collection("savingsGoals").doc(id).get();
    if (!goalDoc.exists) {
      return res.status(404).json({ error: "Savings goal not found" });
    }

    const goalData = goalDoc.data()!;
    if (goalData.userId !== uid) {
      return res.status(403).json({ error: "Not authorized to modify this goal" });
    }

    // Update goal progress
    await adminDb.collection("savingsGoals").doc(id).update({
      currentAmount: admin.firestore.FieldValue.increment(amount),
    });

    // Deduct from user's main balance, add to savings balance
    await adminDb.collection("users").doc(uid).update({
      balance: admin.firestore.FieldValue.increment(-amount),
      savingsBalance: admin.firestore.FieldValue.increment(amount),
    });

    // Record as a savings transaction
    await adminDb.collection("transactions").add({
      userId: uid,
      amount,
      type: "savings",
      category: goalData.title,
      description: `Deposit to "${goalData.title}"`,
      status: "completed",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      isSuspicious: false,
    });

    res.json({ message: "Deposit successful", newAmount: goalData.currentAmount + amount });
  } catch (error: any) {
    console.error("Deposit error:", error);
    res.status(500).json({ error: "Failed to deposit to savings goal" });
  }
});

// DELETE /api/savings/:id - Delete a savings goal
router.delete("/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;

    const goalDoc = await adminDb.collection("savingsGoals").doc(id).get();
    if (!goalDoc.exists) {
      return res.status(404).json({ error: "Savings goal not found" });
    }

    if (goalDoc.data()?.userId !== uid) {
      return res.status(403).json({ error: "Not authorized to delete this goal" });
    }

    await adminDb.collection("savingsGoals").doc(id).delete();
    res.json({ message: "Savings goal deleted" });
  } catch (error: any) {
    console.error("Delete savings goal error:", error);
    res.status(500).json({ error: "Failed to delete savings goal" });
  }
});

export default router;

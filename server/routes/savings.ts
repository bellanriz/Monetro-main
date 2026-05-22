import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";

const router = Router();

router.use(verifyToken);

/**
 * GET /api/savings
 * Fetch savings goals for the authenticated user (or their kid).
 */
router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { kidId } = req.query;
    const userId = req.user!.uid;

    let targetUserId = userId;

    if (kidId) {
      // Parent viewing kid's goals
      const kidDoc = await adminDb.collection("users").doc(kidId as string).get();
      if (!kidDoc.exists || kidDoc.data()?.parentId !== userId) {
        return res.status(403).json({ error: "Not authorized to view this user's goals" });
      }
      targetUserId = kidId as string;
    }

    const snapshot = await adminDb
      .collection("savingsGoals")
      .where("userId", "==", targetUserId)
      .get();

    const goals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ goals });
  } catch (error: any) {
    console.error("Get savings goals error:", error);
    res.status(500).json({ error: "Failed to fetch savings goals" });
  }
});

/**
 * POST /api/savings
 * Create a new savings goal.
 */
router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { title, targetAmount, category, deadline } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ error: "title and targetAmount are required" });
    }

    const goalData = {
      userId,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      category: category || "general",
      deadline: deadline || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("savingsGoals").add(goalData);

    res.status(201).json({ id: docRef.id, ...goalData });
  } catch (error: any) {
    console.error("Create savings goal error:", error);
    res.status(500).json({ error: "Failed to create savings goal" });
  }
});

/**
 * PATCH /api/savings/:id/deposit
 * Add money to a savings goal.
 */
router.patch("/:id/deposit", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
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

    // Allow owner or parent to deposit
    if (goalData.userId !== userId) {
      const kidDoc = await adminDb.collection("users").doc(goalData.userId).get();
      if (!kidDoc.exists || kidDoc.data()?.parentId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this goal" });
      }
    }

    const newAmount = goalData.currentAmount + Number(amount);
    await adminDb.collection("savingsGoals").doc(id).update({
      currentAmount: newAmount,
    });

    res.json({ message: "Deposit successful", currentAmount: newAmount });
  } catch (error: any) {
    console.error("Deposit to savings error:", error);
    res.status(500).json({ error: "Failed to deposit" });
  }
});

/**
 * DELETE /api/savings/:id
 * Delete a savings goal (owner only).
 */
router.delete("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { id } = req.params;

    const goalDoc = await adminDb.collection("savingsGoals").doc(id).get();
    if (!goalDoc.exists) {
      return res.status(404).json({ error: "Savings goal not found" });
    }

    if (goalDoc.data()?.userId !== userId) {
      return res.status(403).json({ error: "Only the goal owner can delete it" });
    }

    await adminDb.collection("savingsGoals").doc(id).delete();
    res.json({ message: "Goal deleted", id });
  } catch (error: any) {
    console.error("Delete savings goal error:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

export default router;

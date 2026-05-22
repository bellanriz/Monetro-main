import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";

const router = Router();

// GET /api/users/me - Get current user's profile
router.get("/me", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json({ user: { id: userDoc.id, ...userDoc.data() } });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// POST /api/users/profile - Create or update user profile
router.post("/profile", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { displayName, role, photoURL } = req.body;

    const profileData = {
      uid,
      email: req.user!.email,
      displayName: displayName || "",
      role: role || "kid",
      balance: 0,
      savingsBalance: 0,
      photoURL: photoURL || "",
      updatedAt: new Date().toISOString(),
    };

    const userRef = adminDb.collection("users").doc(uid);
    const existing = await userRef.get();

    if (existing.exists) {
      // Update only provided fields
      const updateData: any = { updatedAt: new Date().toISOString() };
      if (displayName) updateData.displayName = displayName;
      if (photoURL) updateData.photoURL = photoURL;
      await userRef.update(updateData);
    } else {
      // Create new profile
      await userRef.set({ ...profileData, createdAt: new Date().toISOString() });
    }

    const updated = await userRef.get();
    res.json({ user: { id: updated.id, ...updated.data() } });
  } catch (error: any) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// GET /api/users/kids - Get all kids linked to the current parent
router.get("/kids", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const kidsSnapshot = await adminDb
      .collection("users")
      .where("parentId", "==", uid)
      .get();

    const kids = kidsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ kids });
  } catch (error: any) {
    console.error("Get kids error:", error);
    res.status(500).json({ error: "Failed to fetch kids" });
  }
});

export default router;

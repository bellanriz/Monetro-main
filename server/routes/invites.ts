import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";
import admin from "firebase-admin";

const router = Router();

// POST /api/invites - Parent sends an invite to link a kid
router.post("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { kidEmail } = req.body;

    if (!kidEmail) {
      return res.status(400).json({ error: "Kid's email is required" });
    }

    const inviteData = {
      parentEmail: req.user!.email,
      parentId: uid,
      kidEmail,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("invites").add(inviteData);
    res.status(201).json({ invite: { id: docRef.id, ...inviteData } });
  } catch (error: any) {
    console.error("Create invite error:", error);
    res.status(500).json({ error: "Failed to create invite" });
  }
});

// GET /api/invites - Get pending invites for the current user
router.get("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.user!.email;

    // Get invites where user is either parent or kid
    const asParent = await adminDb
      .collection("invites")
      .where("parentEmail", "==", email)
      .get();

    const asKid = await adminDb
      .collection("invites")
      .where("kidEmail", "==", email)
      .get();

    const invites = [
      ...asParent.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...asKid.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ];

    res.json({ invites });
  } catch (error: any) {
    console.error("Get invites error:", error);
    res.status(500).json({ error: "Failed to fetch invites" });
  }
});

// PATCH /api/invites/:id/accept - Kid accepts a parent's invite
router.patch("/:id/accept", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;

    const inviteDoc = await adminDb.collection("invites").doc(id).get();
    if (!inviteDoc.exists) {
      return res.status(404).json({ error: "Invite not found" });
    }

    const inviteData = inviteDoc.data()!;
    if (inviteData.kidEmail !== req.user!.email) {
      return res.status(403).json({ error: "Not authorized to accept this invite" });
    }

    // Update invite status
    await adminDb.collection("invites").doc(id).update({ status: "accepted" });

    // Link kid to parent
    await adminDb.collection("users").doc(uid).update({
      parentId: inviteData.parentId,
    });

    res.json({ message: "Invite accepted, accounts linked" });
  } catch (error: any) {
    console.error("Accept invite error:", error);
    res.status(500).json({ error: "Failed to accept invite" });
  }
});

// PATCH /api/invites/:id/decline - Kid declines a parent's invite
router.patch("/:id/decline", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const inviteDoc = await adminDb.collection("invites").doc(id).get();
    if (!inviteDoc.exists) {
      return res.status(404).json({ error: "Invite not found" });
    }

    if (inviteDoc.data()?.kidEmail !== req.user!.email) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await adminDb.collection("invites").doc(id).update({ status: "declined" });
    res.json({ message: "Invite declined" });
  } catch (error: any) {
    console.error("Decline invite error:", error);
    res.status(500).json({ error: "Failed to decline invite" });
  }
});

export default router;

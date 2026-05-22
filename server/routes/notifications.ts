import { Router, Response } from "express";
import { adminDb } from "../config/firebase-admin";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth";

const router = Router();

// GET /api/notifications - Get notifications for the authenticated user
router.get("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;

    const snapshot = await adminDb
      .collection("notifications")
      .where("userId", "==", uid)
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();

    const notifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ notifications });
  } catch (error: any) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// PATCH /api/notifications/:id/read - Mark a notification as read
router.patch("/:id/read", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;

    const notifDoc = await adminDb.collection("notifications").doc(id).get();
    if (!notifDoc.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notifDoc.data()?.userId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await adminDb.collection("notifications").doc(id).update({ read: true });
    res.json({ message: "Notification marked as read" });
  } catch (error: any) {
    console.error("Mark read error:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete("/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    const { id } = req.params;

    const notifDoc = await adminDb.collection("notifications").doc(id).get();
    if (!notifDoc.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notifDoc.data()?.userId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await adminDb.collection("notifications").doc(id).delete();
    res.json({ message: "Notification deleted" });
  } catch (error: any) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;

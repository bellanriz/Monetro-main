import admin from "firebase-admin";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase Admin SDK
// In production, use a service account key file or default credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
}

export const adminDb = admin.firestore();
// Point to the custom database ID used by this project
adminDb.settings({ databaseId: firebaseConfig.firestoreDatabaseId });

export const adminAuth = admin.auth();
export default admin;

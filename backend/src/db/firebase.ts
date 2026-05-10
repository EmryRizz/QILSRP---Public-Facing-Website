import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../config/serviceAccountKey.json";

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// 🔥 connect to your named database
const db = getFirestore(app, "qilsr");

export default db;
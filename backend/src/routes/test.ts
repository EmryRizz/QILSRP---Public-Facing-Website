import { Router } from "express";
import db from "../db/firebase";

const router = Router();

router.get("/test-firestore", async (req, res) => {
  try {
    const docRef = await db.collection("test").add({
      message: "Firestore connected successfully",
      createdAt: new Date(),
    });

    res.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Firestore failed",
    });
  }
});

export default router;
import { Router } from "express";
import db from "../db/firebase";

const router = Router();

router.get("/ranger-teams", async (req, res) => {
  try {
    const snapshot = await db.collection("rangerTeams").get();

    const rangerTeams = snapshot.docs.map((doc) => {
      const data = doc.data();

    return {
    id: doc.id,
    name: data.name,
    addresses: data.addresses || [], 
    email: data.email,
    host: data.host,
    location: data.location,
    logoUrl: data.logoUrl,
    phone: data.phone,
    published: data.published,
    region: data.region,
    websites: data.websites || [],  
    coordinates: data.coordinates,
    };
    });

    res.json({
      success: true,
      data: rangerTeams,
    });
  } catch (error) {
    console.error("Error fetching ranger teams:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ranger teams",
    });
  }
});

router.get("/ranger-teams/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("rangerTeams").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Ranger team not found",
      });
    }

    const data = doc.data();

    res.json({
      success: true,
      data: {
        id: doc.id,
        name: data?.name,
        addresses: data?.addresses || [],
        email: data?.email,
        host: data?.host,
        location: data?.location,
        logoUrl: data?.logoUrl,
        phone: data?.phone,
        published: data?.published,
        region: data?.region,
        websites: data?.websites || [],
        coordinates: data?.coordinates,
      },
    });
  } catch (error) {
    console.error("Error fetching ranger team:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ranger team",
    });
  }
});

export default router;
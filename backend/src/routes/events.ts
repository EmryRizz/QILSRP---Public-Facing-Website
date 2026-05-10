import { Router } from "express";
import db from "../db/firebase";

const router = Router();
const today = new Date();
today.setHours(0, 0, 0, 0);

router.get("/events", async (req, res) => {
  try {
 
      const snapshot = await db
      .collection("events")
      .orderBy("closingdate", "asc")
      .get();

      const events = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        eventDate: data.eventdate,
        closingDate: data.closingdate,
        startDate: data.startdate,
        endDate: data.enddate,
        location: data.location,
        region: data.region,
        coordinates: data.coordinates,
      };
    })
       .filter((item) => {
        const seconds = item.closingDate?.seconds || item.closingDate?._seconds;
        if (!seconds) return false;

        const closingDate = new Date(seconds * 1000);
        closingDate.setHours(0, 0, 0, 0);

        return closingDate >= today;
      })
      .sort((a, b) => {
        const aSec = a.closingDate?.seconds || a.closingDate?._seconds || 0;
        const bSec = b.closingDate?.seconds || b.closingDate?._seconds || 0;
        return aSec - bSec;
    });

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("events").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const data = doc.data();

    res.json({
      success: true,
      data: {
        id: doc.id,
        title: data?.title,
        description: data?.description,
        eventDate: data?.eventdate,
        closingDate: data?.closingdate,
        startDate: data?.startdate,
        endDate: data?.enddate,
        location: data?.location,
        region: data?.region,
        coordinates: data?.coordinates,
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
});

router.post("/events/:id/participants", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rangerGroup, dateOfBirth, phoneNumber, email } = req.body;

    const docRef = await db.collection("eventParticipants").add({
      eventsID: id,
      name,
      rangerGroup,
      dateOfBirth,
      phoneNumber,
      email: email || null, 
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Event participant submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting participant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit participant",
    });
  }
});

export default router;
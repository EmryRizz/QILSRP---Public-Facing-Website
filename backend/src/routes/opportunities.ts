import { Router } from "express";
import db from "../db/firebase";

const router = Router();
const today = new Date();
today.setHours(0, 0, 0, 0);

router.get("/opportunities", async (req, res) => {
  try {
    const snapshot = await db
      .collection("opportunities")
      .where("status", "==", "Approved")
      .get();

    const opportunities = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.opportunitiestitle,
          description: data.opportunitiesdesc,
          type: data.opportunitiestype,
          status: data.positionstatus,
          location: data.location,
          region: data.region,
          closingDate: data.opportunitiesclosingdate,
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
      data: opportunities,
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch opportunities",
    });
  }
});

router.get("/opportunities/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("opportunities").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    const data = doc.data();

    res.json({
      success: true,
      data: {
        id: doc.id,
        title: data?.opportunitiestitle,
        description: data?.opportunitiesdesc,
        type: data?.opportunitiestype,
        status: data?.positionstatus,
        location: data?.location,
        region: data?.region,
        closingDate: data?.opportunitiesclosingdate,
        minsalary: data?.minsalary,
        maxsalary: data?.maxsalary,
        contactName: data?.contactpersonname,
        contactEmail: data?.contactpersonemailaddress,
        contactPhone: data?.contactpersonphone,
        coordinates: data?.coordinates,
      },
    });
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch opportunity",
    });
  }
});

export default router;
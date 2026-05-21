import express from "express";
import cors from "cors";
import opportunitiesRoutes from "./routes/opportunities";
import eventRoutes from "./routes/events";
import rangerTeamRoutes from "./routes/rangerTeams";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", opportunitiesRoutes);
app.use("/", eventRoutes);
app.use("/", rangerTeamRoutes);

export default app;
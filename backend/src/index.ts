import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth";
import projectsRoutes from "./routes/projects";
import ingestRoutes from './routes/ingest';
import {auditLog} from "./middleware/audit";
import {rateLimit} from "./middleware/rateLimit";
import analytics from "./routes/analytics";
import jobs from "./routes/jobs";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use('/api', ingestRoutes);
app.use('/api', analytics);
app.use('/api', jobs);
app.use('/api/projects', rateLimit(50, 60000));
app.get("/", (req: any, res: { json: (arg0: { ok: boolean; message: string; }) => any; }) => res.json({ ok: true, message: "Project Tracker API" }));
app.use(auditLog);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server listening on port", port);
});

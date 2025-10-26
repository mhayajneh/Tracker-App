import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth";
import projectsRoutes from "./routes/projects";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);

app.get("/", (req,res) => res.json({ ok: true, message: "Project Tracker API" }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server listening on port", port);
});

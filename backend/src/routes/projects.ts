import express from "express";
import db from "../db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get projects for the user's organization
router.get("/", requireAuth, async (req: AuthRequest, res: { json: (arg0: { projects: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
  const orgId = req.user!.organization_id;
  try {
    const result = await db.query("SELECT id, title, description, status, created_at FROM projects WHERE organization_id = $1 ORDER BY created_at DESC", [orgId]);
    res.json({ projects: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; project?: any; }): void; new(): any; }; }; }) => {
  const orgId = req.user!.organization_id;
  const userId = req.user!.id;
  const { title, description, status } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  try {
    const result = await db.query(
      "INSERT INTO projects(title, description, status, organization_id, created_at) VALUES($1,$2,$3,$4,NOW()) RETURNING id, title, description, status, created_at",
      [title, description || null, status || "active", orgId]
    );
    const project = result.rows[0];
    await db.query("INSERT INTO audit_logs(user_id, organization_id, action, meta, created_at) VALUES($1,$2,$3,$4,NOW())", [userId, orgId, 'project.create', JSON.stringify({ project_id: project.id })]);
    res.status(201).json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { project: any; }) => void; }) => {
  const orgId = req.user!.organization_id;
  const userId = req.user!.id;
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const q = await db.query("UPDATE projects SET title=$1, description=$2, status=$3 WHERE id=$4 AND organization_id=$5 RETURNING id, title, description, status, created_at", [title, description || null, status || "active", id, orgId]);
    if (q.rows.length === 0) return res.status(404).json({ error: "Not found" });
    await db.query("INSERT INTO audit_logs(user_id, organization_id, action, meta, created_at) VALUES($1,$2,$3,$4,NOW())", [userId, orgId, 'project.update', JSON.stringify({ project_id: id })]);
    res.json({ project: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { ok: boolean; }) => void; }) => {
  const orgId = req.user!.organization_id;
  const userId = req.user!.id;
  const { id } = req.params;
  try {
    const q = await db.query("DELETE FROM projects WHERE id=$1 AND organization_id=$2 RETURNING id", [id, orgId]);
    if (q.rows.length === 0) return res.status(404).json({ error: "Not found" });
    await db.query("INSERT INTO audit_logs(user_id, organization_id, action, meta, created_at) VALUES($1,$2,$3,$4,NOW())", [userId, orgId, 'project.delete', JSON.stringify({ project_id: id })]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;

import express from "express";
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import db from "../db";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

router.post("/signup", async (req: { body: { email: any; password: any; organization_name: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { token: any; user: { id: any; email: any; organization_id: any; }; }) => void; }) => {
  const { email, password, organization_name } = req.body;
  if (!email || !password || !organization_name) return res.status(400).json({ error: "email, password and organization_name required" });
  try {
    // create organization
    const orgRes = await db.query(
      "INSERT INTO organizations(name, created_at) VALUES($1, NOW()) RETURNING id",
      [organization_name]
    );
    const orgId = orgRes.rows[0].id;
    const hash = await bcrypt.hash(password, 10);
    const userRes = await db.query(
      "INSERT INTO users(email, password_hash, organization_id, created_at) VALUES($1, $2, $3, NOW()) RETURNING id, email, organization_id",
      [email, hash, orgId]
    );
    const user = userRes.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, organization_id: user.organization_id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, organization_id: user.organization_id } });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: "Could not create user" });
  }
});

router.post("/login", async (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { token: any; user: { id: any; email: any; organization_id: any; }; }) => void; }) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  try {
    const userRes = await db.query("SELECT id, email, password_hash, organization_id FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });
    const user = userRes.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email, organization_id: user.organization_id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, organization_id: user.organization_id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;

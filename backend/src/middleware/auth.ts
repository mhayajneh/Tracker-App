import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  params: any;
  headers: any;
  body: any;
  user?: { id: number; email: string; organization_id: number };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing Authorization header" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Bad Authorization header" });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET) as any;
    req.user = { id: payload.id, email: payload.email, organization_id: payload.organization_id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

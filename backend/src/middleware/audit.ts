import pool from '../db';
import { Request, Response, NextFunction } from 'express';

export const auditLog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id || null;
        const organizationId = (req as any).user?.organization_id || null;
        const action = `${req.method} ${req.path}`;

        await pool.query(
            `INSERT INTO audit_logs (user_id, organization_id, action, meta, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
            [userId, organizationId, action, JSON.stringify(req.body || {})]
        );

        next();
    } catch (err) {
        console.error('Audit log error:', err);
        next();
    }
};

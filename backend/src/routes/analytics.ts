import express from 'express';
import pool from '../db';
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get('/analytics/summary', requireAuth, async (req: AuthRequest, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { total: number; active: number; completed: number; average_completion_hours: number; }) => void; }) => {
    try {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const orgId = user.organization_id;
        if (!orgId) return res.status(400).json({ error: 'User has no organization' });

        // total projects
        const total = await pool.query(
            `SELECT COUNT(*) FROM projects WHERE organization_id = $1`,
            [orgId]
        );

        // active vs completed
        const active = await pool.query(
            `SELECT COUNT(*) FROM projects WHERE organization_id = $1 AND status = 'active'`,
            [orgId]
        );
        const completed = await pool.query(
            `SELECT COUNT(*) FROM projects WHERE organization_id = $1 AND status = 'completed'`,
            [orgId]
        );

        const avgCompletion = await pool.query(
            `SELECT AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600) AS avg_hours
       FROM projects
       WHERE organization_id = $1 AND status = 'completed' AND completed_at IS NOT NULL`,
            [orgId]
        );

        res.json({
            total: parseInt(total.rows[0].count),
            active: parseInt(active.rows[0].count),
            completed: parseInt(completed.rows[0].count),
            average_completion_hours: parseFloat(avgCompletion.rows[0].avg_hours) || 0,
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;

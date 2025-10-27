const rateLimits: Record<string, { count: number; lastReset: number }> = {};

export const rateLimit = (limit: number, windowMs: number) => {
    return (req: any, res: any, next: any) => {
        const userId = req.user?.id || req.ip;
        const now = Date.now();

        if (!rateLimits[userId] || now - rateLimits[userId].lastReset > windowMs) {
            rateLimits[userId] = { count: 1, lastReset: now };
            return next();
        }

        if (rateLimits[userId].count >= limit) {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }

        rateLimits[userId].count++;
        next();
    };
};

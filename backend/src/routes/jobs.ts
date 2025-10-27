import express from 'express';

const router = express.Router();

const jobStatuses: Record<string, string> = {};

router.post('/jobs/recompute-metrics', (req, res) => {
    const jobId = Date.now().toString();
    jobStatuses[jobId] = 'pending';

    //async background job
    setTimeout(() => {
        jobStatuses[jobId] = 'completed';
    }, 5000);

    res.json({ job_id: jobId, status: 'pending' });
});

router.get('/jobs/status/:id', (req, res) => {
    const status = jobStatuses[req.params.id];
    if (!status) return res.status(404).json({ error: 'Job not found' });
    res.json({ job_id: req.params.id, status });
});

export default router;

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface IngestJob {
    id: string;
    status: 'pending' | 'processed';
    file_url?: string;
}

const jobs: Record<string, IngestJob> = {};

router.post('/ingest/init', (req: any, res: { json: (arg0: { job_id: any; upload_url: string; }) => void; }) => {
    const jobId = uuidv4();
    jobs[jobId] = { id: jobId, status: 'pending' };
    res.json({
        job_id: jobId,
        upload_url: `https://s3-upload.com/${jobId}`
    });
});

router.post('/pipeline/callback', (req: { body: { job_id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { success: boolean; job: IngestJob; }) => void; }) => {
    const { job_id } = req.body;
    if (!jobs[job_id]) return res.status(404).json({ error: 'Job not found' });

    jobs[job_id].status = 'processed';
    res.json({ success: true, job: jobs[job_id] });
});

router.get('/ingest/status/:id', (req: { params: { id: string | number; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: IngestJob) => void; }) => {
    const job = jobs[req.params.id];
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
});

export default router;

import React, { useState } from 'react';
import { getJSON, postJSON, putJSON, delJSON } from '../api';

interface Job {
    id: string;
    status: 'pending' | 'processed';
    file_url?: string;
}

const Ingestion: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('token');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const startUpload = async () => {
        if (!file) return setError('Please select a file first');
        setError(null);
        setLoading(true);

        try {
            // 1️⃣ Init job
            const initRes: any = await postJSON('/ingest/init', {}, token || undefined);
            const jobId = initRes.job_id;

            // 2️⃣ Simulate file upload to mock URL
            await new Promise((resolve) => setTimeout(resolve, 2000)); // fake upload delay

            // 3️⃣ Call callback to mark as processed
            await postJSON('/pipeline/callback', { job_id: jobId }, token || undefined);

            // 4️⃣ Fetch updated status
            const statusRes: Job = await getJSON(`/ingest/status/${jobId}`, token || undefined);
            setJob(statusRes);
        } catch (err) {
            console.error(err);
            setError('Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">📁 Project Ingestion</h2>

            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button
                onClick={startUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || !file}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {job && (
                <div className="mt-4 p-4 border rounded">
                    <p><strong>Job ID:</strong> {job.id}</p>
                    <p>
                        <strong>Status:</strong>{' '}
                        {job.status === 'processed' ? (
                            <span className="text-green-600">✅ Processed</span>
                        ) : (
                            <span className="text-yellow-600">⏳ Pending</span>
                        )}
                    </p>
                    {job.file_url && (
                        <p>
                            <strong>File URL:</strong> <a href={job.file_url} className="text-blue-600">{job.file_url}</a>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Ingestion;

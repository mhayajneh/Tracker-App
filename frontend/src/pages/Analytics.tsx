import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getJSON, postJSON, putJSON, delJSON } from '../api';

interface AnalyticsData {
    total: number;
    active: number;
    completed: number;
    average_completion_hours: number;
}

const COLORS = ['#36A2EB', '#4BC0C0'];

const Analytics: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getJSON('/analytics/summary', token);
                setData(res);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-4 text-gray-500">Loading analytics...</div>;
    if (!data) return <div className="p-4 text-red-500">Failed to load analytics.</div>;

    const pieData = [
        { name: 'Active', value: data.active },
        { name: 'Completed', value: data.completed },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">📊 Project Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="space-y-2">
                    <p className="text-lg"><strong>Total Projects:</strong> {data.total}</p>
                    <p className="text-lg"><strong>Active:</strong> {data.active}</p>
                    <p className="text-lg"><strong>Completed:</strong> {data.completed}</p>
                    <p className="text-lg">
                        <strong>Avg Completion Time:</strong>{' '}
                        {data.average_completion_hours > 0
                            ? `${data.average_completion_hours.toFixed(2)} hours`
                            : 'N/A'}
                    </p>
                </div>

                {/* Pie Chart */}
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

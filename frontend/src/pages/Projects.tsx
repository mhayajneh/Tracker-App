import React, { useEffect, useState } from 'react';
import { getJSON, postJSON, delJSON } from '../api';

export default function Projects({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getJSON('/projects', token);
      if (res.projects) setProjects(res.projects);
      else setError(res.error || 'Failed to load projects');
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await postJSON('/projects', { title, description: desc }, token);
      if (res.project) {
        setProjects((prev) => [res.project, ...prev]);
        setTitle('');
        setDesc('');
      } else setError(res.error || 'Create failed');
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete project?')) return;
    const res = await delJSON('/projects/' + id, token);
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
    else setError(res.error || 'Delete failed');
  }

  return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Projects</h2>
          <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Add Project Form */}
        <form onSubmit={create} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
          <div>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Project
          </button>
        </form>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Projects List */}
        {loading ? (
            <div className="text-gray-500">Loading...</div>
        ) : (
            <div className="space-y-4">
              {projects.map((p) => (
                  <div key={p.id} className="bg-white shadow rounded p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-lg">{p.title}</strong>
                      <span
                          className={`px-2 py-1 text-sm font-semibold rounded ${
                              p.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                          }`}
                      >
                  {p.status}
                </span>
                    </div>
                    {p.description && <p className="text-gray-700">{p.description}</p>}
                    <div className="mt-3">
                      <button
                          onClick={() => remove(p.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

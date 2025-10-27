import React, { useState } from 'react';
import { postJSON } from '../api';

export default function Login({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [org, setOrg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        const res = await postJSON('/auth/signup', { email, password, organization_name: org });
        if (res.token) onLogin(res.token, res.user);
        else setError(res.error || 'Signup failed');
      } else {
        const res = await postJSON('/auth/login', { email, password });
        if (res.token) onLogin(res.token, res.user);
        else setError(res.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
    setLoading(false);
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">{isSignup ? 'Sign Up' : 'Log In'}</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {isSignup && (
                <div>
                  <input
                      type="text"
                      placeholder="Organization Name"
                      value={org}
                      onChange={e => setOrg(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md text-white font-semibold transition ${
                    loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
            </button>

            <div className="text-center mt-2">
              <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError(null);
                  }}
                  className="text-sm text-blue-600 hover:underline"
              >
                {isSignup ? 'Already have an account? Log in' : 'Create an account'}
              </button>
            </div>

            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
          </form>
        </div>
      </div>
  );
}

import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Projects from './pages/Projects';

export default function App(){
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(()=> {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
  }, []);

  if (!token) return <Login onLogin={(t,u)=>{ localStorage.setItem('token',t); localStorage.setItem('user', JSON.stringify(u)); setToken(t); setUser(u); }} />;

  return <Projects token={token} onLogout={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null); }} />;
}

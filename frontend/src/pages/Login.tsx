import React, { useState } from 'react';
import { postJSON } from '../api';

export default function Login({ onLogin }: { onLogin: (token:string,user:any)=>void }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [org,setOrg]=useState('');
  const [loading,setLoading]=useState(false);
  const [isSignup,setIsSignup]=useState(false);
  const [error,setError]=useState<string|null>(null);

  async function submit(e: any){
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      if (isSignup){
        const res = await postJSON('/auth/signup', { email, password, organization_name: org });
        if (res.token) onLogin(res.token, res.user);
        else setError(res.error || 'Signup failed');
      } else {
        const res = await postJSON('/auth/login', { email, password });
        if (res.token) onLogin(res.token, res.user);
        else setError(res.error || 'Login failed');
      }
    } catch (err:any){ setError(err.message || 'Network error'); }
    setLoading(false);
  }

  return (<div style={{maxWidth:480, margin:'40px auto'}}>
    <h2>{isSignup? 'Sign up' : 'Log in'}</h2>
    <form onSubmit={submit}>
      <div><input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required /></div>
      <div><input type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required /></div>
      {isSignup && <div><input placeholder='Organization name' value={org} onChange={e=>setOrg(e.target.value)} required /></div>}
      <div style={{marginTop:10}}>
        <button type='submit' disabled={loading}>{loading ? 'Please wait...' : (isSignup? 'Sign up' : 'Log in')}</button>
      </div>
      <div style={{marginTop:8}}>
        <a href="#" onClick={(e)=>{e.preventDefault(); setIsSignup(!isSignup); setError(null);}}>{isSignup? 'Have an account? Log in' : 'Create an account'}</a>
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  </div>);
}

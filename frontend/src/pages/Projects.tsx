import React, { useEffect, useState } from 'react';
import { getJSON, postJSON, putJSON, delJSON } from '../api';

export default function Projects({ token, onLogout }: { token:string, onLogout:()=>void }){
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState<string|null>(null);

  async function load(){
    setLoading(true); setError(null);
    try {
      const res = await getJSON('/projects', token);
      if (res.projects) setProjects(res.projects);
      else setError(res.error || 'Failed');
    } catch (err:any){ setError(err.message || 'Network error'); }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  async function create(e:any){
    e.preventDefault();
    try {
      const res = await postJSON('/projects', { title, description: desc }, token);
      if (res.project){
        setProjects(prev=>[res.project, ...prev]);
        setTitle(''); setDesc('');
      } else setError(res.error || 'Create failed');
    } catch (err:any){ setError(err.message || 'Network error'); }
  }

  async function remove(id:number){
    if(!confirm('Delete project?')) return;
    const res = await delJSON('/projects/'+id, token);
    if (res.ok) setProjects(prev=>prev.filter(p=>p.id!==id));
    else setError(res.error || 'Delete failed');
  }

  return (<div style={{maxWidth:900, margin:'20px auto'}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <h2>Projects</h2>
      <div><button onClick={onLogout}>Logout</button></div>
    </div>
    <form onSubmit={create} style={{marginBottom:20}}>
      <input placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)} required />
      <input placeholder='Description' value={desc} onChange={e=>setDesc(e.target.value)} />
      <button type='submit'>Add Project</button>
    </form>
    {loading ? <div>Loading...</div> : (
      <div>
        {projects.map(p=>(
          <div key={p.id} style={{border:'1px solid #ddd', padding:10, marginBottom:8}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <strong>{p.title}</strong>
              <span>{p.status}</span>
            </div>
            <div>{p.description}</div>
            <div style={{marginTop:8}}>
              <button onClick={()=>remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    )}
    {error && <div style={{color:'red'}}>{error}</div>}
  </div>);
}

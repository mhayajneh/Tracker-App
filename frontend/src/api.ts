const API = (path: string) => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  return base + path;
};

export async function postJSON(path: string, body: any, token?: string){
  const res = await fetch(API(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token?{Authorization: 'Bearer '+token}: {}) },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function getJSON(path: string, token?: string){
  const res = await fetch(API(path), {
    method: 'GET',
    headers: { ...(token?{Authorization: 'Bearer '+token}: {}) }
  });
  return res.json();
}

export async function putJSON(path: string, body: any, token?: string){
  const res = await fetch(API(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token?{Authorization: 'Bearer '+token}: {}) },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function delJSON(path: string, token?: string){
  const res = await fetch(API(path), { method: 'DELETE', headers: { ...(token?{Authorization: 'Bearer '+token}: {}) }});
  return res.json();
}

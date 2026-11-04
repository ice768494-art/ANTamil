"use client";
import {useEffect,useState} from "react";
import Nav from "@/components/Nav";

const sample = {
  title:"Sample Anime", poster:"https://example.com/poster.jpg", description:"A short description",
  year:"2026", genre:"Action, Adventure", published:true,
  seasons:[{name:"Season 1",episodes:[{title:"Episode 1",driveUrl:"https://drive.google.com/file/d/FILE_ID/view",hlsUrl:"",audioVersions:[]}]}]
};

export default function AdminPage(){
  const [password,setPassword]=useState("");
  const [logged,setLogged]=useState(false);
  const [json,setJson]=useState(JSON.stringify(sample,null,2));
  const [message,setMessage]=useState("");
  const [items,setItems]=useState<any[]>([]);
  async function load(){const r=await fetch("/api/anime");if(r.ok)setItems(await r.json());}
  useEffect(()=>{if(logged)load();},[logged]);
  async function login(e:React.FormEvent){e.preventDefault();setMessage("");const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});if(r.ok){setLogged(true);setMessage("Signed in.");}else setMessage("Login failed. Check ADMIN_PASSWORD.");}
  async function add(e:React.FormEvent){e.preventDefault();try{const data=JSON.parse(json);const r=await fetch("/api/anime",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const out=await r.json();if(!r.ok)throw new Error(out.error||"Save failed");setMessage("Anime added successfully.");await load();}catch(err:any){setMessage(err.message||"Invalid JSON");}}
  async function remove(id:string){if(!confirm("Delete this anime?"))return;const r=await fetch(`/api/anime/${id}`,{method:"DELETE"});setMessage(r.ok?"Deleted.":"Delete failed.");await load();}
  async function logout(){await fetch("/api/admin/logout",{method:"POST"});setLogged(false);setPassword("");}
  return <><Nav/><main className="admin"><h1>Admin Dashboard</h1><p className="muted">Manage your authorized catalogue.</p>
    {!logged?<form className="form" onSubmit={login}><h2>Admin login</h2><input type="password" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn">Login</button></form>:
    <><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2>Add anime</h2><button className="btn secondary" onClick={logout}>Logout</button></div>
      <div className="notice">Paste a complete anime JSON object. Each episode can have a Google Drive preview URL and/or an HLS master playlist URL. Keep private credentials out of this JSON.</div>
      <form className="form" onSubmit={add}><textarea value={json} onChange={e=>setJson(e.target.value)} spellCheck={false}/><button className="btn">Add to catalogue</button></form>
      <h2>Existing anime</h2>{items.map(item=><div className="episode" key={item._id}><strong>{item.title}</strong><button className="btn danger" onClick={()=>remove(item._id)}>Delete</button></div>)}
    </>}
    {message&&<p>{message}</p>}
  </main></>;
}

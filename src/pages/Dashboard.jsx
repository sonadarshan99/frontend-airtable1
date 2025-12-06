import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
export default function Dashboard(){
  const [forms, setForms] = useState([]);
  useEffect(()=>{ api.get('/forms').then(r=>setForms(r.data)).catch(()=>{}); },[]);
  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <Link to="/builder"><button>Create new form</button></Link>
      <ul>
        {forms.map(f => <li key={f._id}><Link to={`/form/${f._id}`}>{f.title || 'Untitled'}</Link></li>)}
      </ul>
    </div>
  );
}

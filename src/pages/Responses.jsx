import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
export default function Responses(){
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  useEffect(()=> { api.get(`/responses/${id}`).then(r=>setRows(r.data)).catch(()=>{}); },[id]);
  return (
    <div style={{ padding: 20 }}>
      <h3>Responses</h3>
     <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Created</th><th>Status</th><th>Preview</th></tr></thead>
      <tbody>
        {rows.map(r => <tr key={r._id}><td>{r._id}</td><td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.deletedInAirtable? 'deleted' : 'active'}</td><td>{JSON.stringify(r.answers).slice(0,200)}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

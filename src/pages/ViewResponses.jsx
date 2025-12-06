import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useParams } from 'react-router-dom';

export default function ViewResponses(){
  const { id } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(()=>{ 
    axios.get(`/responses/${id}`)
      .then(r => setRows(r.data))
      .catch((err) => console.error("Fetch error:", err)); 
  }, [id]);
  return (
    <div style={{padding:20}}>
      <h3>Responses</h3>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r._id}>
              <td>{r._id}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>
                {JSON.stringify(r.answers || {}).slice(0, 200)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
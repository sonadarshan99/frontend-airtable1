import React from 'react';
export default function Home(){ 
const backend = process.env.REACT_APP_BACKEND || "https://backend-airtable2.onrender.com";

  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4a4e69' }}>
          Welcome to the Airtable Form Builder
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '2rem' }}>
          Connect your Airtable base and start creating powerful custom forms in minutes.
        </p>
        <a 
          href={`${backend}/auth/airtable`}
          style={{ textDecoration: 'none' }}
        >
          <button className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>
            Login with Airtable
          </button>
        </a>
      </div>
    </div>
  );
}
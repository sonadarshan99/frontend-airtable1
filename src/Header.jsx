import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-logo">
        Airtable Builder 📝
      </Link>
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/builder">Form Builder</Link>
      </nav>
    </header>
  );
}
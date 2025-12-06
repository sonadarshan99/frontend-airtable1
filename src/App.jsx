import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header'; 
import FormBuilder from './pages/FormBuilder';
import FormViewer from './pages/FormViewer';
import ViewResponses from './pages/ViewResponses';
import Home from './pages/Home';

export default function App(){
  return (
    <BrowserRouter>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/builder" element={<FormBuilder/>} />
          <Route path="/form/:id" element={<FormViewer/>} />
          <Route path="/forms/:id/responses" element={<ViewResponses/>} />
        </Routes>
      </div>
      <footer style={{ 
        padding: '1rem', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: '#6c757d',
        borderTop: '1px solid #e9ecef',
        backgroundColor: '#ffffff'
      }}>
        © {new Date().getFullYear()} Airtable Form Builder. All rights reserved.
      </footer>
    </BrowserRouter>
  );
}
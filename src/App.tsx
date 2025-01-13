import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Users } from './pages';

function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />}></Route>
        <Route path="/users" element={<Users />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import './App.css';
import 'i18n/config';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Users, User, Posts } from './pages';

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
        <Route path="/users/:id" element={<User />}></Route>
        <Route path="/posts" element={<Posts />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Users, User, Posts } from './pages';
import { useTranslation } from 'react-i18next';
import { resources } from 'i18n/config';

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    if (lang === i18n.language) return;

    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <>
      {Object.keys(resources).map((lang) => (
        <button key={lang} onClick={() => changeLanguage(lang)}>
          {lang}
        </button>
      ))}
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
    </>
  );
}

export default App;

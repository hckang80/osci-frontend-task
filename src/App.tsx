import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { UsersPage, UserPage, PostsPage, PostPage, TodosPage } from './pages';
import { useTranslation } from 'react-i18next';
import { resources } from 'i18n/config';
import { Flex } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    if (lang === i18n.language) return;

    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <>
      <Flex gap="space.050" justifyContent="end">
        {Object.keys(resources).map((lang) => (
          <Button
            appearance="subtle"
            key={lang}
            isSelected={lang === i18n.language}
            onClick={() => changeLanguage(lang)}
          >
            {lang}
          </Button>
        ))}
      </Flex>

      <Router
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true
        }}
      >
        <nav className="global-nav">
          <Flex gap="space.050">
            <Link to="/users">User</Link>
            <Link to="/posts">Post</Link>
          </Flex>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />}></Route>
          <Route path="/users" element={<UsersPage />}></Route>
          <Route path="/users/:id" element={<UserPage />}></Route>
          <Route path="/posts" element={<PostsPage />}></Route>
          <Route path="/posts/:id" element={<PostPage />}></Route>
          <Route path="/todos/:id" element={<TodosPage />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

import React, { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { UsersPage, UserPage, PostsPage, PostPage, TodosPage } from './pages';
import { Flex } from '@atlaskit/primitives';
import { t } from 'i18next';

export default function Router() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <Nav />

      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />}></Route>
        <Route path="/users" element={<UsersPage title={t('label.user')} />}></Route>
        <Route path="/users/:id" element={<UserPage title={t('label.user')} />}></Route>
        <Route path="/posts" element={<PostsPage title={t('label.post')} />}></Route>
        <Route path="/posts/:id" element={<PostPage title={t('label.post')} />}></Route>
        <Route path="/todos/:id" element={<TodosPage title={t('label.todo')} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export function Nav() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <nav className="global-nav">
      <Flex gap="space.050">
        <Link to="/users">User</Link>
        <Link to="/posts">Post</Link>
      </Flex>
    </nav>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { UsersPage, UserPage, PostsPage, PostPage, TodosPage } from './pages';
import { Flex } from '@atlaskit/primitives';

export default function Router() {
  return (
    <BrowserRouter
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
    </BrowserRouter>
  );
}

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Layout from './components/Layout';
import Home from './pages/Home';
import Discussions from './pages/Discussions';
import Dashboard from './pages/Dashboard';
import Thread from './pages/Thread';
import CreateThread from './pages/CreateThread';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Notifications from './pages/Notifications';
import SavedPosts from './pages/SavedPosts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app-main min-vh-100 d-flex flex-column">
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discussions" element={<Discussions />} />
          <Route path="thread/:id" element={<Thread />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:id" element={<PostDetail />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="create" element={<CreateThread />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="saved" element={<SavedPosts />} />
            <Route path="admin" element={<Admin />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;

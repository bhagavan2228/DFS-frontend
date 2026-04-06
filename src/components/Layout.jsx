import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const hasSidebar = Boolean(user);

  return (
    <div className={`main-layout flex-grow-1 d-flex ${hasSidebar ? 'layout-with-sidebar' : ''}`}>
      {hasSidebar && <Sidebar />}
      <div className="layout-main flex-grow-1 min-w-0">
        <Container className="py-4 py-md-5 animate-fade-in" fluid={false}>
          <Outlet />
        </Container>
      </div>

      <div
        className="position-fixed"
        style={{
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.03) 0%, transparent 70%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <div
        className="position-fixed"
        style={{
          bottom: '5%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(157, 0, 255, 0.03) 0%, transparent 70%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Layout;

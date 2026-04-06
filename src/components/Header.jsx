import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, MessageSquare, Bell, ChevronDown, FileText } from 'lucide-react';
import api from '../services/api';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setNotifItems([]);
      return;
    }
    api
      .get('/notifications/my')
      .then(({ data }) => setNotifItems(Array.isArray(data) ? data : []))
      .catch(() => setNotifItems([]));
  }, [user]);

  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.slice(0, 2).toUpperCase();
  };

  const toggleNotif = (e) => {
    e.stopPropagation();
    setNotifOpen((o) => !o);
  };

  const isNRead = (n) => n.isRead === true || n.read === true;
  const unreadCount = user ? notifItems.filter((n) => !isNRead(n)).length : 0;
  const notifPreview = notifItems.slice(0, 8);

  return (
    <header className="forumx-header">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <Link to="/" className="forumx-brand">
          <span className="forumx-logo-icon">
            <MessageSquare size={18} />
          </span>
          <span className="forumx-brand-text">
            FORUM<span className="forumx-brand-x">X</span>
          </span>
        </Link>

        <nav className="forumx-header-nav d-none d-md-flex align-items-center gap-1 ms-2">
          <Link to="/discussions" className="forumx-nav-link">
            Discussions
          </Link>
          <Link to="/posts" className="forumx-nav-link">
            <FileText size={14} className="me-1" style={{ verticalAlign: 'middle' }} />
            Posts
          </Link>
        </nav>
      </div>

      <div className="forumx-header-right">
        {!user && (
          <>
            <Link to="/login" className="forumx-header-link">
              Sign in
            </Link>
            <Link to="/register" className="forumx-header-link forumx-header-link-primary">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="forumx-header-link d-none d-sm-flex">
                <Shield size={16} />
                Admin
              </Link>
            )}

            <div className="position-relative" ref={notifRef}>
              <button type="button" className="forumx-icon-btn position-relative" title="Notifications" onClick={toggleNotif}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.6rem', padding: '0.2em 0.45em' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="forumx-notif-panel">
                  <div className="forumx-notif-header">Notifications</div>
                  {notifPreview.length === 0 ? (
                    <div className="forumx-notif-empty">No notifications</div>
                  ) : (
                    <ul className="forumx-notif-list">
                      {notifPreview.map((n) => (
                        <li key={n.id} className={isNRead(n) ? 'read' : ''}>
                          {n.message}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/notifications" className="forumx-notif-footer" onClick={() => setNotifOpen(false)}>
                    View all
                  </Link>
                </div>
              )}
            </div>

            <div className="forumx-user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="forumx-avatar">{getInitials(user?.name)}</div>
              <span className="forumx-username d-none d-sm-inline">{user?.name?.split(' ')[0] || 'Member'}</span>
              <ChevronDown size={14} className={`forumx-chevron ${dropdownOpen ? 'open' : ''}`} />

              {dropdownOpen && (
                <div className="forumx-dropdown">
                  <div className="forumx-dropdown-header">
                    <div className="forumx-dropdown-name">{user?.name}</div>
                    <div className="forumx-dropdown-email">{user?.email}</div>
                  </div>
                  <div className="forumx-dropdown-divider" />
                  <Link to="/saved" className="forumx-dropdown-item text-decoration-none" onClick={() => setDropdownOpen(false)}>
                    Saved posts
                  </Link>
                  <button type="button" onClick={handleLogout} className="forumx-dropdown-item danger">
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

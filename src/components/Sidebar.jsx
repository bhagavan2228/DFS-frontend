import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Shield, User, Bell, Search, PlusCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/' },
        { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
        { icon: PlusCircle, label: 'New thread', path: '/create' },
        { icon: FileText, label: 'Posts', path: '/posts' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        { icon: User, label: 'Saved posts', path: '/saved' },
    ];

    if (user?.role === 'ADMIN') {
        navItems.push({ icon: Shield, label: 'Command Center', path: '/admin' });
    }

    return (
        <div className="sidebar-container d-none d-lg-flex flex-column p-4 gap-4 glass-panel"
            style={{ 
                width: '280px', 
                height: 'calc(100vh - 40px)', 
                position: 'fixed', 
                left: '20px', 
                top: '20px',
                zIndex: 100,
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
            
            <div className="sidebar-logo d-flex align-items-center gap-3 mb-4 px-2">
                <div className="logo-box rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.35)' }}>
                    <div className="rounded-circle" style={{ width: '12px', height: '12px', background: 'rgba(255,255,255,0.92)' }} />
                </div>
                <h4 className="mb-0 fw-bold tracking-tighter" style={{ fontSize: '1.4rem' }}>DFSx</h4>
            </div>

            <div className="search-box glass-card p-2 mb-2 d-flex align-items-center gap-2" style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>
                <Search size={16} className="text-tertiary ms-1" />
                <input 
                    type="text" 
                    placeholder="Search network..." 
                    className="bg-transparent border-0 text-white small w-100" 
                    style={{ outline: 'none', fontSize: '0.8rem' }}
                />
            </div>

            <nav className="flex-grow-1 d-flex flex-column gap-1">
                <span className="text-tertiary small fw-bold mb-2 px-2" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>MAIN NAVIGATION</span>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                                isActive ? 'fw-bold sidebar-nav-active text-white' : 'text-secondary sidebar-nav-item'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer pt-3 border-top border-white border-opacity-10">
                <div className="d-flex align-items-center gap-3 px-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)' }}>
                        <User size={18} className="text-white" />
                    </div>
                    <div className="d-flex flex-column overflow-hidden">
                        <span className="text-white small fw-bold text-truncate">{user?.name || 'Agent'}</span>
                        <span className="text-tertiary" style={{ fontSize: '0.7rem' }}>Authorized Level 4</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

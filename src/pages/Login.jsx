import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, Globe, AtSign, Code2, Wifi } from 'lucide-react';
import useAuthStore from '../store/authStore';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login({ email, password });
        if (result.success) {
            toast.success('Authentication confirmed. Welcome to the network.');
            navigate('/discussions');
        } else {
            toast.error(result.error || 'Identity rejection.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-fullscreen">
            {/* Background city image overlay */}
            <div className="auth-bg-overlay" />

            {/* Logo top-left */}
            <div className="auth-top-logo">
                <span className="auth-logo-text">FORUM<span className="auth-logo-x">X</span></span>
            </div>

            {/* Left side content */}
            <div className="auth-left-panel">
                <div className="auth-hero-content">
                    <h1 className="auth-hero-title">Welcome<br />Back</h1>
                    <p className="auth-hero-sub">
                        Step back into the network. Your transmissions, your<br />
                        community, your signal — all waiting for you.
                    </p>
                    <div className="auth-icon-row">
                        <div className="auth-icon-btn"><Globe size={18} /></div>
                        <div className="auth-icon-btn"><AtSign size={18} /></div>
                        <div className="auth-icon-btn"><Code2 size={18} /></div>
                        <div className="auth-icon-btn"><Wifi size={18} /></div>
                    </div>
                </div>
            </div>

            {/* Right side form panel */}
            <div className="auth-right-panel">
                <div className="auth-form-card">
                    <div className="auth-form-header">
                        <h2 className="auth-form-title">Sign In</h2>
                        <p className="auth-form-sub">Access your ForumX account</p>
                    </div>

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="agent@forumx.net"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <span className="auth-loading-ring" />
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-switch-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-switch-link">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
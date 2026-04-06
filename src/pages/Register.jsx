import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { UserPlus, Globe, AtSign, Code2, Wifi } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        const result = await register({ name, email, password });
        if (result.success) {
            toast.success('Agent identity established. Redirecting to authentication.');
            navigate('/login');
        } else {
            toast.error(result.error || 'Identity establishment failed.');
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
                    <h1 className="auth-hero-title">Join the<br />Network</h1>
                    <p className="auth-hero-sub">
                        Establish your signal in the network. Connect,<br />
                        broadcast, and shape the conversation.
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
                        <h2 className="auth-form-title">Create Account</h2>
                        <p className="auth-form-sub">Join the ForumX network</p>
                    </div>

                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-label">Agent Callsign</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Your display name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                        <div className="auth-input-group">
                            <label className="auth-label">Confirm Password</label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <span className="auth-loading-ring" />
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-switch-text">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-switch-link">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
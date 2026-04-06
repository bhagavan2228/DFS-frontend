import React from 'react';
import { Shield, ArrowLeft, Activity } from 'lucide-react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <Container className="animate-fade-in pb-5" style={{ maxWidth: '1100px' }}>
            {/* Back nav */}
            <Link to="/discussions" className="d-flex align-items-center gap-2 mb-5 text-muted text-decoration-none hover-primary small fw-bold">
                <ArrowLeft size={16} className="text-primary" />
                RETURN TO NETWORK
            </Link>

            {/* Header */}
            <div className="d-flex align-items-center gap-4 mb-5">
                <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: '64px', height: '64px', background: 'rgba(0,210,255,0.1)', border: '1px solid var(--neon-blue)', boxShadow: '0 0 30px rgba(0,210,255,0.15)' }}>
                    <Shield size={32} className="text-primary neon-text" />
                </div>
                <div>
                    <p className="font-monospace text-primary mb-1" style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase' }}>// SECURE ACCESS — ADMIN LEVEL</p>
                    <h1 className="h2 fw-bold text-white mb-0">Command Center</h1>
                    <p className="mb-0 small text-muted">Monitor network integrity and manage platform safety protocols.</p>
                </div>
            </div>

            <div className="glass-card p-5 text-center">
                <Activity size={48} className="text-primary mb-4" />
                <h3 className="text-white fw-bold mb-3">System Integration Pending</h3>
                <p className="text-muted mx-auto mb-0" style={{ maxWidth: '600px' }}>
                    The backend moderation analytics and transmission intercept protocols are currently being established. 
                    Standard network operations remain active under the primary security layer.
                </p>
                <div className="mt-5 d-flex justify-content-center gap-3">
                    <Badge bg="primary" className="rounded-pill px-4 py-2 font-monospace">API_SYNC: ACTIVE</Badge>
                    <Badge bg="dark" className="rounded-pill px-4 py-2 font-monospace border border-primary">MOD_LEVEL: OVERSIGHT</Badge>
                </div>
            </div>
        </Container>
    );
};

export default Admin;

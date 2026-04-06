import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sparkles, Shield, Users, ArrowRight } from 'lucide-react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page animate-fade-in">
      <section className="home-hero text-center py-5 px-3">
        <p className="text-primary small fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.2em' }}>
          Discussion Forum System
        </p>
        <h1 className="display-4 fw-bold text-white mb-4" style={{ maxWidth: '720px', margin: '0 auto', lineHeight: 1.15 }}>
          Ask questions, share answers, and stay civil with AI-assisted moderation
        </h1>
        <p className="text-muted lead mb-5" style={{ maxWidth: '560px', margin: '0 auto' }}>
          Browse threads publicly, sign in to post and reply, save posts, vote, and get AI summaries of long discussions.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Button as={Link} to="/discussions" className="btn-super-primary px-4 py-3 d-inline-flex align-items-center gap-2">
            Browse discussions
            <ArrowRight size={18} />
          </Button>
          {isAuthenticated ? (
            <Button as={Link} to="/create" variant="outline-light" className="rounded-pill px-4 py-3 border-secondary">
              Start a thread
            </Button>
          ) : (
            <>
              <Button as={Link} to="/register" variant="outline-light" className="rounded-pill px-4 py-3 border-secondary">
                Create account
              </Button>
              <Button as={Link} to="/login" variant="outline-primary" className="rounded-pill px-4 py-3">
                Sign in
              </Button>
            </>
          )}
        </div>
      </section>

      <Row className="g-4 px-2 px-md-4 pb-5" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 border-0 p-4">
            <MessageSquare className="text-primary mb-3" size={28} />
            <h5 className="text-white fw-bold">Threads &amp; replies</h5>
            <p className="text-muted small mb-0">Full conversation view with likes on replies and duplicate detection when you create a topic.</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 border-0 p-4">
            <Sparkles className="text-primary mb-3" size={28} />
            <h5 className="text-white fw-bold">AI summary</h5>
            <p className="text-muted small mb-0">Summarize long threads in one click. Toxic replies are filtered before they are stored.</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 border-0 p-4">
            <Shield className="text-primary mb-3" size={28} />
            <h5 className="text-white fw-bold">Ghost mode</h5>
            <p className="text-muted small mb-0">Post and browse with your display name hidden when ghost mode is enabled on your account.</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="glass-card h-100 border-0 p-4">
            <Users className="text-primary mb-3" size={28} />
            <h5 className="text-white fw-bold">Posts &amp; votes</h5>
            <p className="text-muted small mb-0">Use the posts feed for category-tagged content, comments, voting, and saved posts.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MessageSquare, Clock, ArrowRight, LayoutList } from 'lucide-react';
import { Button, Card, Badge, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Discussions = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/threads');
        setThreads(response.data);
      } catch (error) {
        console.error('Error fetching threads:', error);
        setThreads([]);
        toast.error('Could not load discussions.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="grow" style={{ color: 'rgba(255,255,255,0.6)' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div>
          <h1 className="h2 mb-1 fw-bold text-white d-flex align-items-center gap-3">
            <LayoutList size={28} className="text-primary" />
            Discussions
          </h1>
          <p className="text-muted mb-0 small">Threads from the community — open to everyone to read.</p>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/posts" variant="outline-primary" className="rounded-pill">
            Posts feed
          </Button>
          {user ? (
            <Button as={Link} to="/create" className="btn-super-primary d-flex align-items-center gap-2">
              <PlusCircle size={18} />
              New thread
            </Button>
          ) : (
            <Button as={Link} to="/login" className="btn-super-primary d-flex align-items-center gap-2">
              Sign in to post
            </Button>
          )}
        </div>
      </div>

      {threads.length === 0 ? (
        <Card className="glass-card text-center py-5">
          <Card.Body>
            <MessageSquare size={48} className="text-primary mb-3" />
            <h4 className="text-white">No threads yet</h4>
            <p className="text-muted">Be the first to start a discussion.</p>
            {user && (
              <Button as={Link} to="/create" className="btn-super-primary mt-2">
                Create thread
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-4">
          {threads.map((thread) => (
            <Card key={thread.id} className="glass-card border-0 overflow-hidden">
              <Card.Body className="p-4 ps-4">
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <Link to={`/thread/${thread.id}`} className="text-decoration-none">
                      <h5 className="mb-2 text-white fw-bold hover-primary">{thread.title}</h5>
                    </Link>
                    <div className="d-flex align-items-center gap-3 text-muted small mt-2">
                      <span>
                        <strong className="text-primary">{thread.author}</strong>
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        {thread.createdAt
                          ? new Date(thread.createdAt).toLocaleString()
                          : '—'}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0 d-flex justify-content-between justify-content-md-end align-items-center gap-3">
                    <Badge bg="transparent" className="rounded-pill px-3 py-2 border text-white" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                      {thread.replies ?? 0} {(thread.replies ?? 0) === 1 ? 'reply' : 'replies'}
                    </Badge>
                    <Link to={`/thread/${thread.id}`} className="btn btn-outline-primary rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                      <ArrowRight size={18} />
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussions;

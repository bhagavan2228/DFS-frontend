import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { Edit3, Ghost, ArrowLeft, Send, AlertTriangle, ExternalLink, Radar } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CreateThread = () => {
  const { ghostMode, toggleGhostMode, user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [ghostBusy, setGhostBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [similarThreads, setSimilarThreads] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const t = title.trim();
      if (t.length > 3) {
        setCheckingDuplicates(true);
        try {
          const res = await api.get(`/threads/check-duplicate?title=${encodeURIComponent(t)}`);
          const lower = t.toLowerCase();
          const others = res.data.filter((thread) => thread.title.trim().toLowerCase() !== lower);
          setSimilarThreads(others.slice(0, 5));
        } catch {
          setSimilarThreads([]);
        } finally {
          setCheckingDuplicates(false);
        }
      } else {
        setSimilarThreads([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [title]);

  const handleGhostToggle = async () => {
    setGhostBusy(true);
    const r = await toggleGhostMode();
    if (!r.success) toast.error(r.error || 'Could not update ghost mode.');
    setGhostBusy(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and body are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/threads', { title, content });
      toast.success('Thread created.');
      const threadId = res.data?.id;
      navigate(threadId ? `/thread/${threadId}` : '/discussions');
    } catch (error) {
      const msg = error.response?.data?.message || '';
      if (!msg.toLowerCase().includes('toxic') && !msg.toLowerCase().includes('rejected')) {
        toast.error(msg || 'Could not create thread.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">You need an account to start a thread.</p>
        <Button as={Link} to="/login" className="btn-super-primary rounded-pill">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="mb-4">
        <Link to="/discussions" className="d-flex align-items-center gap-2 text-muted text-decoration-none small fw-semibold">
          <ArrowLeft size={16} className="text-primary" /> Back to discussions
        </Link>
      </div>

      <Card className="glass-panel p-0 overflow-hidden border-0">
        <div style={{ height: '2px', background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.04))' }} />
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex align-items-center gap-4 mb-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <Edit3 size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="h3 fw-bold text-white mb-1">New thread</h1>
              <p className="text-muted mb-0 small">Ask a clear question. Similar threads appear as you type.</p>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="text-primary small fw-bold text-uppercase">Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="apple-input p-3"
                placeholder="What do you want to discuss?"
                required
              />
              {checkingDuplicates && (
                <div className="small text-primary mt-2 d-flex align-items-center gap-2">
                  <Radar size={14} /> Checking for similar threads…
                </div>
              )}

              {similarThreads.length > 0 && (
                <div className="mt-3 glass-card p-4 border border-warning border-opacity-25 rounded-3" style={{ background: 'rgba(255,184,0,0.04)' }}>
                  <div className="d-flex align-items-center gap-2 mb-2 text-warning small fw-bold">
                    <AlertTriangle size={14} /> Similar threads
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {similarThreads.map((t) => (
                      <Link
                        key={t.id}
                        to={`/thread/${t.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="d-flex align-items-center justify-content-between p-3 rounded text-decoration-none text-white small"
                        style={{ border: '1px solid rgba(255,184,0,0.15)', background: 'rgba(255,255,255,0.02)' }}
                      >
                        <span>{t.title}</span>
                        <ExternalLink size={14} className="text-warning" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-primary small fw-bold text-uppercase">Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="apple-input p-3"
                placeholder="Context, what you tried, what you need…"
                required
              />
            </Form.Group>

            <div
              className={`p-4 rounded-3 mb-4 d-flex align-items-center justify-content-between ${ghostMode ? 'bg-primary bg-opacity-10' : ''}`}
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${ghostMode ? 'bg-primary' : 'bg-white bg-opacity-10'}`}
                  style={{ width: '40px', height: '40px' }}
                >
                  <Ghost size={18} className="text-white" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-white">Ghost mode</h6>
                  <p className="text-muted mb-0 small">Posts as “Anonymous” when enabled (syncs with your account).</p>
                </div>
              </div>
              <Form.Check type="switch" id="ghost-create" checked={Boolean(ghostMode)} onChange={handleGhostToggle} disabled={ghostBusy} />
            </div>

            <div className="d-flex justify-content-end">
              <Button type="submit" disabled={submitting} className="btn-super-primary px-5 py-3">
                {submitting ? <Spinner size="sm" /> : <Send size={16} className="me-2" />}
                Publish thread
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateThread;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ThumbsUp,
  Sparkles,
  User,
  Clock,
  ArrowLeft,
  Cpu,
  Terminal,
  Info,
  X,
  Flag,
  Ghost,
} from 'lucide-react';
import { Card, Button, Form, Spinner, Badge, Container, Row, Col, Form as BsForm } from 'react-bootstrap';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ReportModal from '../components/ReportModal';

const Thread = () => {
  const { id } = useParams();
  const { user, ghostMode, toggleGhostMode } = useAuth();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [reportCtx, setReportCtx] = useState(null);
  const [ghostBusy, setGhostBusy] = useState(false);

  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        const [threadRes, repliesRes] = await Promise.all([
          api.get(`/threads/${id}`),
          api.get(`/threads/${id}/replies`),
        ]);
        setThread(threadRes.data);
        setReplies(repliesRes.data);
      } catch (error) {
        console.error('Failed to fetch thread data:', error);
        toast.error('Could not load this thread.');
        setThread(null);
      } finally {
        setLoading(false);
      }
    };
    fetchThreadData();
  }, [id]);

  const handleSummarize = async () => {
    if (!user) {
      toast.info('Sign in to generate an AI summary.');
      return;
    }
    setSummarizing(true);
    setAiSummary('');
    try {
      const res = await api.post(`/threads/${id}/summarize`);
      setAiSummary(res.data.summary);
      toast.success('Summary ready.');
    } catch {
      toast.error('Summary request failed.');
    } finally {
      setSummarizing(false);
    }
  };

  const handleLike = async (replyId) => {
    if (!user) {
      toast.info('Sign in to like replies.');
      return;
    }
    try {
      const res = await api.post(`/replies/${replyId}/like`);
      setReplies((prev) => prev.map((r) => (r.id === replyId ? { ...r, likes: res.data.likes } : r)));
    } catch {
      toast.error('Could not update like.');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    if (!user) {
      toast.info('Sign in to reply.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/threads/${id}/replies`, { content: newReply });
      setReplies((prev) => [...prev, res.data]);
      setNewReply('');
      toast.success('Reply posted.');
    } catch (error) {
      const msg = error.response?.data?.message || '';
      if (!msg.toLowerCase().includes('toxic') && !msg.toLowerCase().includes('rejected')) {
        toast.error(msg || 'Could not post reply.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGhostToggle = async () => {
    if (!user) {
      toast.info('Sign in to use ghost mode.');
      return;
    }
    setGhostBusy(true);
    const r = await toggleGhostMode();
    if (!r.success) toast.error(r.error || 'Could not toggle ghost mode.');
    setGhostBusy(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="grow" style={{ color: 'var(--neon-blue)' }} />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Thread not found.</p>
        <Button as={Link} to="/discussions" variant="outline-primary" className="rounded-pill">
          Back to discussions
        </Button>
      </div>
    );
  }

  return (
    <Container fluid className="animate-fade-in py-3 px-lg-4">
      <Row className="g-4">
        <Col lg={showSidebar ? 8 : 12}>
          <Link
            to="/discussions"
            className="d-inline-flex align-items-center gap-2 mb-4 text-muted text-decoration-none small fw-semibold"
          >
            <ArrowLeft size={16} className="text-primary" />
            All discussions
          </Link>

          <Card className="glass-card mb-4 overflow-hidden border-0">
            <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))' }} />
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="fw-bold text-white mb-0">{thread.title}</h2>
                </div>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {user && (
                    <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => setReportCtx({ type: 'THREAD', id: Number(id) })}>
                      <Flag size={14} className="me-1" />
                      Report
                    </Button>
                  )}
                  <Button className="btn-super-primary btn-sm rounded-pill" onClick={handleSummarize} disabled={summarizing || !user}>
                    {summarizing ? <Spinner size="sm" /> : <Cpu size={14} className="me-1" />}
                    AI summary
                  </Button>
                  {!showSidebar && (
                    <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={() => setShowSidebar(true)}>
                      Show panel
                    </Button>
                  )}
                </div>
              </div>

              {user && (
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <Ghost size={18} className="text-primary" />
                    <div>
                      <div className="text-white small fw-bold">Ghost mode</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        When on, new threads and replies use “Anonymous” as the display name.
                      </div>
                    </div>
                  </div>
                  <BsForm.Check type="switch" id="ghost-thread" checked={Boolean(ghostMode)} onChange={handleGhostToggle} disabled={ghostBusy} />
                </div>
              )}

              <div className="d-flex align-items-center gap-3 mb-3 text-muted small">
                <Badge bg="transparent" className="text-primary border border-primary border-opacity-25 px-3 py-2">
                  <User size={12} className="me-1" />
                  {thread.author}
                </Badge>
                <span className="d-flex align-items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : '—'}
                </span>
                <Badge bg="transparent" className="border border-secondary text-secondary">
                  {thread.replies ?? replies.length} {(thread.replies ?? replies.length) === 1 ? 'reply' : 'replies'}
                </Badge>
              </div>

              <div className="text-white-50 lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
                {thread.content}
              </div>
            </Card.Body>
          </Card>

          <h4 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            Replies
          </h4>

          <div className="d-flex flex-column gap-3 mb-4">
            {replies.map((reply, i) => (
              <Card key={reply.id} className="glass-card border-0 overflow-hidden position-relative">
                <div
                  className="position-absolute start-0 top-0 bottom-0"
                  style={{
                    width: '3px',
                    background: i % 2 === 0 ? 'var(--neon-blue)' : 'var(--neon-purple)',
                  }}
                />
                <Card.Body className="p-4 ps-4">
                  <p className="text-white-50 mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                    {reply.content}
                  </p>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2 border-top border-white border-opacity-10">
                    <span className="text-primary small fw-semibold">{reply.author}</span>
                    <div className="d-flex gap-2">
                      {user && (
                        <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => setReportCtx({ type: 'REPLY', id: reply.id })}>
                          <Flag size={12} />
                        </Button>
                      )}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => handleLike(reply.id)}
                        disabled={!user}
                      >
                        <ThumbsUp size={12} className="me-1" />
                        {reply.likes ?? 0}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {user ? (
            <Card className="glass-card border-0">
              <Card.Body className="p-4">
                <h5 className="text-white fw-bold mb-3">Your reply</h5>
                <Form onSubmit={handleReplySubmit}>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="apple-input p-3 mb-3"
                    placeholder="Write your reply…"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    required
                  />
                  <div className="d-flex justify-content-end">
                    <Button type="submit" disabled={submitting} className="btn-super-primary px-4">
                      {submitting ? <Spinner size="sm" /> : 'Post reply'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="glass-card border-0 p-4 text-center">
              <p className="text-muted mb-0">
                <Link to="/login" className="text-primary">
                  Sign in
                </Link>{' '}
                to reply, like, summarize, or report.
              </p>
            </Card>
          )}
        </Col>

        {showSidebar && (
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '88px', zIndex: 10 }}>
              <div className="neural-panel">
                <div className="neural-panel-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2 text-white small fw-bold">
                    <Cpu size={14} className="text-primary" />
                    Thread insights
                  </div>
                  <Button variant="link" className="text-muted p-0" onClick={() => setShowSidebar(false)}>
                    <X size={16} />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="d-flex align-items-start gap-2 mb-3">
                    <div className="mt-1 p-1 rounded-circle bg-primary bg-opacity-25">
                      <Info size={14} className="text-primary" />
                    </div>
                    <div className="small text-muted">Use AI summary for a quick overview. Replies are checked by a toxicity filter on the server.</div>
                  </div>

                  {summarizing ? (
                    <div className="text-center py-4">
                      <Spinner size="sm" className="text-primary mb-2" />
                      <div className="text-primary small">Generating summary…</div>
                    </div>
                  ) : aiSummary ? (
                    <div className="signal-box mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2 text-primary small fw-bold">
                        <Terminal size={12} /> Summary
                      </div>
                      <div className="text-white small" style={{ whiteSpace: 'pre-wrap' }}>
                        {aiSummary}
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline-primary" size="sm" className="w-100 mb-2" onClick={handleSummarize} disabled={!user}>
                      Generate summary
                    </Button>
                  )}

                  {replies.length > 0 && (
                    <div className="mt-3 small text-muted">
                      Latest reply from <span className="text-white">{replies[replies.length - 1].author}</span>.
                    </div>
                  )}
                </div>
                <div className="progress-bar-scanner" />
              </div>
            </div>
          </Col>
        )}
      </Row>

      {reportCtx && (
        <ReportModal show onHide={() => setReportCtx(null)} targetType={reportCtx.type} targetId={reportCtx.id} />
      )}
    </Container>
  );
};

export default Thread;

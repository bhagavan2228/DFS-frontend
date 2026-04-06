import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  Send,
  Flag,
} from 'lucide-react';
import { Card, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReportModal from '../components/ReportModal';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([api.get(`/posts/${id}`), api.get(`/posts/${id}/comments`)]);
      setPost(pRes.data);
      setComments(cRes.data);
    } catch {
      toast.error('Post not found or unavailable.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadPost();
  }, [loadPost]);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    let cancelled = false;
    api
      .get('/saved-posts/my')
      .then(({ data: savedList }) => {
        if (!cancelled) {
          setSaved(savedList.some((s) => s.post && s.post.id === Number(id)));
        }
      })
      .catch(() => {
        if (!cancelled) setSaved(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  const vote = async (voteType) => {
    if (!user) {
      toast.info('Sign in to vote.');
      return;
    }
    try {
      const { data } = await api.post(`/votes/post/${id}`, { voteType });
      setPost((prev) => (prev ? { ...prev, upvotes: data.upvotes, downvotes: data.downvotes } : prev));
    } catch {
      toast.error('Vote failed.');
    }
  };

  const toggleSave = async () => {
    if (!user) {
      toast.info('Sign in to save posts.');
      return;
    }
    setSaveBusy(true);
    try {
      if (saved) {
        await api.delete(`/saved-posts/${id}`);
        setSaved(false);
        toast.success('Removed from saved.');
      } else {
        await api.post(`/saved-posts/${id}`);
        setSaved(true);
        toast.success('Saved.');
      }
    } catch (e) {
      if (e.response?.status === 409) {
        setSaved(true);
        toast.info('Already saved.');
      } else {
        toast.error('Could not update saved posts.');
      }
    } finally {
      setSaveBusy(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      toast.info('Sign in to comment.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${id}/comments`, { content: commentText.trim() });
      setComments((c) => [...c, data]);
      setCommentText('');
      toast.success('Comment posted.');
    } catch {
      toast.error('Could not post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const voteComment = async (commentId, voteType) => {
    if (!user) {
      toast.info('Sign in to vote.');
      return;
    }
    try {
      const { data } = await api.post(`/votes/comment/${commentId}`, { voteType });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, upvotes: data.upvotes, downvotes: data.downvotes } : c))
      );
    } catch {
      toast.error('Vote failed.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="grow" style={{ color: 'rgba(255,255,255,0.6)' }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">This post could not be loaded.</p>
        <Button as={Link} to="/posts" variant="outline-primary" className="rounded-pill">
          Back to posts
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/posts" className="d-inline-flex align-items-center gap-2 mb-4 text-muted text-decoration-none small">
        <ArrowLeft size={16} className="text-primary" />
        All posts
      </Link>

      <Card className="glass-card border-0 mb-4">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
            <h1 className="h3 text-white fw-bold mb-0">{post.title}</h1>
            {user && (
              <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => setReportOpen(true)}>
                <Flag size={14} className="me-1" />
                Report
              </Button>
            )}
          </div>
          {post.category && (
            <Badge bg="transparent" className="border border-primary text-primary mb-3">
              {post.category.name}
            </Badge>
          )}
          <p className="text-muted mb-4" style={{ whiteSpace: 'pre-wrap' }}>
            {post.description}
          </p>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-muted small">{post.user?.name || 'Member'}</span>
            <span className="text-muted small">
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Button variant="outline-success" size="sm" className="rounded-pill" onClick={() => vote('UPVOTE')} disabled={!user}>
              <ThumbsUp size={14} className="me-1" />
              {post.upvotes ?? 0}
            </Button>
            <Button variant="outline-secondary" size="sm" className="rounded-pill" onClick={() => vote('DOWNVOTE')} disabled={!user}>
              <ThumbsDown size={14} className="me-1" />
              {post.downvotes ?? 0}
            </Button>
            <Button
              variant={saved ? 'primary' : 'outline-primary'}
              size="sm"
              className="rounded-pill"
              onClick={toggleSave}
              disabled={!user || saveBusy}
            >
              {saved ? <BookmarkCheck size={14} className="me-1" /> : <Bookmark size={14} className="me-1" />}
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <h2 className="h5 text-white fw-bold mb-3">Comments</h2>
      <div className="d-flex flex-column gap-3 mb-4">
        {comments.length === 0 ? (
          <p className="text-muted small">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <Card key={c.id} className="glass-card border-0">
              <Card.Body>
                <p className="text-white mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                  {c.content}
                </p>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="text-muted small">{c.user?.name || 'Member'}</span>
                  <div className="d-flex gap-1">
                    <Button variant="outline-success" size="sm" className="rounded-pill py-0 px-2" onClick={() => voteComment(c.id, 'UPVOTE')} disabled={!user}>
                      ↑ {c.upvotes ?? 0}
                    </Button>
                    <Button variant="outline-secondary" size="sm" className="rounded-pill py-0 px-2" onClick={() => voteComment(c.id, 'DOWNVOTE')} disabled={!user}>
                      ↓ {c.downvotes ?? 0}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {user ? (
        <Card className="glass-card border-0">
          <Card.Body>
            <Form onSubmit={submitComment}>
              <Form.Control
                as="textarea"
                rows={3}
                className="apple-input mb-3"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" className="btn-super-primary" disabled={submitting}>
                {submitting ? <Spinner size="sm" /> : <Send size={16} className="me-2" />}
                Post comment
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-muted small">
          <Link to="/login" className="text-primary">
            Sign in
          </Link>{' '}
          to comment or vote.
        </p>
      )}

      <ReportModal show={reportOpen} onHide={() => setReportOpen(false)} targetType="POST" targetId={Number(id)} />
    </div>
  );
};

export default PostDetail;

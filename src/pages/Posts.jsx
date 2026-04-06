import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Tag, Eye } from 'lucide-react';
import { Card, Badge, Spinner, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      try {
        const [catRes, postRes] = await Promise.all([api.get('/categories'), api.get('/posts')]);
        setCategories(catRes.data);
        setPosts(postRes.data);
      } catch {
        toast.error('Could not load posts.');
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  const filtered =
    categoryId === ''
      ? posts
      : posts.filter((p) => p.category && String(p.category.id) === String(categoryId));

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="grow" style={{ color: 'rgba(255,255,255,0.6)' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-white fw-bold mb-1 d-flex align-items-center gap-2">
            <FileText className="text-primary" size={28} />
            Posts
          </h1>
          <p className="text-muted small mb-0">Category-tagged posts from your database (votes, comments, saves).</p>
        </div>
        <Form.Select
          className="apple-input"
          style={{ maxWidth: '240px' }}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Form.Select>
      </div>

      <p className="small text-muted mb-4">
        <Link to="/discussions" className="text-primary text-decoration-none">
          Prefer classic threads?
        </Link>{' '}
        Open the discussions list.
      </p>

      {filtered.length === 0 ? (
        <Card className="glass-card p-5 text-center border-0">
          <p className="text-muted mb-0">No posts match this filter.</p>
        </Card>
      ) : (
        <Row className="g-4">
          {filtered.map((post) => (
            <Col md={6} key={post.id}>
              <Card className="glass-card h-100 border-0">
                <Card.Body className="d-flex flex-column">
                  <Link to={`/posts/${post.id}`} className="text-decoration-none text-white fw-bold h5 mb-2">
                    {post.title}
                  </Link>
                  <p className="text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.description}
                  </p>
                  <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                    {post.category && (
                      <Badge bg="transparent" className="border border-primary text-primary rounded-pill">
                        <Tag size={12} className="me-1" />
                        {post.category.name}
                      </Badge>
                    )}
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <Eye size={14} />
                      {post.viewCount ?? 0} views
                    </span>
                    <span className="text-muted small">
                      ↑ {post.upvotes ?? 0} · ↓ {post.downvotes ?? 0}
                    </span>
                  </div>
                  <Link to={`/posts/${post.id}`} className="btn btn-outline-primary rounded-pill mt-3 align-self-start d-inline-flex align-items-center gap-2">
                    Open
                    <ArrowRight size={16} />
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Posts;

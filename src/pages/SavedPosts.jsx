import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';

const SavedPosts = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/saved-posts/my');
        setSaved(data);
      } catch {
        toast.error('Could not load saved posts.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="grow" style={{ color: 'rgba(255,255,255,0.6)' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <Link to="/discussions" className="d-inline-flex align-items-center gap-2 mb-4 text-muted text-decoration-none small">
        <ArrowLeft size={16} className="text-primary" />
        Back
      </Link>

      <h1 className="h3 text-white fw-bold mb-4 d-flex align-items-center gap-2">
        <Bookmark className="text-primary" size={28} />
        Saved posts
      </h1>

      {saved.length === 0 ? (
        <Card className="glass-card p-5 text-center border-0">
          <p className="text-muted mb-3">You have not saved any posts yet.</p>
          <Button as={Link} to="/posts" variant="outline-primary" className="rounded-pill">
            Browse posts
          </Button>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {saved.map((row) => (
            <Card key={row.id} className="glass-card border-0">
              <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <Link to={`/posts/${row.post?.id}`} className="text-white fw-bold text-decoration-none h5 mb-1 d-block">
                    {row.post?.title || 'Post'}
                  </Link>
                  <p className="text-muted small mb-0">
                    Saved {row.savedAt ? new Date(row.savedAt).toLocaleString() : ''}
                  </p>
                </div>
                <Button as={Link} to={`/posts/${row.post?.id}`} variant="outline-primary" className="rounded-pill d-inline-flex align-items-center gap-2">
                  Open
                  <ArrowRight size={16} />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, ArrowLeft } from 'lucide-react';
import { Button, Card, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../services/api';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications/my');
      setItems(data);
    } catch {
      toast.error('Could not load notifications.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n)));
    } catch {
      toast.error('Update failed.');
    }
  };

  const isReadFlag = (n) => n.isRead === true || n.read === true;

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
      toast.success('All marked read.');
    } catch {
      toast.error('Could not mark all read.');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error('Could not delete notification.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="grow" style={{ color: 'var(--neon-blue)' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <Link to="/discussions" className="d-inline-flex align-items-center gap-2 mb-4 text-muted text-decoration-none small">
        <ArrowLeft size={16} className="text-primary" />
        Back to discussions
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 text-white fw-bold mb-0 d-flex align-items-center gap-2">
          <Bell size={26} className="text-primary" />
          Notifications
        </h1>
        {items.some((n) => !isReadFlag(n)) && (
          <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={markAllRead}>
            <Check size={14} className="me-1" />
            Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="glass-card p-5 text-center border-0">
          <p className="text-muted mb-0">You have no notifications yet. Replies to your threads will show up here.</p>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((n) => (
            <Card key={n.id} className={`glass-card border-0 ${isReadFlag(n) ? 'opacity-75' : ''}`}>
              <Card.Body className="d-flex gap-3 align-items-start">
                <div className="flex-grow-1">
                  {!isReadFlag(n) && (
                    <Badge bg="primary" className="mb-2 rounded-pill">
                      New
                    </Badge>
                  )}
                  <p className="text-white mb-1">{n.message}</p>
                  <p className="text-muted small mb-0">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div className="d-flex flex-column gap-1">
                  {!isReadFlag(n) && (
                    <Button variant="outline-secondary" size="sm" className="rounded-pill" onClick={() => markRead(n.id)} title="Mark read">
                      <Check size={14} />
                    </Button>
                  )}
                  <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => remove(n.id)} title="Delete">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

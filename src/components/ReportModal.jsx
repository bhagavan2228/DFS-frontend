import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { Flag, ShieldAlert, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ReportModal = ({ show, onHide, targetType, targetId }) => {
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const reasons = [
        "Spam or malicious links",
        "Harassment or hate speech",
        "Misinformation or fake news",
        "Toxic language or behavior",
        "Inappropriate content",
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) return;

        setSubmitting(true);
        try {
            await api.post('/reports', {
                targetType,
                targetId,
                reason
            });
            setSuccess(true);
            setTimeout(() => {
                onHide();
                setSuccess(false);
                setReason('');
            }, 2000);
        } catch (error) {
            toast.error("Failed to transmit report. Network failure.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="glass-modal">
            <Modal.Header closeButton closeVariant="white" className="border-0 bg-transparent p-4 pb-0">
                <Modal.Title className="d-flex align-items-center gap-2 text-white fw-bold">
                    <Flag size={20} className="text-danger" /> Flag Signal
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {success ? (
                    <div className="text-center py-4 animate-fade-in">
                        <CheckCircle size={48} className="text-success mb-3" />
                        <h5 className="text-white fw-bold">Signal Flagged</h5>
                        <p className="text-muted small font-monospace">// Moderation protocol initiated. Thank you agent.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-muted small mb-4 font-monospace">
                            // Target: <span className="text-primary">{targetType} #{targetId}</span>
                        </p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                {reasons.map((r, i) => (
                                    <Form.Check
                                        key={i}
                                        type="radio"
                                        name="reportReason"
                                        id={`reason-${i}`}
                                        label={<span className="text-light small ms-2">{r}</span>}
                                        value={r}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="mb-2 custom-radio-glow"
                                    />
                                ))}
                            </Form.Group>
                            <div className="d-flex gap-2">
                                <Button variant="secondary" onClick={onHide} className="flex-grow-1 rounded-pill border-0 bg-white-alpha hover-bg-white-alpha-2">
                                    Abort
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={submitting || !reason} 
                                    className="flex-grow-1 btn-super-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
                                >
                                    {submitting ? <Spinner size="sm" /> : <ShieldAlert size={16} />}
                                    Execute Flag
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ReportModal;

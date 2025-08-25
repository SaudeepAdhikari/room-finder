import React, { useEffect, useState } from 'react';
import { FaCheck, FaTrash, FaFlag, FaStar } from 'react-icons/fa/index.esm.js';
import './ReviewModeration.css';
import './AdminCommon.css';
import { fetchAllReviewsAdmin, approveReviewAdmin, deleteReviewAdmin, reportReviewAdmin } from '../api.js';

function ReviewModeration() {
    const [reviews, setReviews] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [room, setRoom] = useState('');
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadReviews();
    }, []);

    useEffect(() => {
        let data = [...reviews];
        if (room) data = data.filter(r => r.room && r.room.title && r.room.title.toLowerCase().includes(room.toLowerCase()));
        if (user) data = data.filter(r => r.user && r.user.email && r.user.email.toLowerCase().includes(user.toLowerCase()));
        setFiltered(data);
    }, [reviews, room, user]);

    const loadReviews = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchAllReviewsAdmin();
            setReviews(data);
        } catch (e) {
            console.error('Error loading reviews:', e);
            setError(e.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };
    
    const handleRetry = () => {
        loadReviews();
    };

    const handleApprove = async id => {
        await approveReviewAdmin(id);
        setReviews(reviews => reviews.map(r => r._id === id ? { ...r, status: 'approved' } : r));
    };
    const handleDelete = async id => {
        if (!window.confirm('Delete this review?')) return;
        await deleteReviewAdmin(id);
        setReviews(reviews => reviews.filter(r => r._id !== id));
    };
    const handleReport = async id => {
        await reportReviewAdmin(id);
        setReviews(reviews => reviews.map(r => r._id === id ? { ...r, reported: true } : r));
    };

    return (
        <div className="review-moderation-root">
            <div className="review-moderation-header">
                <h2>Review Moderation</h2>
            </div>
            <div className="review-moderation-controls">
                <input className="review-moderation-room" value={room} onChange={e => setRoom(e.target.value)} placeholder="Filter by room..." />
                <input className="review-moderation-user" value={user} onChange={e => setUser(e.target.value)} placeholder="Filter by user email..." />
            </div>
            {loading ? (
                <div className="review-moderation-loading">
                    <div>Loading reviews...</div>
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="review-moderation-error">
                    <div className="error-message">Error: {error}</div>
                    <button className="retry-button" onClick={handleRetry}>
                        Retry
                    </button>
                </div>
            ) : (
                <div className="review-moderation-table-wrap">
                    <table className="review-moderation-table">
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>User</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r._id}>
                                    <td>{r.room?.title || '-'}</td>
                                    <td>{r.user?.email || '-'}</td>
                                    <td>{[...Array(5)].map((_, i) => <FaStar key={i} color={i < r.rating ? '#f59e42' : '#e5e7eb'} />)}</td>
                                    <td>{r.comment}</td>
                                    <td>{r.status}</td>
                                    <td>
                                        {r.status !== 'approved' && (
                                            <button className="review-moderation-action review-moderation-approve" onClick={() => handleApprove(r._id)}><FaCheck /> Approve</button>
                                        )}
                                        <button className="review-moderation-action review-moderation-delete" onClick={() => handleDelete(r._id)}><FaTrash /> Delete</button>
                                        {!r.reported && (
                                            <button className="review-moderation-action review-moderation-report" onClick={() => handleReport(r._id)}><FaFlag /> Report</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {error && <div className="review-moderation-error">{error}</div>}
        </div>
    );
}

export default ReviewModeration; 
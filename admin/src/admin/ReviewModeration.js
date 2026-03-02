import React, { useEffect, useState } from 'react';
import { FaCheck, FaTrash, FaFlag, FaStar, FaSync, FaSearch, FaUser, FaExclamationCircle } from 'react-icons/fa/index.esm.js';
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
        <div className="review-moderation-root animation-fade-in">
            <div className="page-header-actions">
                <div>
                    <h2 className="admin-page-title">Review Moderation</h2>
                    <p className="admin-page-subtitle">Manage guest feedback and ensure community standards are maintained.</p>
                </div>
                <button className="btn-premium" onClick={loadReviews} title="Refresh">
                    <FaSync /> {!loading && "Refresh"}
                </button>
            </div>

            <div className="premium-card review-controls-card">
                <div className="review-mgmt-controls">
                    <div className="search-group">
                        <FaSearch className="search-icon" />
                        <input className="input-premium" value={room} onChange={e => setRoom(e.target.value)} placeholder="Filter by property title..." />
                    </div>
                    <div className="search-group">
                        <FaUser className="search-icon" />
                        <input className="input-premium" value={user} onChange={e => setUser(e.target.value)} placeholder="Filter by user email..." />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="premium-card loading-state">
                    <div className="spinner"></div>
                    <p>Fetching reviews...</p>
                </div>
            ) : error ? (
                <div className="premium-card error-panel">
                    <FaExclamationCircle className="error-icon" />
                    <div>
                        <p>{error}</p>
                        <button className="btn-premium" style={{ marginTop: '12px' }} onClick={handleRetry}>Retry</button>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="premium-card no-data-state">
                    <FaStar className="empty-icon" />
                    <p>No reviews found matching your criteria.</p>
                </div>
            ) : (
                <div className="premium-card table-card">
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Reviewer</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r._id}>
                                        <td>
                                            <div className="property-cell-mini">
                                                <div className="property-title-mini">{r.room?.title || 'Unknown Property'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="reviewer-email">{r.user?.email || 'N/A'}</div>
                                        </td>
                                        <td>
                                            <div className="rating-stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < r.rating ? 'star-filled' : 'star-empty'} />
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="review-comment-cell" title={r.comment}>
                                                {r.comment}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge-status ${r.status === 'approved' ? 'success' : 'warning'} ${r.reported ? 'reported' : ''}`}>
                                                {r.reported ? 'Flagged' : r.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="action-btns">
                                                {r.status !== 'approved' && (
                                                    <button className="btn-icon-premium success" onClick={() => handleApprove(r._id)} title="Approve"><FaCheck /></button>
                                                )}
                                                {r.reported ? (
                                                    <span className="action-indicator flagged"><FaFlag /></span>
                                                ) : (
                                                    <button className="btn-icon-premium warning" onClick={() => handleReport(r._id)} title="Flag/Report"><FaFlag /></button>
                                                )}
                                                <button className="btn-icon-premium delete" onClick={() => handleDelete(r._id)} title="Delete"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewModeration; 
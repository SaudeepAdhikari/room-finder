import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaSearch, FaSync, FaExclamationCircle, FaCalendarAlt } from 'react-icons/fa/index.esm.js';
import './BookingHistory.css';
import './AdminCommon.css';
import { fetchAllBookingsAdmin, updateBookingStatusAdmin } from '../api.js';

function BookingHistory({ searchFilter }) {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [user, setUser] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBookings();
    }, []);

    useEffect(() => {
        let data = [...bookings];

        // Apply text search filter
        if (search) {
            data = data.filter(b =>
                (b._id && b._id.toLowerCase().includes(search.toLowerCase())) ||
                (b.room && b.room.title && b.room.title.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // Apply other filters
        if (status) data = data.filter(b => b.status === status);
        if (user) data = data.filter(b => b.tenant && b.tenant.email && b.tenant.email.toLowerCase().includes(user.toLowerCase()));
        if (date) data = data.filter(b => b.createdAt && b.createdAt.slice(0, 10) === date);

        // Apply search filter from universal search if present
        if (searchFilter) {
            data = data.filter(b => b._id === searchFilter);
        }

        setFiltered(data);
    }, [bookings, search, status, user, date, searchFilter]);

    const loadBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchAllBookingsAdmin();
            setBookings(data);
        } catch (e) {
            console.error('Error loading bookings:', e);
            setError(e.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        loadBookings();
    };

    const handleStatus = async (id, newStatus) => {
        await updateBookingStatusAdmin(id, newStatus);
        setBookings(bookings => bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div className="booking-history-root animation-fade-in">
            <div className="page-header-actions">
                <div>
                    <h2 className="admin-page-title">Booking History</h2>
                    <p className="admin-page-subtitle">Track and manage all property reservations and their current status.</p>
                </div>
            </div>

            <div className="premium-card booking-mgmt-controls-card">
                <div className="booking-mgmt-controls">
                    <div className="search-group">
                        <FaSearch className="search-icon" />
                        <input className="input-premium" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or property..." />
                    </div>

                    <div className="filter-group">
                        <input className="input-premium date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        <select className="input-premium select-premium" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="">Status: All</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="btn-premium-outline" onClick={loadBookings} title="Refresh">
                            <FaSync />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="premium-card loading-state">
                    <div className="spinner"></div>
                    <p>Fetching booking records...</p>
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
                    <FaCalendarAlt className="empty-icon" />
                    <p>No bookings found matching your filters.</p>
                </div>
            ) : (
                <div className="premium-card table-card">
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Property</th>
                                    <th>Tenant</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(b => (
                                    <tr key={b._id}>
                                        <td>
                                            <code className="booking-ref">{b._id.substring(0, 8)}...</code>
                                        </td>
                                        <td>
                                            <div className="property-cell">
                                                <div className="property-info-mini">
                                                    <div className="property-title-mini">{b.room?.title || 'Unknown Property'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tenant-info">
                                                <div className="tenant-email">{b.tenant?.email || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                {b.createdAt ? new Date(b.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="amount-cell font-bold">${b.totalAmount}</div>
                                        </td>
                                        <td>
                                            <span className={`badge-status ${b.status}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="action-btns">
                                                {b.status !== 'cancelled' && b.status !== 'completed' && (
                                                    <>
                                                        <button className="btn-icon-premium success" onClick={() => handleStatus(b._id, 'completed')} title="Complete"><FaCheck /></button>
                                                        <button className="btn-icon-premium delete" onClick={() => handleStatus(b._id, 'cancelled')} title="Cancel"><FaTimes /></button>
                                                    </>
                                                )}
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

export default BookingHistory; 
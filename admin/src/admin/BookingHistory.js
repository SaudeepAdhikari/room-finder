import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaSearch } from 'react-icons/fa/index.esm.js';
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
        <div className="booking-history-root">
            <div className="booking-history-header">
                <h2>Booking History</h2>
            </div>
            <div className="booking-history-controls">
                <input className="booking-history-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or room..." />
                <input className="booking-history-user" value={user} onChange={e => setUser(e.target.value)} placeholder="Filter by user email..." />
                <input className="booking-history-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            {loading ? (
                <div className="booking-history-loading">
                    <div>Loading bookings...</div>
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="booking-history-table-wrap">
                    <table className="booking-history-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Room</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => (
                                <tr key={b._id}>
                                    <td>{b._id}</td>
                                    <td>{b.room?.title || '-'}</td>
                                    <td>{b.tenant?.email || '-'}</td>
                                    <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</td>
                                    <td>{b.totalAmount}</td>
                                    <td>{b.status}</td>
                                    <td>
                                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                                            <>
                                                <button className="booking-history-action booking-history-complete" onClick={() => handleStatus(b._id, 'completed')}><FaCheck /> Complete</button>
                                                <button className="booking-history-action booking-history-cancel" onClick={() => handleStatus(b._id, 'cancelled')}><FaTimes /> Cancel</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {error && (
                <div className="booking-history-error">
                    <div className="error-message">Error: {error}</div>
                    <button className="retry-button" onClick={handleRetry}>
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}

export default BookingHistory; 
import React, { useEffect, useState } from 'react';
import { FaHome, FaBook, FaUserCheck, FaStar } from 'react-icons/fa/index.esm.js';

import Card from '../components/ui/Card.js';
import './AdminDashboardOverview.css';
import { getRoomCountAdmin, getUserCountAdmin, getAdminBookingsCount } from '../api.js';

const DashboardOverview = () => {
    const [rooms, setRooms] = useState('-');
    const [bookings, setBookings] = useState('-');
    const [users, setUsers] = useState('-');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getRoomCountAdmin().then(res => res.total ?? '-').catch(() => '-'),
            getAdminBookingsCount().then(res => res.count ?? '-').catch(() => '-'),
            getUserCountAdmin().then(res => res.count ?? '-').catch(() => '-')
        ]).then(([roomCount, bookingCount, userCount]) => {
            setRooms(roomCount);
            setBookings(bookingCount);
            setUsers(userCount);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="dashboard-overview-grid">
            <Card className="dashboard-card" hoverable>
                <div className="dashboard-icon" style={{ background: '#2563eb' }}><FaHome /></div>
                <div className="dashboard-label">Total Rooms</div>
                <div className="dashboard-value">{loading ? '...' : rooms}</div>
            </Card>
            <Card className="dashboard-card" hoverable>
                <div className="dashboard-icon" style={{ background: '#22c55e' }}><FaBook /></div>
                <div className="dashboard-label">Total Bookings</div>
                <div className="dashboard-value">{loading ? '...' : bookings}</div>
            </Card>
            <Card className="dashboard-card" hoverable>
                <div className="dashboard-icon" style={{ background: '#f59e42' }}><FaUserCheck /></div>
                <div className="dashboard-label">Verified Users</div>
                <div className="dashboard-value">{loading ? '...' : users}</div>
            </Card>
            <Card className="dashboard-card" hoverable>
                <div className="dashboard-icon" style={{ background: '#ef4444' }}><FaStar /></div>
                <div className="dashboard-label">Reviews Count</div>
                <div className="dashboard-value">0</div>
            </Card>
        </div>
    );
};

export default DashboardOverview; 
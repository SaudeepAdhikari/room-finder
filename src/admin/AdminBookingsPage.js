import React from 'react';

import BookingHistory from './BookingHistory';
import './AdminPage.css';

const AdminBookingsPage = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Booking Management</h1>
      <div className="admin-page-content">
        <BookingHistory />
      </div>
    </div>
  );
};

export default AdminBookingsPage;

import React from 'react';

import ReviewModeration from './ReviewModeration.js';
import './AdminPage.css';

const AdminReviewsPage = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Review Management</h1>
      <div className="admin-page-content">
        <ReviewModeration />
      </div>
    </div>
  );
};

export default AdminReviewsPage;

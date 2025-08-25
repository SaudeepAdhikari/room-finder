import React from 'react';

import UserManagement from './UserManagement.js';
import './AdminPage.css';

const AdminUsersPage = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-page-title">User Management</h1>
      <div className="admin-page-content">
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminUsersPage;

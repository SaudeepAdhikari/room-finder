import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAdminUser } from './AdminUserContext';
import { useToast } from '../context/ToastContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const { admin, loading, logout } = useAdminUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      showToast('Logged out successfully.', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Logout failed.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="admin-access-denied">
        <div className="admin-access-denied-icon">⚠️</div>
        <h2>Access Denied</h2>
        <p>You must be an admin to access this area.</p>
        <button onClick={() => navigate('/')} className="admin-back-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar admin={admin} onLogout={handleLogout} />
      
      <div className="admin-content">
        <AdminHeader />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

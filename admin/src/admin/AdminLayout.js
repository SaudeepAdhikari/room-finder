import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAdminUser } from './AdminUserContext.js';
import { useToast } from '../context/ToastContext.js';
import AdminHeader from './AdminHeader.js';
import AdminSidebar from './AdminSidebar.js';
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
    // Redirect unauthenticated users to the login route.
    navigate('/adminlogin');
    return null;
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

import React, { useState, useEffect } from 'react';
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

  // SaaS State Management
  const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('admin-sidebar-collapsed') === 'true');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect straight to admin login after logout (no popup)
      navigate('/adminlogin');
    } catch (error) {
      console.error('Logout error:', error);
      // on failure, still try to navigate to login
      navigate('/adminlogin');
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
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar
        admin={admin}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      <div className="admin-content">
        <AdminHeader theme={theme} onToggleTheme={toggleTheme} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

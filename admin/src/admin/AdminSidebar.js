import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaBed, FaUsers, FaCalendarAlt, FaStar,
  FaCog, FaBars, FaTimes,
  FaChevronLeft, FaChevronRight, FaChartBar, FaFileInvoiceDollar, FaUser
} from 'react-icons/fa/index.esm.js';
import './AdminSidebar.css';

const AdminSidebar = ({ admin, onLogout, collapsed, onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Close mobile sidebar on wider screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const routes = [
    { path: '/admin', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/rooms', name: 'Rooms', icon: <FaBed /> },
    { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
    { path: '/admin/bookings', name: 'Bookings', icon: <FaCalendarAlt /> },
    { path: '/admin/reviews', name: 'Reviews', icon: <FaStar /> },
    { path: '/admin/analytics', name: 'Analytics', icon: <FaChartBar /> },
    { path: '/admin/payments', name: 'Payments', icon: <FaFileInvoiceDollar /> },
  ];

  const renderNavLinks = () => {
    return routes.map((route) => (
      <NavLink
        to={route.path}
        key={route.path}
        className={({ isActive }) =>
          `admin-sidebar-link ${isActive ? 'active' : ''}`
        }
        end={route.path === '/admin'}
      >
        <div className="admin-sidebar-link-icon">{route.icon}</div>
        {!collapsed && <span className="admin-sidebar-text">{route.name}</span>}
        {collapsed && <div className="admin-sidebar-tooltip">{route.name}</div>}
      </NavLink>
    ));
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay active"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Toggle button */}
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        {/* Sidebar Header with Branding */}
        <div className="admin-sidebar-header">
          <NavLink to="/admin" className="admin-sidebar-logo">
            <div className="logo-icon">S</div>
            {!collapsed && <span className="logo-text">SajiloStay</span>}
          </NavLink>

        </div>

        {/* Navigation links */}
        <nav className="admin-sidebar-nav">
          {renderNavLinks()}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;

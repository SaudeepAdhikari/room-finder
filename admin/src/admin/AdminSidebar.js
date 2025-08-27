import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBed, FaUsers, FaCalendarAlt, 
  FaStar, FaCog, FaBars, FaTimes,
  FaChevronLeft, FaChevronRight, FaChartLine
} from 'react-icons/fa/index.esm.js';
import './AdminSidebar.css';
const AdminSidebar = ({ admin, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Close mobile sidebar on wider screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const routes = [
    { path: '/admin', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/rooms', name: 'Rooms', icon: <FaBed /> },
    { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
    { path: '/admin/bookings', name: 'Bookings', icon: <FaCalendarAlt /> },
    { path: '/admin/reviews', name: 'Reviews', icon: <FaStar /> },
    { path: '/admin/analytics', name: 'Analytics', icon: <FaChartLine /> },
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
        <div className="admin-sidebar-icon">{route.icon}</div>
        <span className={`admin-sidebar-text ${collapsed ? 'collapsed' : ''}`}>
          {route.name}
        </span>
        {collapsed && <div className="admin-sidebar-tooltip">{route.name}</div>}
      </NavLink>
    ));
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`admin-sidebar-overlay ${mobileOpen ? 'active' : ''}`} 
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile toggle button */}
      <button 
        className="admin-sidebar-mobile-toggle" 
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar container */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Toggle button */}
        <button 
          className="admin-sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        
        {/* Admin info */}
        <div className="admin-sidebar-header">
          <img
            src={admin?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff'}
            alt="Admin Avatar"
            className="admin-sidebar-avatar"
          />
          <div className={`admin-sidebar-info ${collapsed ? 'collapsed' : ''}`}>
            <div className="admin-sidebar-name">
              {admin?.firstName || admin?.email?.split('@')[0] || 'Admin'}
            </div>
            <div className="admin-sidebar-role">Administrator</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="admin-sidebar-nav">
          {renderNavLinks()}
        </nav>

  {/* Logout moved to header profile dropdown */}
      </aside>
    </>
  );
};

export default AdminSidebar;

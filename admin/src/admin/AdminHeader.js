import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaEnvelope, FaExclamationTriangle, FaCalendarCheck } from 'react-icons/fa/index.esm.js';

import AdminSearchBar from './AdminSearchBar.js';
import NotificationsCenter from './NotificationsCenter';
import { getAdminNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api.js';
import './AdminHeader.css';
import { useAdminUser } from './AdminUserContext.js';
import AdminProfilePanel from './AdminProfilePanel.js';
import { useToast } from '../context/ToastContext.js';

// Page title mapping
const PAGE_TITLES = {
  '/admin': 'Dashboard Overview',
  '/admin/rooms': 'Room Management',
  '/admin/users': 'User Management',
  '/admin/bookings': 'Booking Management',
  '/admin/reviews': 'Review Management',
  '/admin/settings': 'Admin Settings',
};

function AdminHeader() {
  const location = useLocation();
  const pageName = PAGE_TITLES[location.pathname] || 'Admin Dashboard';
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    bookings: [],
    alerts: [],
    messages: []
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  // Create notification audio element with fallback handling
  const notificationAudioRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Initialize audio with error handling
  useEffect(() => {
    try {
      notificationAudioRef.current = new Audio('/notification-sound.mp3');
      // Add error event handler
      notificationAudioRef.current.addEventListener('error', () => {
      });
    } catch (err) {
    }
  }, []);
  
  // Fetch notifications from the backend
  const fetchNotifications = useCallback(async () => {
    // Skip loading state if we're just refreshing in the background
    const isInitialLoad = !notifications.bookings.length && 
                          !notifications.alerts.length && 
                          !notifications.messages.length;
    
    if (isInitialLoad) {
      setLoading(true);
    }
    
    try {
      const data = await getAdminNotifications();
      
      // Count previous unread notifications to detect new ones
      const previousUnreadCount = unreadCount;
      
      // Transform the data into our notification structure
      const transformedData = {
        bookings: data.filter(item => item.type === 'booking').map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          time: formatNotificationTime(item.createdAt),
          isNew: !item.read,
          originalData: item // Keep the original data for reference
        })),
        alerts: data.filter(item => item.type === 'alert').map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          time: formatNotificationTime(item.createdAt),
          isNew: !item.read,
          originalData: item
        })),
        messages: data.filter(item => item.type === 'message').map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          time: formatNotificationTime(item.createdAt),
          isNew: !item.read,
          originalData: item
        }))
      };
      
      // Calculate new unread count
      const newBookings = transformedData.bookings.filter(item => item.isNew).length;
      const newAlerts = transformedData.alerts.filter(item => item.isNew).length;
      const newMessages = transformedData.messages.filter(item => item.isNew).length;
      const newUnreadCount = newBookings + newAlerts + newMessages;
      
      // Play notification sound if there are new notifications (and not first load)
      if (!isInitialLoad && newUnreadCount > previousUnreadCount && notificationAudioRef.current) {
        try {
          // Reset the audio to the beginning and play
          notificationAudioRef.current.currentTime = 0;
          notificationAudioRef.current.play().catch(e => {
            // Silent catch - browsers may block autoplay
          });
        } catch (audioErr) {
          // Ignore audio errors
        }
      }
      
      setNotifications(transformedData);
      setUnreadCount(newUnreadCount);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [unreadCount, notifications.alerts.length, notifications.bookings.length, notifications.messages.length]);
  
  // Helper function to format notification time
  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return notificationDate.toLocaleDateString();
  };

  // Initial fetch of notifications and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Set up an interval to check for new notifications periodically
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Check for new notifications every minute
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Handle click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideProfile);
    return () => document.removeEventListener('mousedown', handleClickOutsideProfile);
  }, []);

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setNotificationOpen(!notificationOpen);
    
    // If opening the dropdown, fetch fresh notifications
    if (!notificationOpen) {
      fetchNotifications();
    }
  };

  // Mark a notification as read
  const markAsRead = async (type, id) => {
    try {
      // Update UI immediately for better UX
      setNotifications(prev => ({
        ...prev,
        [type]: prev[type].map(item => 
          item.id === id ? { ...item, isNew: false } : item
        )
      }));
      
      // Call API to update backend
      await markNotificationAsRead(id);
      
      // Recalculate unread count
      const newBookings = notifications.bookings.filter(item => item.isNew && item.id !== id).length;
      const newAlerts = notifications.alerts.filter(item => item.isNew && item.id !== id).length;
      const newMessages = notifications.messages.filter(item => item.isNew && item.id !== id).length;
      setUnreadCount(newBookings + newAlerts + newMessages);
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read`, err);
      // Show a brief error toast or message
      setError(`Failed to mark notification as read. ${err.message}`);
      // Rollback the UI change if API call fails
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
      fetchNotifications(); // Refresh notifications from server
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update UI immediately for better UX
      setNotifications(prev => ({
        bookings: prev.bookings.map(item => ({ ...item, isNew: false })),
        alerts: prev.alerts.map(item => ({ ...item, isNew: false })),
        messages: prev.messages.map(item => ({ ...item, isNew: false }))
      }));
      
      // Update unread count
      setUnreadCount(0);
      
      // Call API to update backend
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
      // Show a brief error message
      setError(`Failed to mark all notifications as read. ${err.message}`);
      // Clear error after a few seconds
      setTimeout(() => setError(null), 3000);
      // Rollback the UI change if API call fails
      fetchNotifications();
    }
  };

  // Function for logging out - can be expanded later
  const { logout } = useAdminUser();
  const { admin } = useAdminUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
  // Redirect straight to admin login without a popup
  navigate('/adminlogin');
    } catch (err) {
      console.error('Header logout error:', err);
  navigate('/adminlogin');
    }
  };

  const toggleProfile = () => setProfileOpen(v => !v);

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-left">
          <div className="admin-branding">
            <span className="admin-logo">SajiloStay</span>
            <span className="admin-dashboard-text">
              Admin Dashboard
              <span className="admin-underline-accent"></span>
            </span>
          </div>
          <h2 className="admin-header-title">{pageName}</h2>
        </div>
        
        <div className="admin-header-right">
          <AdminSearchBar />
          
          {/* Notification Bell */}
          <div className="admin-notification-container" ref={notificationRef}>
            <button 
              className="admin-notification-bell" 
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="admin-notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {notificationOpen && (
              <div className="admin-notification-dropdown">
                <NotificationsCenter
                  notifications={notifications}
                  onMarkRead={markAsRead}
                  onMarkAllRead={markAllAsRead}
                  onRefresh={fetchNotifications}
                  loading={loading}
                  error={error}
                  unreadCount={unreadCount}
                />
              </div>
            )}
          </div>
          
          <div className="admin-user-controls" ref={profileRef}>
            <button className="admin-profile-button" onClick={toggleProfile} aria-haspopup="true" aria-expanded={profileOpen}>
              <img
                src={admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.firstName || admin?.name || 'Admin')}`}
                alt="Admin Avatar"
                className="admin-avatar"
              />
              <span className="admin-username">{admin?.firstName ? `${admin.firstName} ${admin.lastName || ''}`.trim() : admin?.name || 'Admin'}</span>
            </button>

            {profileOpen && (
              <div className="admin-profile-dropdown admin-profile-card" role="menu" aria-label="Profile menu">
                <div className="admin-profile-card-header">
                  <div className="admin-profile-card-avatar">
                    <img src={admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.firstName || admin?.name || 'Admin')}`} alt="Admin avatar" />
                  </div>
                  <div className="admin-profile-card-info">
                    <div className="admin-profile-card-name">{admin?.firstName ? `${admin.firstName} ${admin.lastName || ''}`.trim() : admin?.name || 'Admin'}</div>
                    <div className="admin-profile-card-email">{admin?.email || '-'}</div>
                  </div>
                </div>

                <div className="admin-profile-card-actions">
                  <button className="admin-profile-action" onClick={() => { setProfileOpen(false); navigate('/admin/profile'); }}>
                    Profile
                  </button>
                  <button className="admin-profile-action" onClick={() => { setProfileOpen(false); handleLogout(); }}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
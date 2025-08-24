import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBell, FaEnvelope, FaExclamationTriangle, FaCalendarCheck } from 'react-icons/fa';

import AdminSearchBar from './AdminSearchBar';
import { getAdminNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api';
import './AdminHeader.css';

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
  
  // Create notification audio element with fallback handling
  const notificationAudioRef = useRef(null);
  
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
  const handleLogout = () => {
    // Add actual logout functionality here
  };

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
                <div className="admin-notification-header">
                  <h3>Notifications</h3>
                  {!loading && unreadCount > 0 && (
                    <button 
                      className="admin-notification-read-all" 
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {loading && (
                  <div className="admin-notification-loading">
                    <div className="admin-notification-loading-spinner"></div>
                    <p>Loading notifications...</p>
                  </div>
                )}
                
                {error && !loading && (
                  <div className="admin-notification-error">
                    <FaExclamationTriangle />
                    <p>{error}</p>
                    <button onClick={fetchNotifications} className="admin-notification-retry">
                      Retry
                    </button>
                  </div>
                )}
                
                {!loading && !error && (
                  <div className="admin-notification-content">
                    {/* Bookings Section */}
                    {notifications.bookings.length > 0 && (
                      <div className="admin-notification-section">
                        <div className="admin-notification-section-header">
                          <FaCalendarCheck />
                          <h4>New Bookings</h4>
                        </div>
                        
                        <div className="admin-notification-list">
                          {notifications.bookings.map(notification => (
                            <div 
                              key={`booking-${notification.id}`}
                              className={`admin-notification-item ${notification.isNew ? 'new' : ''}`}
                              onClick={() => markAsRead('bookings', notification.id)}
                            >
                              <div className="admin-notification-icon booking">
                                <FaCalendarCheck />
                              </div>
                              <div className="admin-notification-details">
                                <div className="admin-notification-title">{notification.title}</div>
                                <div className="admin-notification-message">{notification.message}</div>
                                <div className="admin-notification-time">{notification.time}</div>
                              </div>
                              {notification.isNew && <div className="admin-notification-dot"></div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Admin Alerts Section */}
                    {notifications.alerts.length > 0 && (
                      <div className="admin-notification-section">
                        <div className="admin-notification-section-header">
                          <FaExclamationTriangle />
                          <h4>Admin Alerts</h4>
                        </div>
                        
                        <div className="admin-notification-list">
                          {notifications.alerts.map(notification => (
                            <div 
                              key={`alert-${notification.id}`}
                              className={`admin-notification-item ${notification.isNew ? 'new' : ''}`}
                              onClick={() => markAsRead('alerts', notification.id)}
                            >
                              <div className="admin-notification-icon alert">
                                <FaExclamationTriangle />
                              </div>
                              <div className="admin-notification-details">
                                <div className="admin-notification-title">{notification.title}</div>
                                <div className="admin-notification-message">{notification.message}</div>
                                <div className="admin-notification-time">{notification.time}</div>
                              </div>
                              {notification.isNew && <div className="admin-notification-dot"></div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* User Messages Section */}
                    {notifications.messages.length > 0 && (
                      <div className="admin-notification-section">
                        <div className="admin-notification-section-header">
                          <FaEnvelope />
                          <h4>User Messages</h4>
                        </div>
                        
                        <div className="admin-notification-list">
                          {notifications.messages.map(notification => (
                            <div 
                              key={`message-${notification.id}`}
                              className={`admin-notification-item ${notification.isNew ? 'new' : ''}`}
                              onClick={() => markAsRead('messages', notification.id)}
                            >
                              <div className="admin-notification-icon message">
                                <FaEnvelope />
                              </div>
                              <div className="admin-notification-details">
                                <div className="admin-notification-title">{notification.title}</div>
                                <div className="admin-notification-message">{notification.message}</div>
                                <div className="admin-notification-time">{notification.time}</div>
                              </div>
                              {notification.isNew && <div className="admin-notification-dot"></div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!notifications.bookings.length && !notifications.alerts.length && !notifications.messages.length && (
                      <div className="admin-notification-no-results">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                        <p>No notifications to display</p>
                        <span>You're all caught up!</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="admin-notification-footer">
                  <button 
                    className="admin-notification-view-all"
                    onClick={() => {
                      // This could navigate to a dedicated notifications page
                      setNotificationOpen(false);
                    }}
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="admin-user-controls">
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="Admin Avatar"
              className="admin-avatar"
            />
            <span className="admin-username">Admin</span>
            <button className="admin-logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
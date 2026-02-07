import React, { useState, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import './NotificationButton.css';

function formatTime(iso) {
  try {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
    const days = Math.floor(h / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } catch (e) { return ''; }
}

export default function NotificationButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { user } = useUser();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      // Mark all as read when opened
      markAllAsRead();
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.relatedModel === 'Booking' && notification.relatedId) {
      navigate(`/profile?tab=bookings`);
    }
    setOpen(false);
  };

  // Don't show notification button if user is not logged in
  if (!user) return null;

  return (
    <div className="rf-notification-wrapper" ref={wrapperRef}>
      <button className="rf-notification-btn" onClick={handleToggle} aria-label="Notifications">
        <FaBell />
        {unreadCount > 0 && <span className="rf-notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="rf-notification-dropdown">
          <div className="rf-notification-header">Notifications</div>
          <div className="rf-notification-list">
            {notifications.length === 0 && <div className="rf-notification-empty">No notifications</div>}
            {notifications.slice(0, 10).map(notif => (
              <div
                key={notif._id}
                className={`rf-notification-item ${notif.isRead ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notif)}
                style={{ cursor: 'pointer' }}
              >
                <div className="rf-notification-item-left">
                  <div className="rf-notification-title">{notif.message}</div>
                  <div className="rf-notification-meta">{formatTime(notif.createdAt)}</div>
                </div>
                {!notif.isRead && <div className="rf-notification-unread-dot"></div>}
              </div>
            ))}
          </div>
          {notifications.length > 0 && (
            <div className="rf-notification-footer">
              <button
                className="rf-notification-viewall"
                onClick={() => {
                  navigate('/profile?tab=notifications');
                  setOpen(false);
                }}
              >
                View all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

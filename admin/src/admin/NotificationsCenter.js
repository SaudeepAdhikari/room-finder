import React, { useMemo } from 'react';
import './NotificationsCenter.css';

// NotificationsCenter is now a presentational component that accepts
// grouped notifications and handler callbacks from the parent (header).
export default function NotificationsCenter({
  className,
  notifications = { bookings: [], alerts: [], messages: [] },
  onMarkRead = () => {},
  onMarkAllRead = () => {},
  onRefresh = () => {},
  loading = false,
  error = null,
  unreadCount = 0,
}) {
  const hasAny = (notifications.bookings.length + notifications.alerts.length + notifications.messages.length) > 0;

  return (
    <div className={`notifications-center ${className || ''}`}>
      <div className="notifications-header">
        <h4>Notifications</h4>
        <div className="notifications-actions">
          <div className="notifications-filter">
            <button className={`btn ${unreadCount > 0 ? 'btn-primary' : 'btn-secondary'}`} onClick={onRefresh}>Refresh</button>
          </div>
          <button className="btn btn-secondary" onClick={onMarkAllRead}>Mark all read</button>
        </div>
      </div>

      <div className="notifications-list">
        {loading && <div className="notifications-empty">Loading...</div>}
        {error && <div className="notifications-empty">{error}</div>}

        {!loading && !error && !hasAny && (
          <div className="notifications-empty">No notifications</div>
        )}

        {!loading && !error && (
          <>
            {notifications.bookings.length > 0 && (
              <div className="notification-section">
                <div className="notification-section-header">New Bookings</div>
                {notifications.bookings.map(n => (
                  <div key={`booking-${n.id}`} className={`notification-item ${n.isNew ? 'unread' : ''}`} onClick={() => onMarkRead('bookings', n.id)}>
                    <div className="notification-body">
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-text">{n.message}</div>
                    </div>
                    <div className="notification-meta">{n.time}</div>
                  </div>
                ))}
              </div>
            )}

            {notifications.alerts.length > 0 && (
              <div className="notification-section">
                <div className="notification-section-header">Admin Alerts</div>
                {notifications.alerts.map(n => (
                  <div key={`alert-${n.id}`} className={`notification-item ${n.isNew ? 'unread' : ''}`} onClick={() => onMarkRead('alerts', n.id)}>
                    <div className="notification-body">
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-text">{n.message}</div>
                    </div>
                    <div className="notification-meta">{n.time}</div>
                  </div>
                ))}
              </div>
            )}

            {notifications.messages.length > 0 && (
              <div className="notification-section">
                <div className="notification-section-header">User Messages</div>
                {notifications.messages.map(n => (
                  <div key={`msg-${n.id}`} className={`notification-item ${n.isNew ? 'unread' : ''}`} onClick={() => onMarkRead('messages', n.id)}>
                    <div className="notification-body">
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-text">{n.message}</div>
                    </div>
                    <div className="notification-meta">{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { fetchBookingsForMyRooms } from '../api';
import './NotificationButton.css';
import { useNavigate } from 'react-router-dom';

const LAST_SEEN_KEY = 'rf_myroom_notifications_last_seen_v1';

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
  const [unseenCount, setUnseenCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const pollingRef = useRef(null);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const getLastSeen = () => {
    const v = localStorage.getItem(LAST_SEEN_KEY);
    return v ? new Date(v) : new Date(0);
  };

  const setLastSeen = (date = new Date()) => {
    localStorage.setItem(LAST_SEEN_KEY, date.toISOString());
  };

  const fetchAndCompute = async () => {
    try {
      const bookings = await fetchBookingsForMyRooms();
      if (!Array.isArray(bookings)) return;

      // consider 'pending' bookings as booking attempts
      const pending = bookings.filter(b => b.status === 'pending');

      const lastSeen = getLastSeen();
      const newOnes = pending.filter(b => new Date(b.createdAt) > lastSeen);

      setUnseenCount(newOnes.length);
      // keep a short list for dropdown (most recent 6)
      const recent = pending
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map(b => ({ id: b._id || b.id, title: b.room?.title || b.roomTitle || 'Room', tenant: b.tenant?.firstName ? `${b.tenant.firstName} ${b.tenant.lastName || ''}`.trim() : (b.tenant?.email || 'Guest'), createdAt: b.createdAt, original: b }));

      setItems(recent);
    } catch (err) {
      // silent
      console.debug('NotificationButton fetch error', err);
    }
  };

  useEffect(() => {
    // initial fetch
    fetchAndCompute();
    // poll every 10s
    pollingRef.current = setInterval(fetchAndCompute, 10000);
    return () => clearInterval(pollingRef.current);
  }, []);

  // Close dropdown on outside click (mousedown/touchstart)
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
    if (next) {
      // mark seen when opened
      setLastSeen(new Date());
      setUnseenCount(0);
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate('/bookings/for-my-rooms');
  };

  return (
    <div className="rf-notification-wrapper" ref={wrapperRef}>
      <button className="rf-notification-btn" onClick={handleToggle} aria-label="Notifications">
        <FaBell />
        {unseenCount > 0 && <span className="rf-notification-badge">{unseenCount > 9 ? '9+' : unseenCount}</span>}
      </button>

      {open && (
        <div className="rf-notification-dropdown">
          <div className="rf-notification-header">Notifications</div>
          <div className="rf-notification-list">
            {items.length === 0 && <div className="rf-notification-empty">No new notification</div>}
            {items.map(it => (
              <div key={it.id} className="rf-notification-item">
                <div className="rf-notification-item-left">
                  <div className="rf-notification-title">{it.title}</div>
                  <div className="rf-notification-meta">by {it.tenant} • {formatTime(it.createdAt)}</div>
                </div>
                <div className="rf-notification-actions">
                  <button onClick={() => { navigate(`/bookings/${it.original._id || it.original.id}`); setOpen(false); }} className="rf-notification-link">Open</button>
                </div>
              </div>
            ))}
          </div>
          <div className="rf-notification-footer">
            <button className="rf-notification-viewall" onClick={handleViewAll}>View all</button>
          </div>
        </div>
      )}
    </div>
  );
}

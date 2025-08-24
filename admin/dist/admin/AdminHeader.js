"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _fa = require("react-icons/fa");
var _AdminSearchBar = _interopRequireDefault(require("./AdminSearchBar"));
var _api = require("../api");
require("./AdminHeader.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Page title mapping
const PAGE_TITLES = {
  '/admin': 'Dashboard Overview',
  '/admin/rooms': 'Room Management',
  '/admin/users': 'User Management',
  '/admin/bookings': 'Booking Management',
  '/admin/reviews': 'Review Management',
  '/admin/settings': 'Admin Settings'
};
function AdminHeader() {
  const location = (0, _reactRouterDom.useLocation)();
  const pageName = PAGE_TITLES[location.pathname] || 'Admin Dashboard';
  const [notificationOpen, setNotificationOpen] = (0, _react.useState)(false);
  const [notifications, setNotifications] = (0, _react.useState)({
    bookings: [],
    alerts: [],
    messages: []
  });
  const [unreadCount, setUnreadCount] = (0, _react.useState)(0);
  const [loading, setLoading] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const notificationRef = (0, _react.useRef)(null);

  // Create notification audio element with fallback handling
  const notificationAudioRef = (0, _react.useRef)(null);

  // Initialize audio with error handling
  (0, _react.useEffect)(() => {
    try {
      notificationAudioRef.current = new Audio('/notification-sound.mp3');
      // Add error event handler
      notificationAudioRef.current.addEventListener('error', () => {});
    } catch (err) {}
  }, []);

  // Fetch notifications from the backend
  const fetchNotifications = (0, _react.useCallback)(async () => {
    // Skip loading state if we're just refreshing in the background
    const isInitialLoad = !notifications.bookings.length && !notifications.alerts.length && !notifications.messages.length;
    if (isInitialLoad) {
      setLoading(true);
    }
    try {
      const data = await (0, _api.getAdminNotifications)();

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
  const formatNotificationTime = timestamp => {
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
  (0, _react.useEffect)(() => {
    fetchNotifications();

    // Set up an interval to check for new notifications periodically
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Check for new notifications every minute

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Handle click outside to close notification dropdown
  (0, _react.useEffect)(() => {
    const handleClickOutside = event => {
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
        [type]: prev[type].map(item => item.id === id ? {
          ...item,
          isNew: false
        } : item)
      }));

      // Call API to update backend
      await (0, _api.markNotificationAsRead)(id);

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
        bookings: prev.bookings.map(item => ({
          ...item,
          isNew: false
        })),
        alerts: prev.alerts.map(item => ({
          ...item,
          isNew: false
        })),
        messages: prev.messages.map(item => ({
          ...item,
          isNew: false
        }))
      }));

      // Update unread count
      setUnreadCount(0);

      // Call API to update backend
      await (0, _api.markAllNotificationsAsRead)();
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
  return /*#__PURE__*/_react.default.createElement("header", {
    className: "admin-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-header-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-header-left"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-branding"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-logo"
  }, "SajiloStay"), /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-dashboard-text"
  }, "Admin Dashboard", /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-underline-accent"
  }))), /*#__PURE__*/_react.default.createElement("h2", {
    className: "admin-header-title"
  }, pageName)), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-header-right"
  }, /*#__PURE__*/_react.default.createElement(_AdminSearchBar.default, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-container",
    ref: notificationRef
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-notification-bell",
    onClick: toggleNotifications,
    "aria-label": "Notifications"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaBell, null), unreadCount > 0 && /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-notification-badge"
  }, unreadCount > 9 ? '9+' : unreadCount)), notificationOpen && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-dropdown"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-header"
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Notifications"), !loading && unreadCount > 0 && /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-notification-read-all",
    onClick: markAllAsRead
  }, "Mark all as read")), loading && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-loading"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-loading-spinner"
  }), /*#__PURE__*/_react.default.createElement("p", null, "Loading notifications...")), error && !loading && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-error"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaExclamationTriangle, null), /*#__PURE__*/_react.default.createElement("p", null, error), /*#__PURE__*/_react.default.createElement("button", {
    onClick: fetchNotifications,
    className: "admin-notification-retry"
  }, "Retry")), !loading && !error && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-content"
  }, notifications.bookings.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-section"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-section-header"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaCalendarCheck, null), /*#__PURE__*/_react.default.createElement("h4", null, "New Bookings")), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-list"
  }, notifications.bookings.map(notification => /*#__PURE__*/_react.default.createElement("div", {
    key: `booking-${notification.id}`,
    className: `admin-notification-item ${notification.isNew ? 'new' : ''}`,
    onClick: () => markAsRead('bookings', notification.id)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-icon booking"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaCalendarCheck, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-details"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-title"
  }, notification.title), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-message"
  }, notification.message), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-time"
  }, notification.time)), notification.isNew && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-dot"
  }))))), notifications.alerts.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-section"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-section-header"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaExclamationTriangle, null), /*#__PURE__*/_react.default.createElement("h4", null, "Admin Alerts")), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-list"
  }, notifications.alerts.map(notification => /*#__PURE__*/_react.default.createElement("div", {
    key: `alert-${notification.id}`,
    className: `admin-notification-item ${notification.isNew ? 'new' : ''}`,
    onClick: () => markAsRead('alerts', notification.id)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-icon alert"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaExclamationTriangle, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-details"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-title"
  }, notification.title), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-message"
  }, notification.message), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-time"
  }, notification.time)), notification.isNew && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-dot"
  }))))), notifications.messages.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-section"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-section-header"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaEnvelope, null), /*#__PURE__*/_react.default.createElement("h4", null, "User Messages")), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-list"
  }, notifications.messages.map(notification => /*#__PURE__*/_react.default.createElement("div", {
    key: `message-${notification.id}`,
    className: `admin-notification-item ${notification.isNew ? 'new' : ''}`,
    onClick: () => markAsRead('messages', notification.id)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-icon message"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaEnvelope, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-details"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-title"
  }, notification.title), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-message"
  }, notification.message), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-time"
  }, notification.time)), notification.isNew && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-dot"
  }))))), !notifications.bookings.length && !notifications.alerts.length && !notifications.messages.length && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-no-results"
  }, /*#__PURE__*/_react.default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "48",
    height: "48",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M13.73 21a2 2 0 0 1-3.46 0"
  }), /*#__PURE__*/_react.default.createElement("line", {
    x1: "1",
    y1: "1",
    x2: "23",
    y2: "23"
  })), /*#__PURE__*/_react.default.createElement("p", null, "No notifications to display"), /*#__PURE__*/_react.default.createElement("span", null, "You're all caught up!"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-notification-footer"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-notification-view-all",
    onClick: () => {
      // This could navigate to a dedicated notifications page
      setNotificationOpen(false);
    }
  }, "View All Notifications")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-user-controls"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: "https://ui-avatars.com/api/?name=Admin",
    alt: "Admin Avatar",
    className: "admin-avatar"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-username"
  }, "Admin"), /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-logout-button",
    onClick: handleLogout
  }, "Logout")))));
}
var _default = exports.default = AdminHeader;
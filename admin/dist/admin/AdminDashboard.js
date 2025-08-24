"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _AdminUserContext = require("./AdminUserContext");
var _AdminAuthContext = require("./AdminAuthContext");
var _ToastContext = require("../context/ToastContext");
var _api = require("../api");
var _reactRouterDom = require("react-router-dom");
var _auto = _interopRequireDefault(require("chart.js/auto"));
var _AdminHeader = _interopRequireDefault(require("./AdminHeader"));
var _AdminSettingsPanel = _interopRequireDefault(require("./AdminSettingsPanel"));
var _AdminDashboardOverview = _interopRequireDefault(require("./AdminDashboardOverview"));
var _RoomManagement = _interopRequireDefault(require("./RoomManagement"));
var _UserManagement = _interopRequireDefault(require("./UserManagement"));
var _BookingHistory = _interopRequireDefault(require("./BookingHistory"));
var _ReviewModeration = _interopRequireDefault(require("./ReviewModeration"));
var _AdminProfile = _interopRequireDefault(require("./AdminProfile"));
var _AnalyticsDashboard = _interopRequireDefault(require("./AnalyticsDashboard"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const SIDEBAR_TABS = [{
  key: 'users',
  label: 'Users',
  icon: '👤'
}, {
  key: 'rooms',
  label: 'Rooms',
  icon: '🏠'
}, {
  key: 'bookings',
  label: 'Bookings',
  icon: '📖'
}, {
  key: 'reviews',
  label: 'Reviews',
  icon: '⭐'
}, {
  key: 'profile',
  label: 'Profile',
  icon: '🧑‍💼'
}, {
  key: 'analytics',
  label: 'Analytics',
  icon: '📊'
}, {
  key: 'settings',
  label: 'Settings',
  icon: '⚙️'
}];
function AdminDashboard() {
  const {
    admin,
    loading: oldLoading,
    logout: oldLogout
  } = (0, _AdminUserContext.useAdminUser)();
  const {
    adminUser,
    loading,
    logout,
    isAuthenticated
  } = (0, _AdminAuthContext.useAdminAuth)();
  const {
    showToast
  } = (0, _ToastContext.useToast)();
  const [tab, setTab] = (0, _react.useState)('users');
  const navigate = (0, _reactRouterDom.useNavigate)();

  // Users state
  const [users, setUsers] = (0, _react.useState)([]);
  const [usersLoading, setUsersLoading] = (0, _react.useState)(false);
  const [usersError, setUsersError] = (0, _react.useState)('');

  // Rooms state
  const [rooms, setRooms] = (0, _react.useState)([]);
  const [roomsLoading, setRoomsLoading] = (0, _react.useState)(false);
  const [roomsError, setRoomsError] = (0, _react.useState)('');

  // Bookings state
  const [bookingsLoading, setBookingsLoading] = (0, _react.useState)(false);
  const [bookingsError, setBookingsError] = (0, _react.useState)('');

  // Room editing state
  const [editingRoom, setEditingRoom] = (0, _react.useState)(null);
  const [editModalOpen, setEditModalOpen] = (0, _react.useState)(false);
  const [editLoading, setEditLoading] = (0, _react.useState)(false);

  // Analytics state
  const [analytics, setAnalytics] = (0, _react.useState)({
    users: null,
    rooms: null,
    pending: null
  });

  // Search result navigation handler
  const [searchFilter, setSearchFilter] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    const handleSearchNavigation = event => {
      const {
        tab: newTab,
        filter
      } = event.detail;
      setTab(newTab);
      setSearchFilter(filter);
    };
    window.addEventListener('adminNavigate', handleSearchNavigation);
    return () => {
      window.removeEventListener('adminNavigate', handleSearchNavigation);
    };
  }, []);
  const [analyticsLoading, setAnalyticsLoading] = (0, _react.useState)(false);
  const [analyticsError, setAnalyticsError] = (0, _react.useState)('');

  // Recent users/rooms state
  const [recentUsers, setRecentUsers] = (0, _react.useState)([]);
  const [recentRooms, setRecentRooms] = (0, _react.useState)([]);
  const [recentLoading, setRecentLoading] = (0, _react.useState)(false);
  const [recentError, setRecentError] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    if (tab === 'users') {
      setUsersLoading(true);
      setUsersError('');
      (0, _api.fetchAllUsersAdmin)().then(setUsers).catch(err => setUsersError(err.message || 'Failed to fetch users')).finally(() => setUsersLoading(false));
    } else if (tab === 'rooms') {
      setRoomsLoading(true);
      setRoomsError('');
      (0, _api.fetchAllRoomsAdminEnhanced)().then(setRooms).catch(err => setRoomsError(err.message || 'Failed to fetch rooms')).finally(() => setRoomsLoading(false));
    } else if (tab === 'bookings') {
      setBookingsLoading(true);
      setBookingsError('');
      // The BookingHistory component loads its own data
      // We just need to set loading to false after a short delay
      setTimeout(() => {
        setBookingsLoading(false);
      }, 100);
    } else if (tab === 'analytics') {
      setAnalyticsLoading(true);
      setAnalyticsError('');
      setRecentLoading(true);
      setRecentError('');
      Promise.all([(0, _api.getUserCountAdmin)(), (0, _api.getRoomCountAdmin)(), (0, _api.getRecentUsersAdmin)(), (0, _api.getRecentRoomsAdmin)()]).then(([userRes, roomRes, users, rooms]) => {
        setAnalytics({
          users: userRes,
          rooms: roomRes
        });
        setRecentUsers(users);
        setRecentRooms(rooms);
      }).catch(err => {
        setAnalyticsError(err.message || 'Failed to fetch analytics');
        setRecentError(err.message || 'Failed to fetch recent data');
      }).finally(() => {
        setAnalyticsLoading(false);
        setRecentLoading(false);
      });
    }
  }, [tab]);
  const handleApproveRoom = async id => {
    try {
      await (0, _api.approveRoomAdmin)(id);
      setRooms(rooms => rooms.map(r => r._id === id ? {
        ...r,
        status: 'approved'
      } : r));
      showToast('Room approved.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to approve room', 'error');
    }
  };
  const handleRejectRoom = async id => {
    try {
      await (0, _api.rejectRoomAdmin)(id);
      setRooms(rooms => rooms.map(r => r._id === id ? {
        ...r,
        status: 'rejected'
      } : r));
      showToast('Room rejected.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to reject room', 'error');
    }
  };
  const handleDeleteRoom = async id => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await (0, _api.deleteRoomAdmin)(id);
      setRooms(rooms => rooms.filter(r => r._id !== id));
      showToast('Room deleted.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete room', 'error');
    }
  };
  const handleEditRoom = room => {
    setEditingRoom(room);
    setEditModalOpen(true);
  };
  const handleSaveEditRoom = async updated => {
    setEditLoading(true);
    try {
      const updatedRoom = await (0, _api.updateRoomAdmin)(editingRoom._id, updated);
      setRooms(rooms => rooms.map(r => r._id === editingRoom._id ? updatedRoom : r));
      setEditModalOpen(false);
      showToast('Room updated.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update room', 'error');
    } finally {
      setEditLoading(false);
    }
  };
  if (loading) return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: 40,
      textAlign: 'center'
    }
  }, "Loading...");
  if (!admin) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: 40,
        textAlign: 'center',
        color: 'var(--danger)',
        fontWeight: 600
      }
    }, "Access denied. Admins only.");
  }
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
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_AdminHeader.default, null), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      minHeight: '80vh',
      display: 'flex',
      background: 'linear-gradient(90deg, #1e293b 0%, #2563eb 100%)',
      borderRadius: 22,
      boxShadow: '0 8px 32px 0 rgba(37,99,235,0.13)',
      margin: '40px auto',
      maxWidth: 1300,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/_react.default.createElement("aside", {
    style: {
      width: 260,
      background: 'rgba(30,41,59,0.72)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '22px 0 0 22px',
      padding: '36px 0 28px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '2px 0 24px 0 rgba(30,41,59,0.10)',
      position: 'relative',
      overflow: 'visible'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 24,
      bottom: 24,
      width: 7,
      borderRadius: '8px',
      background: 'linear-gradient(180deg, #2563eb 0%, #38bdf8 100%)',
      opacity: 0.85,
      zIndex: 1
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 36,
      zIndex: 2
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: admin.avatar || 'https://ui-avatars.com/api/?name=Admin',
    alt: "Admin Avatar",
    style: {
      width: 74,
      height: 74,
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #2563eb',
      marginBottom: 14,
      boxShadow: '0 2px 12px rgba(37,99,235,0.10)'
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 20,
      marginBottom: 2,
      textShadow: '0 1px 4px rgba(30,41,59,0.10)'
    }
  }, admin.email), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
      color: '#fff',
      fontWeight: 600,
      fontSize: 13,
      borderRadius: 8,
      padding: '2px 12px',
      letterSpacing: 1,
      boxShadow: '0 1px 4px rgba(37,99,235,0.10)'
    }
  }, "ADMIN")), /*#__PURE__*/_react.default.createElement("nav", {
    style: {
      width: '100%',
      zIndex: 2
    }
  }, SIDEBAR_TABS.map(({
    key,
    label,
    icon
  }) => /*#__PURE__*/_react.default.createElement("button", {
    key: key,
    onClick: () => setTab(key),
    style: {
      width: '100%',
      background: tab === key ? 'rgba(37,99,235,0.22)' : 'none',
      color: tab === key ? '#38bdf8' : '#fff',
      border: 'none',
      outline: 'none',
      fontWeight: tab === key ? 800 : 500,
      fontSize: 18,
      padding: '16px 0 16px 38px',
      textAlign: 'left',
      cursor: 'pointer',
      borderLeft: tab === key ? '6px solid #38bdf8' : '6px solid transparent',
      transition: 'all 0.22s cubic-bezier(.4,1.3,.6,1)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      letterSpacing: 0.5,
      position: 'relative',
      boxShadow: tab === key ? '0 2px 12px rgba(56,189,248,0.10)' : 'none'
    },
    onMouseOver: e => e.currentTarget.style.background = 'rgba(37,99,235,0.13)',
    onMouseOut: e => e.currentTarget.style.background = tab === key ? 'rgba(37,99,235,0.22)' : 'none'
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: 22,
      transition: 'transform 0.18s',
      transform: tab === key ? 'scale(1.18)' : 'scale(1)'
    }
  }, icon), " ", label))), /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleLogout,
    style: {
      marginTop: 'auto',
      width: '82%',
      background: 'linear-gradient(90deg, #ef4444 0%, #f59e42 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '13px 0',
      fontWeight: 800,
      fontSize: 17,
      cursor: 'pointer',
      boxShadow: '0 2px 12px rgba(239,68,68,0.10)',
      letterSpacing: 1,
      marginBottom: 14,
      marginTop: 32,
      transition: 'background 0.18s'
    }
  }, "Logout")), /*#__PURE__*/_react.default.createElement("main", {
    style: {
      flex: 1,
      background: 'rgba(255,255,255,0.98)',
      borderRadius: '0 22px 22px 0',
      padding: '40px 48px',
      minHeight: 600,
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      marginBottom: 24,
      color: '#2563eb',
      letterSpacing: -1
    }
  }, "Admin Dashboard"), tab === 'users' && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_UserManagement.default, {
    searchFilter: tab === 'users' ? searchFilter : null
  })), tab === 'rooms' && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_RoomManagement.default, {
    searchFilter: tab === 'rooms' ? searchFilter : null
  })), tab === 'bookings' && (bookingsLoading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-loading"
  }, "Loading bookings...") : /*#__PURE__*/_react.default.createElement(_BookingHistory.default, {
    searchFilter: tab === 'bookings' ? searchFilter : null
  })), tab === 'reviews' && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_ReviewModeration.default, null)), tab === 'profile' && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_AdminProfile.default, null)), tab === 'analytics' && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_AnalyticsDashboard.default, null)), tab === 'settings' && /*#__PURE__*/_react.default.createElement(_AdminSettingsPanel.default, null), /*#__PURE__*/_react.default.createElement(EditRoomModal, {
    room: editingRoom,
    open: editModalOpen,
    onClose: () => setEditModalOpen(false),
    onSave: handleSaveEditRoom,
    loading: editLoading
  }))));
}

// Modal component for editing room
function EditRoomModal({
  room,
  open,
  onClose,
  onSave,
  loading
}) {
  const [form, setForm] = (0, _react.useState)({
    ...room
  });
  const [error, setError] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    setForm({
      ...room
    });
    setError(null);
  }, [room, open]);
  if (!open) return null;
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setForm(f => ({
      ...f,
      [name]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.location || !form.price) {
      setError('Title, location, and price are required.');
      return;
    }
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        amenities: typeof form.amenities === 'string' ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : form.amenities
      });
    } catch (e) {
      setError(e.message);
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.25)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleSubmit,
    style: {
      background: '#fff',
      padding: 32,
      borderRadius: 12,
      minWidth: 350,
      maxWidth: 420,
      boxShadow: '0 4px 32px rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      marginBottom: 18
    }
  }, "Edit Room"), /*#__PURE__*/_react.default.createElement("input", {
    name: "title",
    value: form.title || '',
    onChange: handleChange,
    placeholder: "Title",
    required: true,
    style: {
      display: 'block',
      marginBottom: 10,
      width: '100%',
      padding: 8
    }
  }), /*#__PURE__*/_react.default.createElement("textarea", {
    name: "description",
    value: form.description || '',
    onChange: handleChange,
    placeholder: "Description",
    style: {
      display: 'block',
      marginBottom: 10,
      width: '100%',
      padding: 8
    }
  }), /*#__PURE__*/_react.default.createElement("input", {
    name: "location",
    value: form.location || '',
    onChange: handleChange,
    placeholder: "Location",
    required: true,
    style: {
      display: 'block',
      marginBottom: 10,
      width: '100%',
      padding: 8
    }
  }), /*#__PURE__*/_react.default.createElement("input", {
    name: "price",
    value: form.price || '',
    onChange: handleChange,
    placeholder: "Price",
    type: "number",
    required: true,
    style: {
      display: 'block',
      marginBottom: 10,
      width: '100%',
      padding: 8
    }
  }), /*#__PURE__*/_react.default.createElement("input", {
    name: "amenities",
    value: Array.isArray(form.amenities) ? form.amenities.join(', ') : form.amenities || '',
    onChange: handleChange,
    placeholder: "Amenities (comma separated)",
    style: {
      display: 'block',
      marginBottom: 10,
      width: '100%',
      padding: 8
    }
  }), /*#__PURE__*/_react.default.createElement("input", {
    name: "imageUrl",
    value: form.imageUrl || '',
    onChange: handleChange,
    placeholder: "Image URL",
    style: {
      display: 'block',
      marginBottom: 10,
      width: '100%',
      padding: 8
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 10
    }
  }, /*#__PURE__*/_react.default.createElement("button", {
    type: "submit",
    disabled: loading,
    style: {
      padding: 10,
      fontSize: 16,
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      fontWeight: 600
    }
  }, "Save"), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    onClick: onClose,
    style: {
      padding: 10,
      fontSize: 16,
      background: '#eee',
      color: '#333',
      border: 'none',
      borderRadius: 6,
      fontWeight: 600
    }
  }, "Cancel")), error && /*#__PURE__*/_react.default.createElement("p", {
    style: {
      color: 'red',
      marginTop: 10
    }
  }, error)));
}

// Pie chart component for room status
function RoomStatusPieChart({
  pending = 0,
  approved = 0,
  rejected = 0
}) {
  const canvasRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (!canvasRef.current) return;
    const chart = new _auto.default(canvasRef.current, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
          data: [pending, approved, rejected],
          backgroundColor: ['#f59e42', '#3b82f6', '#ef4444']
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 16
              }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
    return () => chart.destroy();
  }, [pending, approved, rejected]);
  return /*#__PURE__*/_react.default.createElement("canvas", {
    ref: canvasRef,
    width: 340,
    height: 220
  });
}
var _default = exports.default = AdminDashboard;
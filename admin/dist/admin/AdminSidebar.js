"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _fa = require("react-icons/fa");
require("./AdminSidebar.css");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AdminSidebar = ({
  admin,
  onLogout
}) => {
  const [collapsed, setCollapsed] = (0, _react.useState)(false);
  const [mobileOpen, setMobileOpen] = (0, _react.useState)(false);
  const location = (0, _reactRouterDom.useLocation)();

  // Close mobile sidebar when route changes
  (0, _react.useEffect)(() => {
    setMobileOpen(false);
  }, [location]);

  // Close mobile sidebar on wider screens
  (0, _react.useEffect)(() => {
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
  const routes = [{
    path: '/admin',
    name: 'Dashboard',
    icon: /*#__PURE__*/_react.default.createElement(_fa.FaTachometerAlt, null)
  }, {
    path: '/admin/rooms',
    name: 'Rooms',
    icon: /*#__PURE__*/_react.default.createElement(_fa.FaBed, null)
  }, {
    path: '/admin/users',
    name: 'Users',
    icon: /*#__PURE__*/_react.default.createElement(_fa.FaUsers, null)
  }, {
    path: '/admin/bookings',
    name: 'Bookings',
    icon: /*#__PURE__*/_react.default.createElement(_fa.FaCalendarAlt, null)
  }, {
    path: '/admin/reviews',
    name: 'Reviews',
    icon: /*#__PURE__*/_react.default.createElement(_fa.FaStar, null)
  }, {
    path: '/admin/analytics',
    name: 'Analytics',
    icon: /*#__PURE__*/_react.default.createElement(_fa.FaChartLine, null)
  }, {
    path: '/admin/settings',
    name: 'Settings',
    icon: /*#__PURE__*/_react.default.createElement(_fa.FaCog, null)
  }];
  const renderNavLinks = () => {
    return routes.map(route => /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
      to: route.path,
      key: route.path,
      className: ({
        isActive
      }) => `admin-sidebar-link ${isActive ? 'active' : ''}`,
      end: route.path === '/admin'
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-sidebar-icon"
    }, route.icon), /*#__PURE__*/_react.default.createElement("span", {
      className: `admin-sidebar-text ${collapsed ? 'collapsed' : ''}`
    }, route.name), collapsed && /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-sidebar-tooltip"
    }, route.name)));
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: `admin-sidebar-overlay ${mobileOpen ? 'active' : ''}`,
    onClick: () => setMobileOpen(false)
  }), /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-sidebar-mobile-toggle",
    onClick: toggleMobileSidebar,
    "aria-label": "Toggle menu"
  }, mobileOpen ? /*#__PURE__*/_react.default.createElement(_fa.FaTimes, null) : /*#__PURE__*/_react.default.createElement(_fa.FaBars, null)), /*#__PURE__*/_react.default.createElement("aside", {
    className: `admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-sidebar-toggle",
    onClick: toggleSidebar,
    "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar"
  }, collapsed ? /*#__PURE__*/_react.default.createElement(_fa.FaChevronRight, null) : /*#__PURE__*/_react.default.createElement(_fa.FaChevronLeft, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-sidebar-header"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: admin?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff',
    alt: "Admin Avatar",
    className: "admin-sidebar-avatar"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: `admin-sidebar-info ${collapsed ? 'collapsed' : ''}`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-sidebar-name"
  }, admin?.firstName || admin?.email?.split('@')[0] || 'Admin'), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-sidebar-role"
  }, "Administrator"))), /*#__PURE__*/_react.default.createElement("nav", {
    className: "admin-sidebar-nav"
  }, renderNavLinks()), /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-sidebar-logout",
    onClick: onLogout
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-sidebar-icon"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaSignOutAlt, null)), /*#__PURE__*/_react.default.createElement("span", {
    className: `admin-sidebar-text ${collapsed ? 'collapsed' : ''}`
  }, "Logout"))));
};
var _default = exports.default = AdminSidebar;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _AdminUserContext = require("./AdminUserContext");
var _ToastContext = require("../context/ToastContext");
var _AdminHeader = _interopRequireDefault(require("./AdminHeader"));
var _AdminSidebar = _interopRequireDefault(require("./AdminSidebar"));
require("./AdminLayout.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AdminLayout = () => {
  const {
    admin,
    loading,
    logout
  } = (0, _AdminUserContext.useAdminUser)();
  const {
    showToast
  } = (0, _ToastContext.useToast)();
  const navigate = (0, _reactRouterDom.useNavigate)();
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
  if (loading) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-loading-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-loading-spinner"
    }), /*#__PURE__*/_react.default.createElement("p", null, "Loading admin panel..."));
  }
  if (!admin) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-access-denied"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-access-denied-icon"
    }, "\u26A0\uFE0F"), /*#__PURE__*/_react.default.createElement("h2", null, "Access Denied"), /*#__PURE__*/_react.default.createElement("p", null, "You must be an admin to access this area."), /*#__PURE__*/_react.default.createElement("button", {
      onClick: () => navigate('/'),
      className: "admin-back-button"
    }, "Back to Home"));
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-layout"
  }, /*#__PURE__*/_react.default.createElement(_AdminSidebar.default, {
    admin: admin,
    onLogout: handleLogout
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-content"
  }, /*#__PURE__*/_react.default.createElement(_AdminHeader.default, null), /*#__PURE__*/_react.default.createElement("main", {
    className: "admin-main"
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Outlet, null))));
};
var _default = exports.default = AdminLayout;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _axios = _interopRequireDefault(require("axios"));
var _AdminAuthContext = require("./AdminAuthContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AdminAuthDebug = () => {
  const {
    adminUser,
    loading,
    error,
    isAuthenticated
  } = (0, _AdminAuthContext.useAdminAuth)();
  const [sessionInfo, setSessionInfo] = (0, _react.useState)(null);
  const [sessionLoading, setSessionLoading] = (0, _react.useState)(false);
  const [sessionError, setSessionError] = (0, _react.useState)(null);
  const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';
  const checkSession = async () => {
    setSessionLoading(true);
    try {
      const response = await _axios.default.get(`${API_BASE}/admin/debug-session`, {
        withCredentials: true
      });
      setSessionInfo(response.data);
      setSessionError(null);
    } catch (err) {
      console.error('Error checking session:', err);
      setSessionError(err.message || 'Failed to check session');
      setSessionInfo(null);
    } finally {
      setSessionLoading(false);
    }
  };
  (0, _react.useEffect)(() => {
    checkSession();
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-debug"
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Admin Auth Debugging"), /*#__PURE__*/_react.default.createElement("div", {
    className: "debug-section"
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Authentication Context"), loading ? /*#__PURE__*/_react.default.createElement("p", null, "Loading auth context...") : /*#__PURE__*/_react.default.createElement("div", {
    className: "debug-info"
  }, /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("strong", null, "Is Authenticated:"), " ", isAuthenticated ? 'Yes' : 'No'), /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("strong", null, "Error:"), " ", error || 'None'), /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("strong", null, "Admin User:")), /*#__PURE__*/_react.default.createElement("pre", null, adminUser ? JSON.stringify(adminUser, null, 2) : 'Not logged in'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "debug-section"
  }, /*#__PURE__*/_react.default.createElement("h3", null, "Session Information"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: checkSession,
    disabled: sessionLoading,
    className: "debug-button"
  }, sessionLoading ? 'Checking...' : 'Check Session'), sessionLoading ? /*#__PURE__*/_react.default.createElement("p", null, "Loading session info...") : sessionError ? /*#__PURE__*/_react.default.createElement("p", {
    className: "error-text"
  }, "Error: ", sessionError) : /*#__PURE__*/_react.default.createElement("div", {
    className: "debug-info"
  }, /*#__PURE__*/_react.default.createElement("pre", null, sessionInfo ? JSON.stringify(sessionInfo, null, 2) : 'No session data'))), /*#__PURE__*/_react.default.createElement("style", {
    jsx: true
  }, `
        .admin-debug {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .debug-section {
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .debug-info {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          overflow: auto;
        }
        
        pre {
          margin: 0;
          white-space: pre-wrap;
        }
        
        .debug-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        
        .debug-button:disabled {
          background: #cccccc;
        }
        
        .error-text {
          color: #dc3545;
        }
      `));
};
var _default = exports.default = AdminAuthDebug;
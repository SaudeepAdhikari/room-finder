"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _axios = _interopRequireDefault(require("axios"));
require("./AdminLogin.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AdminLogin = ({
  onLoginSuccess
}) => {
  const [email, setEmail] = (0, _react.useState)('');
  const [password, setPassword] = (0, _react.useState)('');
  const [error, setError] = (0, _react.useState)('');
  const [loading, setLoading] = (0, _react.useState)(false);
  const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Attempt login
      const response = await _axios.default.post(`${API_BASE}/admin/login`, {
        email,
        password
      }, {
        withCredentials: true
      });
      if (response.data) {
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-login-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-login-card"
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Admin Login"), error && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-login-error"
  }, error), /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleLogin
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-login-field"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Email"), /*#__PURE__*/_react.default.createElement("input", {
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-login-field"
  }, /*#__PURE__*/_react.default.createElement("label", null, "Password"), /*#__PURE__*/_react.default.createElement("input", {
    type: "password",
    value: password,
    onChange: e => setPassword(e.target.value),
    required: true
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "submit",
    className: "admin-login-button",
    disabled: loading
  }, loading ? 'Logging in...' : 'Login'))));
};
var _default = exports.default = AdminLogin;
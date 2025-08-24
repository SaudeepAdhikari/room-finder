"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAdminAuth = exports.default = exports.AdminAuthProvider = void 0;
var _react = _interopRequireWildcard(require("react"));
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Create the context
const AdminAuthContext = /*#__PURE__*/(0, _react.createContext)();

// Create a custom hook for using this context
const useAdminAuth = () => (0, _react.useContext)(AdminAuthContext);

// Create the provider component
exports.useAdminAuth = useAdminAuth;
const AdminAuthProvider = ({
  children
}) => {
  const [adminUser, setAdminUser] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(true);
  const [error, setError] = (0, _react.useState)(null);
  const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';

  // Check authentication status on load
  (0, _react.useEffect)(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await _axios.default.get(`${API_BASE}/admin/me`, {
          withCredentials: true
        });
        setAdminUser(response.data);
        setError(null);
      } catch (err) {
        setAdminUser(null);
        setError('Not authenticated');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [API_BASE]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await _axios.default.post(`${API_BASE}/admin/login`, {
        email,
        password
      }, {
        withCredentials: true
      });
      setAdminUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await _axios.default.post(`${API_BASE}/admin/logout`, {}, {
        withCredentials: true
      });
      setAdminUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  const value = {
    adminUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!adminUser
  };
  return /*#__PURE__*/_react.default.createElement(AdminAuthContext.Provider, {
    value: value
  }, children);
};
exports.AdminAuthProvider = AdminAuthProvider;
var _default = exports.default = AdminAuthContext;
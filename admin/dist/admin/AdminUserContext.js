"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminUserProvider = AdminUserProvider;
exports.useAdminUser = useAdminUser;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AdminUserContext = /*#__PURE__*/(0, _react.createContext)();
function useAdminUser() {
  return (0, _react.useContext)(AdminUserContext);
}
function AdminUserProvider({
  children
}) {
  const [admin, setAdmin] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    // Load admin from localStorage (or session/cookie)
    const stored = localStorage.getItem('adminUser');
    if (stored) {
      setAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, []);
  const login = adminData => {
    setAdmin(adminData);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
  };
  const logout = async () => {
    try {
      // Call admin logout endpoint
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setAdmin(null);
      localStorage.removeItem('adminUser');
    }
  };
  return /*#__PURE__*/_react.default.createElement(AdminUserContext.Provider, {
    value: {
      admin,
      loading,
      login,
      logout
    }
  }, children);
}
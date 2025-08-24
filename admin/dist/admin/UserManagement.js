"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _fa = require("react-icons/fa");
require("./UserManagement.css");
require("./AdminCommon.css");
var _api = require("../api");
var _AdminAuthContext = require("./AdminAuthContext");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function UserManagement({
  searchFilter
}) {
  const {
    isAuthenticated,
    adminUser
  } = (0, _AdminAuthContext.useAdminAuth)();
  const [users, setUsers] = (0, _react.useState)([]);
  const [filtered, setFiltered] = (0, _react.useState)([]);
  const [search, setSearch] = (0, _react.useState)('');
  const [loading, setLoading] = (0, _react.useState)(true);
  const [error, setError] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    if (isAuthenticated) {
      loadUsers();
    } else {
      setError('You must be logged in as an admin to view users');
      setLoading(false);
    }
  }, [isAuthenticated]);
  (0, _react.useEffect)(() => {
    let data = [...users];

    // Apply text search filter
    if (search) {
      data = data.filter(u => u.email && u.email.toLowerCase().includes(search.toLowerCase()) || u.firstName && u.firstName.toLowerCase().includes(search.toLowerCase()) || u.lastName && u.lastName.toLowerCase().includes(search.toLowerCase()));
    }

    // Apply search filter from universal search if present
    if (searchFilter) {
      data = data.filter(u => u._id === searchFilter);
    }
    setFiltered(data);
  }, [users, search, searchFilter]);
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await (0, _api.fetchAllUsersAdmin)();
      setUsers(data);
    } catch (e) {
      console.error('Error loading users:', e);
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = () => {
    loadUsers();
  };
  const handleBanToggle = async user => {
    await (0, _api.banUserAdmin)(user._id, !user.banned);
    setUsers(users => users.map(u => u._id === user._id ? {
      ...u,
      banned: !u.banned
    } : u));
  };
  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    await (0, _api.deleteUserAdmin)(id);
    setUsers(users => users.filter(u => u._id !== id));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "user-mgmt-root"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "user-mgmt-header"
  }, /*#__PURE__*/_react.default.createElement("h2", null, "User Management")), /*#__PURE__*/_react.default.createElement("div", {
    className: "user-mgmt-controls"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "user-mgmt-search",
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "Search by name or email..."
  })), loading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "user-mgmt-loading"
  }, /*#__PURE__*/_react.default.createElement("div", null, "Loading users..."), /*#__PURE__*/_react.default.createElement("div", {
    className: "spinner"
  })) : error ? /*#__PURE__*/_react.default.createElement("div", {
    className: "user-mgmt-error"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "error-message"
  }, "Error: ", error), /*#__PURE__*/_react.default.createElement("button", {
    className: "retry-button",
    onClick: handleRetry
  }, "Retry")) : /*#__PURE__*/_react.default.createElement("div", {
    className: "user-mgmt-table-wrap"
  }, /*#__PURE__*/_react.default.createElement("table", {
    className: "user-mgmt-table"
  }, /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", null, "Email"), /*#__PURE__*/_react.default.createElement("th", null, "Role"), /*#__PURE__*/_react.default.createElement("th", null, "Registered"), /*#__PURE__*/_react.default.createElement("th", null, "Status"), /*#__PURE__*/_react.default.createElement("th", null, "Actions"))), /*#__PURE__*/_react.default.createElement("tbody", null, filtered.map(user => /*#__PURE__*/_react.default.createElement("tr", {
    key: user._id
  }, /*#__PURE__*/_react.default.createElement("td", null, user.email), /*#__PURE__*/_react.default.createElement("td", null, user.isAdmin ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_fa.FaUserShield, {
    color: "#2563eb"
  }), " Admin") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_fa.FaUser, {
    color: "#64748b"
  }), " User")), /*#__PURE__*/_react.default.createElement("td", null, user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''), /*#__PURE__*/_react.default.createElement("td", null, user.banned ? /*#__PURE__*/_react.default.createElement("span", {
    className: "user-mgmt-banned"
  }, "Banned") : /*#__PURE__*/_react.default.createElement("span", {
    className: "user-mgmt-active"
  }, "Active")), /*#__PURE__*/_react.default.createElement("td", null, /*#__PURE__*/_react.default.createElement("button", {
    className: "user-mgmt-ban",
    onClick: () => handleBanToggle(user)
  }, user.banned ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_fa.FaUndo, null), " Unban") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_fa.FaBan, null), " Ban")), /*#__PURE__*/_react.default.createElement("button", {
    className: "user-mgmt-delete",
    onClick: () => handleDelete(user._id)
  }, /*#__PURE__*/_react.default.createElement(_fa.FaTrash, null), " Delete"))))))), error && /*#__PURE__*/_react.default.createElement("div", {
    className: "user-mgmt-error"
  }, error));
}
var _default = exports.default = UserManagement;
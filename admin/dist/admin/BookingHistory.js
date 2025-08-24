"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _fa = require("react-icons/fa");
require("./BookingHistory.css");
require("./AdminCommon.css");
var _api = require("../api");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function BookingHistory({
  searchFilter
}) {
  const [bookings, setBookings] = (0, _react.useState)([]);
  const [filtered, setFiltered] = (0, _react.useState)([]);
  const [search, setSearch] = (0, _react.useState)('');
  const [status, setStatus] = (0, _react.useState)('');
  const [user, setUser] = (0, _react.useState)('');
  const [date, setDate] = (0, _react.useState)('');
  const [loading, setLoading] = (0, _react.useState)(true);
  const [error, setError] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    loadBookings();
  }, []);
  (0, _react.useEffect)(() => {
    let data = [...bookings];

    // Apply text search filter
    if (search) {
      data = data.filter(b => b._id && b._id.toLowerCase().includes(search.toLowerCase()) || b.room && b.room.title && b.room.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Apply other filters
    if (status) data = data.filter(b => b.status === status);
    if (user) data = data.filter(b => b.tenant && b.tenant.email && b.tenant.email.toLowerCase().includes(user.toLowerCase()));
    if (date) data = data.filter(b => b.createdAt && b.createdAt.slice(0, 10) === date);

    // Apply search filter from universal search if present
    if (searchFilter) {
      data = data.filter(b => b._id === searchFilter);
    }
    setFiltered(data);
  }, [bookings, search, status, user, date, searchFilter]);
  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await (0, _api.fetchAllBookingsAdmin)();
      setBookings(data);
    } catch (e) {
      console.error('Error loading bookings:', e);
      setError(e.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = () => {
    loadBookings();
  };
  const handleStatus = async (id, newStatus) => {
    await (0, _api.updateBookingStatusAdmin)(id, newStatus);
    setBookings(bookings => bookings.map(b => b._id === id ? {
      ...b,
      status: newStatus
    } : b));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "booking-history-root"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "booking-history-header"
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Booking History")), /*#__PURE__*/_react.default.createElement("div", {
    className: "booking-history-controls"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "booking-history-search",
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "Search by ID or room..."
  }), /*#__PURE__*/_react.default.createElement("input", {
    className: "booking-history-user",
    value: user,
    onChange: e => setUser(e.target.value),
    placeholder: "Filter by user email..."
  }), /*#__PURE__*/_react.default.createElement("input", {
    className: "booking-history-date",
    type: "date",
    value: date,
    onChange: e => setDate(e.target.value)
  }), /*#__PURE__*/_react.default.createElement("select", {
    value: status,
    onChange: e => setStatus(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: ""
  }, "All Statuses"), /*#__PURE__*/_react.default.createElement("option", {
    value: "pending"
  }, "Pending"), /*#__PURE__*/_react.default.createElement("option", {
    value: "confirmed"
  }, "Confirmed"), /*#__PURE__*/_react.default.createElement("option", {
    value: "completed"
  }, "Completed"), /*#__PURE__*/_react.default.createElement("option", {
    value: "cancelled"
  }, "Cancelled"))), loading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "booking-history-loading"
  }, /*#__PURE__*/_react.default.createElement("div", null, "Loading bookings..."), /*#__PURE__*/_react.default.createElement("div", {
    className: "spinner"
  })) : /*#__PURE__*/_react.default.createElement("div", {
    className: "booking-history-table-wrap"
  }, /*#__PURE__*/_react.default.createElement("table", {
    className: "booking-history-table"
  }, /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", null, "Booking ID"), /*#__PURE__*/_react.default.createElement("th", null, "Room"), /*#__PURE__*/_react.default.createElement("th", null, "User"), /*#__PURE__*/_react.default.createElement("th", null, "Date"), /*#__PURE__*/_react.default.createElement("th", null, "Amount"), /*#__PURE__*/_react.default.createElement("th", null, "Status"), /*#__PURE__*/_react.default.createElement("th", null, "Actions"))), /*#__PURE__*/_react.default.createElement("tbody", null, filtered.map(b => /*#__PURE__*/_react.default.createElement("tr", {
    key: b._id
  }, /*#__PURE__*/_react.default.createElement("td", null, b._id), /*#__PURE__*/_react.default.createElement("td", null, b.room?.title || '-'), /*#__PURE__*/_react.default.createElement("td", null, b.tenant?.email || '-'), /*#__PURE__*/_react.default.createElement("td", null, b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'), /*#__PURE__*/_react.default.createElement("td", null, b.totalAmount), /*#__PURE__*/_react.default.createElement("td", null, b.status), /*#__PURE__*/_react.default.createElement("td", null, b.status !== 'cancelled' && b.status !== 'completed' && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    className: "booking-history-action booking-history-complete",
    onClick: () => handleStatus(b._id, 'completed')
  }, /*#__PURE__*/_react.default.createElement(_fa.FaCheck, null), " Complete"), /*#__PURE__*/_react.default.createElement("button", {
    className: "booking-history-action booking-history-cancel",
    onClick: () => handleStatus(b._id, 'cancelled')
  }, /*#__PURE__*/_react.default.createElement(_fa.FaTimes, null), " Cancel")))))))), error && /*#__PURE__*/_react.default.createElement("div", {
    className: "booking-history-error"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "error-message"
  }, "Error: ", error), /*#__PURE__*/_react.default.createElement("button", {
    className: "retry-button",
    onClick: handleRetry
  }, "Retry")));
}
var _default = exports.default = BookingHistory;
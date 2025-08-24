"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _fa = require("react-icons/fa");
var _Card = _interopRequireDefault(require("../components/ui/Card"));
require("./AdminDashboardOverview.css");
var _api = require("../api");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const DashboardOverview = () => {
  const [rooms, setRooms] = (0, _react.useState)('-');
  const [bookings, setBookings] = (0, _react.useState)('-');
  const [users, setUsers] = (0, _react.useState)('-');
  const [loading, setLoading] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    setLoading(true);
    Promise.all([(0, _api.getRoomCountAdmin)().then(res => res.total ?? '-').catch(() => '-'), (0, _api.getAdminBookingsCount)().then(res => res.count ?? '-').catch(() => '-'), (0, _api.getUserCountAdmin)().then(res => res.count ?? '-').catch(() => '-')]).then(([roomCount, bookingCount, userCount]) => {
      setRooms(roomCount);
      setBookings(bookingCount);
      setUsers(userCount);
    }).finally(() => setLoading(false));
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-overview-grid"
  }, /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: "dashboard-card",
    hoverable: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-icon",
    style: {
      background: '#2563eb'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaHome, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-label"
  }, "Total Rooms"), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-value"
  }, loading ? '...' : rooms)), /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: "dashboard-card",
    hoverable: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-icon",
    style: {
      background: '#22c55e'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaBook, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-label"
  }, "Total Bookings"), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-value"
  }, loading ? '...' : bookings)), /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: "dashboard-card",
    hoverable: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-icon",
    style: {
      background: '#f59e42'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaUserCheck, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-label"
  }, "Verified Users"), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-value"
  }, loading ? '...' : users)), /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: "dashboard-card",
    hoverable: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-icon",
    style: {
      background: '#ef4444'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaStar, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-label"
  }, "Reviews Count"), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashboard-value"
  }, "0")));
};
var _default = exports.default = DashboardOverview;
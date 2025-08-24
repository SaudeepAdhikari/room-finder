"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _fa = require("react-icons/fa");
require("./AdminDashboardPage.css");
require("./AdminPage.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AdminDashboardPage = () => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-page"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    className: "admin-page-title"
  }, "Dashboard"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-dashboard"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stats-grid"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-card"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-title"
  }, "Total Rooms"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-icon rooms"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaBed, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-value"
  }, "248"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-change positive"
  }, "+12% ", /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-stat-period"
  }, "from last month"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-card"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-title"
  }, "Total Users"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-icon users"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaUsers, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-value"
  }, "1,024"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-change positive"
  }, "+18% ", /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-stat-period"
  }, "from last month"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-card"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-title"
  }, "Bookings"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-icon bookings"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaCalendarAlt, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-value"
  }, "156"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-change positive"
  }, "+5% ", /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-stat-period"
  }, "from last month"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-card"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-title"
  }, "Revenue"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-icon revenue"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaChartBar, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-value"
  }, "$32,450"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-stat-change positive"
  }, "+8% ", /*#__PURE__*/_react.default.createElement("span", {
    className: "admin-stat-period"
  }, "from last month"))))));
};
var _default = exports.default = AdminDashboardPage;
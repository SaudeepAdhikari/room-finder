"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UserManagement = _interopRequireDefault(require("./UserManagement"));
require("./AdminPage.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AdminUsersPage = () => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-page"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    className: "admin-page-title"
  }, "User Management"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-page-content"
  }, /*#__PURE__*/_react.default.createElement(_UserManagement.default, null)));
};
var _default = exports.default = AdminUsersPage;
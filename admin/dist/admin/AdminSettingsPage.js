"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _AdminSettingsPanel = _interopRequireDefault(require("./AdminSettingsPanel"));
var _AdminAuthDebug = _interopRequireDefault(require("./AdminAuthDebug"));
require("./AdminPage.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AdminSettingsPage = () => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-page"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    className: "admin-page-title"
  }, "Admin Settings"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-page-content"
  }, /*#__PURE__*/_react.default.createElement(_AdminSettingsPanel.default, null), /*#__PURE__*/_react.default.createElement(_AdminAuthDebug.default, null)));
};
var _default = exports.default = AdminSettingsPage;
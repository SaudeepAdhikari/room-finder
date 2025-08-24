"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Toast;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Toast({
  message,
  type = 'info',
  onClose
}) {
  if (!message) return null;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `admin-toast admin-toast-${type}`,
    role: "status"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-toast-message"
  }, message), /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-toast-close",
    onClick: onClose
  }, "\xD7"));
}
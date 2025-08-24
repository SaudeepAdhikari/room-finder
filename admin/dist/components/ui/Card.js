"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Card;
var _react = _interopRequireDefault(require("react"));
require("./Card.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  className = '',
  hoverable = false,
  ...props
}) {
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: `admin-card ${className} ${hoverable ? 'hoverable' : ''}`
  }, props), children);
}
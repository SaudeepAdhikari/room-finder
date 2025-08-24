"use strict";

var _react = _interopRequireDefault(require("react"));
var _client = require("react-dom/client");
var _App = _interopRequireDefault(require("./App"));
require("./styles.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
(0, _client.createRoot)(document.getElementById('root')).render(/*#__PURE__*/_react.default.createElement(_react.default.StrictMode, null, /*#__PURE__*/_react.default.createElement(_App.default, null)));
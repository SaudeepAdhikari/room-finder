"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToastProvider = ToastProvider;
exports.useToast = useToast;
var _react = _interopRequireWildcard(require("react"));
var _Toast = _interopRequireDefault(require("../components/Toast"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ToastContext = /*#__PURE__*/(0, _react.createContext)();
function ToastProvider({
  children
}) {
  const [toast, setToast] = (0, _react.useState)({
    message: '',
    type: 'info'
  });
  const showToast = (0, _react.useCallback)((message, type = 'info') => {
    setToast({
      message,
      type
    });
  }, []);
  const handleClose = (0, _react.useCallback)(() => {
    setToast({
      message: '',
      type: 'info'
    });
  }, []);
  return /*#__PURE__*/_react.default.createElement(ToastContext.Provider, {
    value: {
      showToast
    }
  }, children, /*#__PURE__*/_react.default.createElement(_Toast.default, {
    message: toast.message,
    type: toast.type,
    onClose: handleClose
  }));
}
function useToast() {
  return (0, _react.useContext)(ToastContext);
}
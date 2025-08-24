"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  mountStandalone: true,
  AdminDashboard: true,
  AdminLayout: true,
  AdminDashboardPage: true,
  AdminRoomsPage: true,
  AdminUsersPage: true,
  AdminBookingsPage: true,
  AdminReviewsPage: true,
  AdminSettingsPage: true,
  AdminAnalyticsPage: true
};
Object.defineProperty(exports, "AdminAnalyticsPage", {
  enumerable: true,
  get: function () {
    return _AdminAnalyticsPage.default;
  }
});
Object.defineProperty(exports, "AdminBookingsPage", {
  enumerable: true,
  get: function () {
    return _AdminBookingsPage.default;
  }
});
Object.defineProperty(exports, "AdminDashboard", {
  enumerable: true,
  get: function () {
    return _AdminDashboard.default;
  }
});
Object.defineProperty(exports, "AdminDashboardPage", {
  enumerable: true,
  get: function () {
    return _AdminDashboardPage.default;
  }
});
Object.defineProperty(exports, "AdminLayout", {
  enumerable: true,
  get: function () {
    return _AdminLayout.default;
  }
});
Object.defineProperty(exports, "AdminReviewsPage", {
  enumerable: true,
  get: function () {
    return _AdminReviewsPage.default;
  }
});
Object.defineProperty(exports, "AdminRoomsPage", {
  enumerable: true,
  get: function () {
    return _AdminRoomsPage.default;
  }
});
Object.defineProperty(exports, "AdminSettingsPage", {
  enumerable: true,
  get: function () {
    return _AdminSettingsPage.default;
  }
});
Object.defineProperty(exports, "AdminUsersPage", {
  enumerable: true,
  get: function () {
    return _AdminUsersPage.default;
  }
});
exports.mountStandalone = mountStandalone;
var _AdminDashboard = _interopRequireDefault(require("./admin/AdminDashboard"));
var _AdminLayout = _interopRequireDefault(require("./admin/AdminLayout"));
var _AdminDashboardPage = _interopRequireDefault(require("./admin/AdminDashboardPage"));
var _AdminRoomsPage = _interopRequireDefault(require("./admin/AdminRoomsPage"));
var _AdminUsersPage = _interopRequireDefault(require("./admin/AdminUsersPage"));
var _AdminBookingsPage = _interopRequireDefault(require("./admin/AdminBookingsPage"));
var _AdminReviewsPage = _interopRequireDefault(require("./admin/AdminReviewsPage"));
var _AdminSettingsPage = _interopRequireDefault(require("./admin/AdminSettingsPage"));
var _AdminAnalyticsPage = _interopRequireDefault(require("./admin/AdminAnalyticsPage"));
var _AdminAuthContext = require("./admin/AdminAuthContext");
Object.keys(_AdminAuthContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _AdminAuthContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AdminAuthContext[key];
    }
  });
});
var _AdminUserContext = require("./admin/AdminUserContext");
Object.keys(_AdminUserContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _AdminUserContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AdminUserContext[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); } // Re-export admin modules for use by the client app
// --- Standalone CRA bootstrap -------------------------------------------------
// The CRA standalone app will import this file. When running the standalone app
// we want to mount the React app into #root. We provide mountStandalone() so the
// CRA entrypoint can call it. We also attempt a safe auto-mount when running in
// a browser with the `__ADMIN_STANDALONE__` flag set (set by CRA start).

async function mountStandalone(containerId = 'root') {
  // dynamic import to avoid pulling react-dom into the client bundle when used
  // as a library for the main client app.
  const React = await Promise.resolve().then(() => _interopRequireWildcard(require('react')));
  const ReactDOMClient = await Promise.resolve().then(() => _interopRequireWildcard(require('react-dom/client')));
  const App = (await Promise.resolve().then(() => _interopRequireWildcard(require('./App')))).default;
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container #${containerId} not found`);
  }
  const root = ReactDOMClient.createRoot(container);
  root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
}

// Auto-mount when the global flag is present (set REACT_APP_STANDALONE=true in CRA)
if (typeof window !== 'undefined' && window.__ADMIN_STANDALONE__ === true) {
  // best-effort mount; ignore errors to keep library usage unaffected
  mountStandalone().catch(() => {});
}
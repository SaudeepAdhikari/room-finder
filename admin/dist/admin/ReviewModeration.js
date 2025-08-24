"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _fa = require("react-icons/fa");
require("./ReviewModeration.css");
require("./AdminCommon.css");
var _api = require("../api");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ReviewModeration() {
  const [reviews, setReviews] = (0, _react.useState)([]);
  const [filtered, setFiltered] = (0, _react.useState)([]);
  const [room, setRoom] = (0, _react.useState)('');
  const [user, setUser] = (0, _react.useState)('');
  const [loading, setLoading] = (0, _react.useState)(true);
  const [error, setError] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    loadReviews();
  }, []);
  (0, _react.useEffect)(() => {
    let data = [...reviews];
    if (room) data = data.filter(r => r.room && r.room.title && r.room.title.toLowerCase().includes(room.toLowerCase()));
    if (user) data = data.filter(r => r.user && r.user.email && r.user.email.toLowerCase().includes(user.toLowerCase()));
    setFiltered(data);
  }, [reviews, room, user]);
  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await (0, _api.fetchAllReviewsAdmin)();
      setReviews(data);
    } catch (e) {
      console.error('Error loading reviews:', e);
      setError(e.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = () => {
    loadReviews();
  };
  const handleApprove = async id => {
    await (0, _api.approveReviewAdmin)(id);
    setReviews(reviews => reviews.map(r => r._id === id ? {
      ...r,
      status: 'approved'
    } : r));
  };
  const handleDelete = async id => {
    if (!window.confirm('Delete this review?')) return;
    await (0, _api.deleteReviewAdmin)(id);
    setReviews(reviews => reviews.filter(r => r._id !== id));
  };
  const handleReport = async id => {
    await (0, _api.reportReviewAdmin)(id);
    setReviews(reviews => reviews.map(r => r._id === id ? {
      ...r,
      reported: true
    } : r));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "review-moderation-root"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "review-moderation-header"
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Review Moderation")), /*#__PURE__*/_react.default.createElement("div", {
    className: "review-moderation-controls"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "review-moderation-room",
    value: room,
    onChange: e => setRoom(e.target.value),
    placeholder: "Filter by room..."
  }), /*#__PURE__*/_react.default.createElement("input", {
    className: "review-moderation-user",
    value: user,
    onChange: e => setUser(e.target.value),
    placeholder: "Filter by user email..."
  })), loading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "review-moderation-loading"
  }, /*#__PURE__*/_react.default.createElement("div", null, "Loading reviews..."), /*#__PURE__*/_react.default.createElement("div", {
    className: "spinner"
  })) : error ? /*#__PURE__*/_react.default.createElement("div", {
    className: "review-moderation-error"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "error-message"
  }, "Error: ", error), /*#__PURE__*/_react.default.createElement("button", {
    className: "retry-button",
    onClick: handleRetry
  }, "Retry")) : /*#__PURE__*/_react.default.createElement("div", {
    className: "review-moderation-table-wrap"
  }, /*#__PURE__*/_react.default.createElement("table", {
    className: "review-moderation-table"
  }, /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", null, "Room"), /*#__PURE__*/_react.default.createElement("th", null, "User"), /*#__PURE__*/_react.default.createElement("th", null, "Rating"), /*#__PURE__*/_react.default.createElement("th", null, "Comment"), /*#__PURE__*/_react.default.createElement("th", null, "Status"), /*#__PURE__*/_react.default.createElement("th", null, "Actions"))), /*#__PURE__*/_react.default.createElement("tbody", null, filtered.map(r => /*#__PURE__*/_react.default.createElement("tr", {
    key: r._id
  }, /*#__PURE__*/_react.default.createElement("td", null, r.room?.title || '-'), /*#__PURE__*/_react.default.createElement("td", null, r.user?.email || '-'), /*#__PURE__*/_react.default.createElement("td", null, [...Array(5)].map((_, i) => /*#__PURE__*/_react.default.createElement(_fa.FaStar, {
    key: i,
    color: i < r.rating ? '#f59e42' : '#e5e7eb'
  }))), /*#__PURE__*/_react.default.createElement("td", null, r.comment), /*#__PURE__*/_react.default.createElement("td", null, r.status), /*#__PURE__*/_react.default.createElement("td", null, r.status !== 'approved' && /*#__PURE__*/_react.default.createElement("button", {
    className: "review-moderation-action review-moderation-approve",
    onClick: () => handleApprove(r._id)
  }, /*#__PURE__*/_react.default.createElement(_fa.FaCheck, null), " Approve"), /*#__PURE__*/_react.default.createElement("button", {
    className: "review-moderation-action review-moderation-delete",
    onClick: () => handleDelete(r._id)
  }, /*#__PURE__*/_react.default.createElement(_fa.FaTrash, null), " Delete"), !r.reported && /*#__PURE__*/_react.default.createElement("button", {
    className: "review-moderation-action review-moderation-report",
    onClick: () => handleReport(r._id)
  }, /*#__PURE__*/_react.default.createElement(_fa.FaFlag, null), " Report"))))))), error && /*#__PURE__*/_react.default.createElement("div", {
    className: "review-moderation-error"
  }, error));
}
var _default = exports.default = ReviewModeration;
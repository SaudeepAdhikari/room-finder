"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _fa = require("react-icons/fa");
var _auto = _interopRequireDefault(require("chart.js/auto"));
var _api = require("../api");
require("./AnalyticsDashboard.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = (0, _react.useState)('month'); // week, month, year
  const [loading, setLoading] = (0, _react.useState)(true);
  const [stats, setStats] = (0, _react.useState)(null);
  const [recentUsers, setRecentUsers] = (0, _react.useState)([]);
  const [recentRooms, setRecentRooms] = (0, _react.useState)([]);
  const roomChartRef = (0, _react.useRef)(null);
  const userChartRef = (0, _react.useRef)(null);
  const bookingChartRef = (0, _react.useRef)(null);
  const pieChartRef = (0, _react.useRef)(null);
  const chartInstances = (0, _react.useRef)({
    roomChart: null,
    userChart: null,
    bookingChart: null,
    pieChart: null
  });

  // Load initial data
  (0, _react.useEffect)(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Create/update charts when data changes
  (0, _react.useEffect)(() => {
    if (!stats) return;
    createCharts();
    return () => {
      // Cleanup charts on unmount
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [stats]);
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [statsData, users, rooms] = await Promise.all([(0, _api.getAdminStats)(timeRange), (0, _api.getRecentUsersAdmin)(), (0, _api.getRecentRoomsAdmin)()]);
      setStats(statsData);
      setRecentUsers(users);
      setRecentRooms(rooms);
    } catch (error) {
      console.error("Failed to fetch analytics data", error);
    } finally {
      setLoading(false);
    }
  };
  const createCharts = () => {
    // Destroy existing charts
    Object.entries(chartInstances.current).forEach(([key, chart]) => {
      if (chart) chart.destroy();
    });

    // Room distribution pie chart
    if (pieChartRef.current) {
      const {
        pending = 0,
        approved = 0,
        rejected = 0
      } = stats.rooms || {};
      chartInstances.current.pieChart = new _auto.default(pieChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Pending', 'Approved', 'Rejected'],
          datasets: [{
            data: [pending, approved, rejected],
            backgroundColor: ['#f59e42', '#22c55e', '#ef4444'],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 15
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 13,
                  family: "'Inter', sans-serif"
                }
              }
            },
            title: {
              display: true,
              text: 'Room Status Distribution',
              font: {
                size: 16,
                family: "'Inter', sans-serif"
              }
            }
          }
        }
      });
    }

    // User growth line chart
    if (userChartRef.current && stats.userGrowth) {
      const labels = stats.userGrowth.map(item => item.date);
      chartInstances.current.userChart = new _auto.default(userChartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'New Users',
            data: stats.userGrowth.map(item => item.count),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'User Growth',
              font: {
                size: 16,
                family: "'Inter', sans-serif"
              }
            }
          }
        }
      });
    }

    // Room creation bar chart
    if (roomChartRef.current && stats.roomGrowth) {
      const labels = stats.roomGrowth.map(item => item.date);
      chartInstances.current.roomChart = new _auto.default(roomChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'New Rooms',
            data: stats.roomGrowth.map(item => item.count),
            backgroundColor: '#22c55e',
            borderRadius: 6,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Room Listings Growth',
              font: {
                size: 16,
                family: "'Inter', sans-serif"
              }
            }
          }
        }
      });
    }

    // Booking trends line chart
    if (bookingChartRef.current && stats.bookingTrends) {
      const labels = stats.bookingTrends.map(item => item.date);
      chartInstances.current.bookingChart = new _auto.default(bookingChartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Bookings',
            data: stats.bookingTrends.map(item => item.count),
            borderColor: '#f59e42',
            backgroundColor: 'rgba(245, 158, 66, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#f59e42',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Booking Trends',
              font: {
                size: 16,
                family: "'Inter', sans-serif"
              }
            }
          }
        }
      });
    }
  };
  const getTotalRooms = () => {
    if (!stats || !stats.rooms) return '-';
    const {
      pending = 0,
      approved = 0,
      rejected = 0
    } = stats.rooms;
    return pending + approved + rejected;
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-dashboard"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-header"
  }, /*#__PURE__*/_react.default.createElement("h2", {
    className: "analytics-title"
  }, "Analytics Dashboard"), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-filters"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaCalendarAlt, {
    className: "analytics-filter-icon"
  }), /*#__PURE__*/_react.default.createElement("select", {
    value: timeRange,
    onChange: e => setTimeRange(e.target.value),
    className: "analytics-time-filter"
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "week"
  }, "Last 7 Days"), /*#__PURE__*/_react.default.createElement("option", {
    value: "month"
  }, "Last 30 Days"), /*#__PURE__*/_react.default.createElement("option", {
    value: "year"
  }, "Last 12 Months")))), loading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-loading"
  }, "Loading analytics data...") : !stats ? /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-error"
  }, "Failed to load analytics data") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metrics"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-icon",
    style: {
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaChartLine, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-value"
  }, stats.users?.count || '-'), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-label"
  }, "Total Users"), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-change positive"
  }, "+", stats.users?.recent7 || '0', " this week"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-icon",
    style: {
      background: 'linear-gradient(135deg, #22c55e, #4ade80)'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaHome, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-value"
  }, getTotalRooms()), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-label"
  }, "Total Rooms"), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-change positive"
  }, "+", stats.rooms?.recent7 || '0', " this week"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-icon",
    style: {
      background: 'linear-gradient(135deg, #f59e42, #fbbf24)'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaChartBar, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-value"
  }, stats.bookings?.total || '-'), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-label"
  }, "Total Bookings"), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-change positive"
  }, "+", stats.bookings?.recent7 || '0', " this week"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-icon",
    style: {
      background: 'linear-gradient(135deg, #ef4444, #f87171)'
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaChartPie, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-value"
  }, "$", stats.revenue?.total || '0'), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-label"
  }, "Total Revenue"), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-metric-change positive"
  }, "+$", stats.revenue?.recent7 || '0', " this week")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-charts"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    ref: userChartRef
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    ref: roomChartRef
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    ref: bookingChartRef
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    ref: pieChartRef
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-activity"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-section"
  }, /*#__PURE__*/_react.default.createElement("h3", {
    className: "analytics-recent-title"
  }, "Recent Users"), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-list"
  }, recentUsers.length > 0 ? recentUsers.slice(0, 5).map(user => /*#__PURE__*/_react.default.createElement("div", {
    key: user._id,
    className: "analytics-recent-item"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-avatar"
  }, user.avatar ? /*#__PURE__*/_react.default.createElement("img", {
    src: user.avatar,
    alt: user.email
  }) : /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-avatar-placeholder"
  }, (user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase())), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-primary"
  }, user.email), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-secondary"
  }, user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A')))) : /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-no-data"
  }, "No recent users"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-section"
  }, /*#__PURE__*/_react.default.createElement("h3", {
    className: "analytics-recent-title"
  }, "Recent Rooms"), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-list"
  }, recentRooms.length > 0 ? recentRooms.slice(0, 5).map(room => /*#__PURE__*/_react.default.createElement("div", {
    key: room._id,
    className: "analytics-recent-item"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-image"
  }, room.imageUrl ? /*#__PURE__*/_react.default.createElement("img", {
    src: room.imageUrl,
    alt: room.title
  }) : /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-image-placeholder"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaHome, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-primary"
  }, room.title), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-recent-item-secondary"
  }, room.location, " \u2022 $", room.price, "/month")), /*#__PURE__*/_react.default.createElement("div", {
    className: `analytics-recent-item-status analytics-status-${room.status}`
  }, room.status))) : /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-no-data"
  }, "No recent rooms"))))));
};
var _default = exports.default = AnalyticsDashboard;
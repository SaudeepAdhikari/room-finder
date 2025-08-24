"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _recharts = require("recharts");
var _fa = require("react-icons/fa");
var _api = require("../api");
require("./AdminAnalyticsPage.css");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = (0, _react.useState)('month');
  const [loading, setLoading] = (0, _react.useState)({
    occupancy: true,
    bookings: true,
    ratings: true
  });
  const [error, setError] = (0, _react.useState)({
    occupancy: null,
    bookings: null,
    ratings: null
  });
  const [occupancyData, setOccupancyData] = (0, _react.useState)([]);
  const [bookingData, setBookingData] = (0, _react.useState)([]);
  const [topRatedListings, setTopRatedListings] = (0, _react.useState)([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  (0, _react.useEffect)(() => {
    fetchOccupancyData();
    fetchBookingData();
    fetchTopRatedListings();
  }, [timeRange]);
  const fetchOccupancyData = async () => {
    setLoading(prev => ({
      ...prev,
      occupancy: true
    }));
    setError(prev => ({
      ...prev,
      occupancy: null
    }));
    try {
      const data = await (0, _api.getOccupancyData)(timeRange);
      setOccupancyData(data);
    } catch (err) {
      console.error('Failed to fetch occupancy data:', err);
      setError(prev => ({
        ...prev,
        occupancy: 'Failed to load occupancy data'
      }));
    } finally {
      setLoading(prev => ({
        ...prev,
        occupancy: false
      }));
    }
  };
  const fetchBookingData = async () => {
    setLoading(prev => ({
      ...prev,
      bookings: true
    }));
    setError(prev => ({
      ...prev,
      bookings: null
    }));
    try {
      const data = await (0, _api.getBookingFrequency)(timeRange);
      setBookingData(data);
    } catch (err) {
      console.error('Failed to fetch booking data:', err);
      setError(prev => ({
        ...prev,
        bookings: 'Failed to load booking frequency data'
      }));
    } finally {
      setLoading(prev => ({
        ...prev,
        bookings: false
      }));
    }
  };
  const fetchTopRatedListings = async () => {
    setLoading(prev => ({
      ...prev,
      ratings: true
    }));
    setError(prev => ({
      ...prev,
      ratings: null
    }));
    try {
      const data = await (0, _api.getTopRatedListings)();
      setTopRatedListings(data);
    } catch (err) {
      console.error('Failed to fetch top rated listings:', err);
      setError(prev => ({
        ...prev,
        ratings: 'Failed to load top rated listings'
      }));
    } finally {
      setLoading(prev => ({
        ...prev,
        ratings: false
      }));
    }
  };
  const formatRating = rating => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  // Mock data for initial rendering if API fails
  const getMockOccupancyData = () => {
    return [{
      month: 'Jan',
      occupancyRate: 68,
      availableRooms: 120
    }, {
      month: 'Feb',
      occupancyRate: 72,
      availableRooms: 118
    }, {
      month: 'Mar',
      occupancyRate: 80,
      availableRooms: 125
    }, {
      month: 'Apr',
      occupancyRate: 85,
      availableRooms: 130
    }, {
      month: 'May',
      occupancyRate: 90,
      availableRooms: 135
    }, {
      month: 'Jun',
      occupancyRate: 95,
      availableRooms: 140
    }];
  };
  const getMockBookingData = () => {
    return [{
      day: 'Mon',
      bookings: 15
    }, {
      day: 'Tue',
      bookings: 12
    }, {
      day: 'Wed',
      bookings: 18
    }, {
      day: 'Thu',
      bookings: 20
    }, {
      day: 'Fri',
      bookings: 25
    }, {
      day: 'Sat',
      bookings: 30
    }, {
      day: 'Sun',
      bookings: 22
    }];
  };
  const getMockTopRatedListings = () => {
    return [{
      id: 1,
      title: 'Luxury Apartment in Downtown',
      rating: 4.9,
      reviewCount: 42,
      location: 'Downtown'
    }, {
      id: 2,
      title: 'Cozy Studio near University',
      rating: 4.8,
      reviewCount: 38,
      location: 'University Area'
    }, {
      id: 3,
      title: 'Modern Loft with City View',
      rating: 4.7,
      reviewCount: 56,
      location: 'West End'
    }, {
      id: 4,
      title: 'Spacious 2 Bedroom with Garden',
      rating: 4.7,
      reviewCount: 31,
      location: 'Suburbs'
    }, {
      id: 5,
      title: 'Charming Victorian House',
      rating: 4.6,
      reviewCount: 27,
      location: 'Historic District'
    }];
  };
  const displayData = {
    occupancy: occupancyData.length > 0 ? occupancyData : getMockOccupancyData(),
    bookings: bookingData.length > 0 ? bookingData : getMockBookingData(),
    ratings: topRatedListings.length > 0 ? topRatedListings : getMockTopRatedListings()
  };
  const generatePieData = () => {
    // Create pie chart data showing how many rooms are in each rating bracket
    const ratingBrackets = {
      '5 stars': 0,
      '4-4.9 stars': 0,
      '3-3.9 stars': 0,
      'Below 3 stars': 0,
      'No ratings': 0
    };
    displayData.ratings.forEach(room => {
      if (!room.rating) {
        ratingBrackets['No ratings']++;
      } else if (room.rating === 5) {
        ratingBrackets['5 stars']++;
      } else if (room.rating >= 4) {
        ratingBrackets['4-4.9 stars']++;
      } else if (room.rating >= 3) {
        ratingBrackets['3-3.9 stars']++;
      } else {
        ratingBrackets['Below 3 stars']++;
      }
    });
    return Object.entries(ratingBrackets).map(([name, value]) => ({
      name,
      value
    }));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-analytics-page"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-header"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "Room Analytics"), /*#__PURE__*/_react.default.createElement("div", {
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
  }, "Last 12 Months")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-row"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-title"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaBuilding, null), /*#__PURE__*/_react.default.createElement("h2", null, "Room Occupancy Trends")), loading.occupancy && /*#__PURE__*/_react.default.createElement(_fa.FaSpinner, {
    className: "chart-loading-spinner"
  })), error.occupancy ? /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-error"
  }, error.occupancy) : /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-body"
  }, /*#__PURE__*/_react.default.createElement(_recharts.ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/_react.default.createElement(_recharts.AreaChart, {
    data: displayData.occupancy
  }, /*#__PURE__*/_react.default.createElement(_recharts.CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: "#eee"
  }), /*#__PURE__*/_react.default.createElement(_recharts.XAxis, {
    dataKey: "month"
  }), /*#__PURE__*/_react.default.createElement(_recharts.YAxis, {
    yAxisId: "left"
  }), /*#__PURE__*/_react.default.createElement(_recharts.YAxis, {
    yAxisId: "right",
    orientation: "right"
  }), /*#__PURE__*/_react.default.createElement(_recharts.Tooltip, null), /*#__PURE__*/_react.default.createElement(_recharts.Legend, null), /*#__PURE__*/_react.default.createElement(_recharts.Area, {
    yAxisId: "left",
    type: "monotone",
    dataKey: "occupancyRate",
    stroke: "#8884d8",
    fill: "#8884d8",
    fillOpacity: 0.3,
    name: "Occupancy Rate (%)"
  }), /*#__PURE__*/_react.default.createElement(_recharts.Line, {
    yAxisId: "right",
    type: "monotone",
    dataKey: "availableRooms",
    stroke: "#82ca9d",
    name: "Available Rooms"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-insight"
  }, /*#__PURE__*/_react.default.createElement("p", null, "Occupancy rates show how many available rooms are actually booked.")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-title"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaChartBar, null), /*#__PURE__*/_react.default.createElement("h2", null, "Booking Frequency")), loading.bookings && /*#__PURE__*/_react.default.createElement(_fa.FaSpinner, {
    className: "chart-loading-spinner"
  })), error.bookings ? /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-error"
  }, error.bookings) : /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-body"
  }, /*#__PURE__*/_react.default.createElement(_recharts.ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/_react.default.createElement(_recharts.BarChart, {
    data: displayData.bookings
  }, /*#__PURE__*/_react.default.createElement(_recharts.CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: "#eee"
  }), /*#__PURE__*/_react.default.createElement(_recharts.XAxis, {
    dataKey: "day"
  }), /*#__PURE__*/_react.default.createElement(_recharts.YAxis, null), /*#__PURE__*/_react.default.createElement(_recharts.Tooltip, null), /*#__PURE__*/_react.default.createElement(_recharts.Bar, {
    dataKey: "bookings",
    name: "Number of Bookings",
    fill: "#2563eb",
    radius: [4, 4, 0, 0]
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-insight"
  }, /*#__PURE__*/_react.default.createElement("p", null, "Weekend bookings are typically higher than weekdays."))))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-row"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-title"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaStar, null), /*#__PURE__*/_react.default.createElement("h2", null, "Rating Distribution")), loading.ratings && /*#__PURE__*/_react.default.createElement(_fa.FaSpinner, {
    className: "chart-loading-spinner"
  })), error.ratings ? /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-error"
  }, error.ratings) : /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-body"
  }, /*#__PURE__*/_react.default.createElement(_recharts.ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/_react.default.createElement(_recharts.PieChart, null, /*#__PURE__*/_react.default.createElement(_recharts.Pie, {
    data: generatePieData(),
    cx: "50%",
    cy: "50%",
    labelLine: false,
    outerRadius: 100,
    fill: "#8884d8",
    dataKey: "value",
    label: ({
      name,
      percent
    }) => `${name}: ${(percent * 100).toFixed(0)}%`
  }, generatePieData().map((entry, index) => /*#__PURE__*/_react.default.createElement(_recharts.Cell, {
    key: `cell-${index}`,
    fill: COLORS[index % COLORS.length]
  }))), /*#__PURE__*/_react.default.createElement(_recharts.Tooltip, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-insight"
  }, /*#__PURE__*/_react.default.createElement("p", null, "Majority of listings have 4+ star ratings, indicating high quality.")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "analytics-chart-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-title"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaStar, null), /*#__PURE__*/_react.default.createElement("h2", null, "Top Rated Listings")), loading.ratings && /*#__PURE__*/_react.default.createElement(_fa.FaSpinner, {
    className: "chart-loading-spinner"
  })), error.ratings ? /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-error"
  }, error.ratings) : /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-body"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "top-rated-list"
  }, displayData.ratings.slice(0, 5).map((room, index) => /*#__PURE__*/_react.default.createElement("div", {
    className: "top-rated-item",
    key: room.id || index
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "top-rated-rank"
  }, index + 1), /*#__PURE__*/_react.default.createElement("div", {
    className: "top-rated-details"
  }, /*#__PURE__*/_react.default.createElement("h3", null, room.title), /*#__PURE__*/_react.default.createElement("div", {
    className: "top-rated-meta"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "top-rated-location"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaMapMarkerAlt, null), " ", room.location), /*#__PURE__*/_react.default.createElement("span", {
    className: "top-rated-rating"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaStar, null), " ", formatRating(room.rating), /*#__PURE__*/_react.default.createElement("span", {
    className: "review-count"
  }, "(", room.reviewCount, " reviews)"))))))), /*#__PURE__*/_react.default.createElement("div", {
    className: "chart-insight"
  }, /*#__PURE__*/_react.default.createElement("p", null, "These listings have the highest ratings and most reviews."))))));
};
var _default = exports.default = AdminAnalyticsPage;
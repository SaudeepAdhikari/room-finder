import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Line,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  FaChartBar, FaStar, FaCalendarAlt,
  FaBuilding, FaMapMarkerAlt, FaExclamationCircle, FaSync
} from 'react-icons/fa/index.esm.js';
import { getOccupancyData, getBookingFrequency, getTopRatedListings } from '../api.js';
import './AdminAnalyticsPage.css';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState({
    occupancy: true,
    bookings: true,
    ratings: true
  });
  const [error, setError] = useState({
    occupancy: null,
    bookings: null,
    ratings: null
  });
  const [occupancyData, setOccupancyData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [topRatedListings, setTopRatedListings] = useState([]);

  // intentionally only depends on timeRange; other functions are stable
  useEffect(() => {
    fetchOccupancyData();
    fetchBookingData();
    fetchTopRatedListings();
  }, [timeRange]);

  const fetchOccupancyData = async () => {
    setLoading(prev => ({ ...prev, occupancy: true }));
    setError(prev => ({ ...prev, occupancy: null }));

    try {
      const data = await getOccupancyData(timeRange);
      setOccupancyData(data);
    } catch (err) {
      console.error('Failed to fetch occupancy data:', err);
      setError(prev => ({ ...prev, occupancy: 'Failed to load occupancy data' }));
    } finally {
      setLoading(prev => ({ ...prev, occupancy: false }));
    }
  };

  const fetchBookingData = async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    setError(prev => ({ ...prev, bookings: null }));

    try {
      const data = await getBookingFrequency(timeRange);
      setBookingData(data);
    } catch (err) {
      console.error('Failed to fetch booking data:', err);
      setError(prev => ({ ...prev, bookings: 'Failed to load booking frequency data' }));
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const fetchTopRatedListings = async () => {
    setLoading(prev => ({ ...prev, ratings: true }));
    setError(prev => ({ ...prev, ratings: null }));

    try {
      const data = await getTopRatedListings();
      setTopRatedListings(data);
    } catch (err) {
      console.error('Failed to fetch top rated listings:', err);
      setError(prev => ({ ...prev, ratings: 'Failed to load top rated listings' }));
    } finally {
      setLoading(prev => ({ ...prev, ratings: false }));
    }
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  // Use only live fetched data. Charts will render empty state if APIs return no data.
  const displayData = {
    occupancy: occupancyData,
    bookings: bookingData,
    ratings: topRatedListings,
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
    if (!Array.isArray(displayData.ratings) || displayData.ratings.length === 0) {
      return [];
    }

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

    return Object.entries(ratingBrackets).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="admin-analytics-page animation-fade-in">
      <div className="page-header-actions">
        <div>
          <h2 className="admin-page-title">Room Analytics</h2>
          <p className="admin-page-subtitle">Visualise property performance, occupancy trends, and guest satisfaction.</p>
        </div>

        <div className="analytics-filters card-shadow-sm">
          <FaCalendarAlt className="analytics-filter-icon" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-premium select-premium"
          >
            <option value="week">Range: Last 7 Days</option>
            <option value="month">Range: Last 30 Days</option>
            <option value="year">Range: Last 12 Months</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="premium-card chart-card">
          <div className="chart-header-premium">
            <div className="chart-title-group">
              <div className="chart-icon-box blue">
                <FaBuilding />
              </div>
              <div>
                <h3>Occupancy Trends</h3>
                <span className="chart-subtitle">Real-time room utilization rates</span>
              </div>
            </div>
            {loading.occupancy && <div className="spinner-small" />}
          </div>

          {error.occupancy ? (
            <div className="chart-error-panel">
              <FaExclamationCircle />
              <p>{error.occupancy}</p>
            </div>
          ) : (
            <div className="chart-body-premium">
              {displayData.occupancy && displayData.occupancy.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={displayData.occupancy}>
                      <defs>
                        <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-premium)' }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="occupancyRate"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorOcc)"
                        name="Occupancy (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="chart-footer-insight">
                    <p>Growth in occupancy indicates increasing platform demand.</p>
                  </div>
                </>
              ) : (
                <div className="no-chart-data">No occupancy data available for this range.</div>
              )}
            </div>
          )}
        </div>

        <div className="premium-card chart-card">
          <div className="chart-header-premium">
            <div className="chart-title-group">
              <div className="chart-icon-box purple">
                <FaChartBar />
              </div>
              <div>
                <h3>Booking Frequency</h3>
                <span className="chart-subtitle">Volume of reservations over time</span>
              </div>
            </div>
            {loading.bookings && <div className="spinner-small" />}
          </div>

          {error.bookings ? (
            <div className="chart-error-panel">
              <FaExclamationCircle />
              <p>{error.bookings}</p>
            </div>
          ) : (
            <div className="chart-body-premium">
              {displayData.bookings && displayData.bookings.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={displayData.bookings}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-premium)' }}
                      />
                      <Bar dataKey="bookings" name="Bookings" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="chart-footer-insight">
                    <p>Daily trends help identify peak reservation periods.</p>
                  </div>
                </>
              ) : (
                <div className="no-chart-data">No booking frequency data available.</div>
              )}
            </div>
          )}
        </div>

        <div className="premium-card chart-card">
          <div className="chart-header-premium">
            <div className="chart-title-group">
              <div className="chart-icon-box amber">
                <FaStar />
              </div>
              <div>
                <h3>Rating Distribution</h3>
                <span className="chart-subtitle">Customer satisfaction breakdown</span>
              </div>
            </div>
            {loading.ratings && <div className="spinner-small" />}
          </div>

          {error.ratings ? (
            <div className="chart-error-panel">
              <FaExclamationCircle />
              <p>{error.ratings}</p>
            </div>
          ) : (
            <div className="chart-body-premium">
              {generatePieData().some(d => d.value > 0) ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={generatePieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {generatePieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-premium)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="chart-footer-insight">
                    <p>Higher ratings correlate with property visibility and trust.</p>
                  </div>
                </>
              ) : (
                <div className="no-chart-data">No rating distribution data available.</div>
              )}
            </div>
          )}
        </div>

        <div className="premium-card chart-card">
          <div className="chart-header-premium">
            <div className="chart-title-group">
              <div className="chart-icon-box green">
                <FaStar />
              </div>
              <div>
                <h3>Top Performing Properties</h3>
                <span className="chart-subtitle">Based on revenue and guest ratings</span>
              </div>
            </div>
            {loading.ratings && <div className="spinner-small" />}
          </div>

          {error.ratings ? (
            <div className="chart-error-panel">
              <FaExclamationCircle />
              <p>{error.ratings}</p>
            </div>
          ) : (
            <div className="chart-body-premium">
              {displayData.ratings && displayData.ratings.length > 0 ? (
                <div className="top-rated-list-premium">
                  {displayData.ratings.slice(0, 5).map((room, index) => (
                    <div className="top-rated-item-premium" key={room.id || index}>
                      <div className={`rank-badge rank-${index + 1}`}>{index + 1}</div>
                      <div className="room-analytics-info">
                        <div className="room-title-analytics">{room.title}</div>
                        <div className="room-meta-analytics">
                          <span className="location"><FaMapMarkerAlt /> {room.location}</span>
                          <span className="rating"><FaStar /> {formatRating(room.rating)} <small>({room.reviewCount})</small></span>
                        </div>
                      </div>
                      <div className="room-performance-indicator">
                        <div className="perf-bar" style={{ width: `${(room.rating / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-chart-data">No property performance data recorded yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;

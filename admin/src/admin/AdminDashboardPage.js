import React, { useEffect, useState, useRef } from 'react';
import {
  FaChartBar, FaUsers, FaBed, FaCalendarAlt, FaArrowUp, FaArrowDown,
  FaClock, FaCheckCircle, FaExclamationCircle, FaUserPlus, FaCreditCard, FaHome
} from 'react-icons/fa/index.esm.js';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

import './AdminDashboardPage.css';
import './AdminPage.css';
import {
  getAdminStats,
  getRoomCountAdmin,
  getUserCountAdmin,
  fetchAllTransactionsAdmin,
  getRecentUsersAdmin,
  getRecentRoomsAdmin
} from '../api.js';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);
  const pollRef = useRef(null);
  const esRef = useRef(null);

  const [timeRange, setTimeRange] = useState('month');

  const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString() : '-');
  const formatCurrency = (n) => (typeof n === 'number' ? `$${n.toLocaleString()}` : '-');

  const fetchDashboardData = async () => {
    try {
      const [statsRes, txnsRes, usersRes, roomsRes] = await Promise.all([
        getAdminStats(timeRange).catch(() => ({})),
        fetchAllTransactionsAdmin().catch(() => []),
        getRecentUsersAdmin().catch(() => []),
        getRecentRoomsAdmin().catch(() => [])
      ]);

      setStats(statsRes);

      // Use transactions from stats if available, else from separate fetch
      const txns = statsRes.recentTransactions || txnsRes || [];
      setTransactions(txns.slice(0, 4));

      // Use activity items from stats if available
      const actUsers = statsRes.recentUsers || usersRes || [];
      const actRooms = statsRes.recentRooms || roomsRes || [];

      const activity = [
        ...actUsers.map(u => ({ ...u, activityType: 'user', timestamp: u.createdAt })),
        ...actRooms.map(r => ({ ...r, activityType: 'room', timestamp: r.createdAt }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

      setRecentActivity(activity);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  useEffect(() => {
    let closed = false;

    // Try SSE first
    try {
      const es = new EventSource(`/api/admin/analytics/stream?timeRange=${timeRange}`, { withCredentials: true });
      esRef.current = es;

      es.onopen = () => {
        setSseConnected(true);
        setLoading(false);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      };

      es.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload && payload.stats) {
            const newStats = payload.stats;
            setStats(newStats);

            if (newStats.recentTransactions) {
              setTransactions(newStats.recentTransactions.slice(0, 4));
            }

            if (newStats.recentUsers || newStats.recentRooms) {
              const actUsers = newStats.recentUsers || [];
              const actRooms = newStats.recentRooms || [];
              const activity = [
                ...actUsers.map(u => ({ ...u, activityType: 'user', timestamp: u.createdAt })),
                ...actRooms.map(r => ({ ...r, activityType: 'room', timestamp: r.createdAt }))
              ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
              setRecentActivity(activity);
            }

            setLoading(false);
          }
        } catch (e) {
          console.error('Failed to parse SSE message', e);
        }
      };

      es.onerror = (err) => {
        console.warn('SSE error, falling back to polling', err);
        setSseConnected(false);
        try { es.close(); } catch (e) { }
        // start polling
        if (!pollRef.current) {
          fetchDashboardData();
          pollRef.current = setInterval(fetchDashboardData, 10000);
        }
      };
    } catch (err) {
      console.warn('SSE not available, using polling', err);
      // start polling
      fetchDashboardData();
      pollRef.current = setInterval(fetchDashboardData, 10000);
    }

    // cleanup
    return () => {
      closed = true;
      if (esRef.current) try { esRef.current.close(); } catch (e) { }
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const usersCount = stats?.users?.count ?? null;
  const bookingsTotal = stats?.bookings?.total ?? null;
  const revenueTotal = stats?.revenue?.total ?? null;
  const pendingRooms = stats?.rooms?.pending ?? null;
  const totalRoomsStat = stats?.rooms?.total ?? null;

  const [totalRoomsFallback, setTotalRoomsFallback] = useState(null);

  useEffect(() => {
    // If stats does not include total rooms, fetch a fallback count once
    if (totalRoomsStat === null) {
      let mounted = true;
      getRoomCountAdmin().then(res => {
        if (!mounted) return;
        setTotalRoomsFallback(res.total ?? null);
      }).catch(() => {
        if (!mounted) return;
        setTotalRoomsFallback(null);
      });
      return () => { mounted = false; };
    }
  }, [totalRoomsStat]);

  // Map real data for charts: date -> name, count -> bookings
  const chartData = (stats?.bookingTrends || []).map(item => ({
    name: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    bookings: item.count,
    revenue: item.revenue
  }));

  // Show empty state if no data instead of fake data
  const hasChartData = chartData.length > 0;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="admin-header-actions">
          <span className={`status-badge ${sseConnected ? 'live' : 'sync'}`}>
            {sseConnected ? 'Live Connection' : 'Synced'}
          </span>
          <button className="btn btn-primary" onClick={fetchDashboardData}>Refresh Data</button>
        </div>
      </div>

      <div className="admin-dashboard-layout">
        <div className="admin-stats-grid">
          {/* User Card */}
          <div className="admin-stat-card premium-card">
            <div className="stat-content">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{loading ? '—' : formatNumber(usersCount)}</div>
              <div className="stat-trend positive">
                <FaArrowUp /> {formatNumber(stats?.users?.recent7 || 0)} <span className="trend-label">new this week</span>
              </div>
            </div>
            <div className="stat-icon-wrapper users">
              <FaUsers />
            </div>
          </div>

          {/* Bookings Card */}
          <div className="admin-stat-card premium-card">
            <div className="stat-content">
              <div className="stat-label">Active Bookings</div>
              <div className="stat-value">{loading ? '—' : formatNumber(bookingsTotal)}</div>
              <div className="stat-trend positive">
                <FaArrowUp /> {formatNumber(stats?.bookings?.recent7 || 0)} <span className="trend-label">new this week</span>
              </div>
            </div>
            <div className="stat-icon-wrapper bookings">
              <FaCalendarAlt />
            </div>
          </div>

          {/* Revenue Card */}
          <div className="admin-stat-card premium-card">
            <div className="stat-content">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">{loading ? '—' : formatCurrency(revenueTotal)}</div>
              <div className="stat-trend positive">
                <FaArrowUp /> {formatCurrency(stats?.revenue?.recent7 || 0)} <span className="trend-label">this week</span>
              </div>
            </div>
            <div className="stat-icon-wrapper revenue">
              <FaChartBar />
            </div>
          </div>

          {/* Listed Rooms Card */}
          <div className="admin-stat-card premium-card">
            <div className="stat-content">
              <div className="stat-label">Listed Rooms</div>
              <div className="stat-value">{loading ? '—' : formatNumber(totalRoomsStat ?? totalRoomsFallback)}</div>
              <div className="stat-trend neutral">
                <span className="trend-label">Pending: {pendingRooms || 0}</span>
              </div>
            </div>
            <div className="stat-icon-wrapper rooms">
              <FaBed />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard-grid-row">
          <div className="dashboard-chart-card premium-card revenue-chart">
            <div className="card-header">
              <h3 className="card-title">Revenue Analytics</h3>
              <div className="card-actions">
                <select
                  className="chart-select"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
            <div className="chart-wrapper">
              {hasChartData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      contentStyle={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-chart-data">No revenue data available for this period.</div>
              )}
            </div>
          </div>

          <div className="dashboard-chart-card premium-card bookings-chart">
            <div className="card-header">
              <h3 className="card-title">Booking Trends</h3>
              <div className="card-actions">
                <button className="btn-icon"><FaClock /></button>
              </div>
            </div>
            <div className="chart-wrapper">
              {hasChartData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      contentStyle={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="bookings" fill="var(--secondary)" radius={[6, 6, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-chart-data">No booking trends available for this period.</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Bookings & Activity */}
        <div className="dashboard-grid-row">
          <div className="dashboard-table-card premium-card">
            <div className="card-header">
              <h3 className="card-title">Recent Transactions</h3>
              <button className="btn-link">View All</button>
            </div>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((txn) => (
                      <tr key={txn._id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar-small" style={{ background: 'var(--primary)' }}>
                              {(txn.tenant?.firstName?.[0] || txn.tenant?.email?.[0] || 'U').toUpperCase()}
                            </div>
                            <span>{txn.tenant?.firstName || 'Guest'} {txn.tenant?.lastName || ''}</span>
                          </div>
                        </td>
                        <td><code className="txn-ref">{txn.transactionId?.substring(0, 8)}...</code></td>
                        <td className="font-bold">Rs. {txn.amount?.toLocaleString()}</td>
                        <td>
                          <span className={`badge-status ${txn.paymentStatus === 'success' ? 'success' : txn.paymentStatus === 'pending' ? 'warning' : 'danger'}`}>
                            {txn.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center">No recent transactions</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-activity-card premium-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="activity-timeline">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <div className="activity-item" key={idx}>
                    <div className={`activity-icon ${activity.activityType === 'user' ? 'blue' : 'purple'}`}>
                      {activity.activityType === 'user' ? <FaUserPlus /> : <FaHome />}
                    </div>
                    <div className="activity-content">
                      <p>
                        {activity.activityType === 'user' ? (
                          <>New user registered: <strong>{activity.firstName} {activity.lastName}</strong></>
                        ) : (
                          <>New property listed: <strong>{activity.title}</strong></>
                        )}
                      </p>
                      <small>{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

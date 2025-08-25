import React, { useEffect, useState, useRef } from 'react';
import { FaChartBar, FaUsers, FaBed, FaCalendarAlt } from 'react-icons/fa/index.esm.js';

import './AdminDashboardPage.css';
import './AdminPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);
  const pollRef = useRef(null);
  const esRef = useRef(null);

  const timeRange = 'month';

  const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString() : '-');
  const formatCurrency = (n) => (typeof n === 'number' ? `$${n.toLocaleString()}` : '-');

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/admin/stats?timeRange=${timeRange}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setStats(json);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setLoading(false);
    }
  };

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
            setStats(payload.stats);
            setLoading(false);
          }
        } catch (e) {
          console.error('Failed to parse SSE message', e);
        }
      };

      es.onerror = (err) => {
        console.warn('SSE error, falling back to polling', err);
        setSseConnected(false);
        try { es.close(); } catch (e) {}
        // start polling
        if (!pollRef.current) {
          fetchStats();
          pollRef.current = setInterval(fetchStats, 10000);
        }
      };
    } catch (err) {
      console.warn('SSE not available, using polling', err);
      // start polling
      fetchStats();
      pollRef.current = setInterval(fetchStats, 10000);
    }

    // cleanup
    return () => {
      closed = true;
      if (esRef.current) try { esRef.current.close(); } catch (e) {}
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usersCount = stats?.users?.count ?? null;
  const bookingsTotal = stats?.bookings?.total ?? null;
  const revenueTotal = stats?.revenue?.total ?? null;
  const pendingRooms = stats?.rooms?.pending ?? null;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-dashboard">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Total Users</div>
              <div className="admin-stat-icon users">
                <FaUsers />
              </div>
            </div>
            <div className="admin-stat-value">{loading ? '—' : formatNumber(usersCount)}</div>
            <div className="admin-stat-change positive">
              <span className="admin-stat-period">{sseConnected ? 'live' : 'updated'}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Active Bookings</div>
              <div className="admin-stat-icon bookings">
                <FaCalendarAlt />
              </div>
            </div>
            <div className="admin-stat-value">{loading ? '—' : formatNumber(bookingsTotal)}</div>
            <div className="admin-stat-change positive">
              <span className="admin-stat-period">{sseConnected ? 'live' : 'updated'}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Revenue</div>
              <div className="admin-stat-icon revenue">
                <FaChartBar />
              </div>
            </div>
            <div className="admin-stat-value">{loading ? '—' : formatCurrency(revenueTotal)}</div>
            <div className="admin-stat-change positive">
              <span className="admin-stat-period">{sseConnected ? 'live' : 'updated'}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Pending Approvals</div>
              <div className="admin-stat-icon rooms">
                <FaBed />
              </div>
            </div>
            <div className="admin-stat-value">{loading ? '—' : formatNumber(pendingRooms)}</div>
            <div className="admin-stat-change negative">
              <span className="admin-stat-period">{sseConnected ? 'live' : 'updated'}</span>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-row">
          <div className="admin-chart-container">
            <div className="admin-chart-header">
              <div className="admin-chart-title">Recent Activity</div>
              <div className="admin-chart-actions">
                <button className="btn btn-secondary">Export</button>
                <button className="btn btn-primary">New Report</button>
              </div>
            </div>
            <div style={{height: 240}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

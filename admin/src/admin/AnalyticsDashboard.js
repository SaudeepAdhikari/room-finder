import React, { useState, useEffect, useRef } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt, FaFilter, FaHome } from 'react-icons/fa/index.esm.js';

import Chart from 'chart.js/auto';

import { getAdminStats, getRecentUsersAdmin, getRecentRoomsAdmin } from '../api.js';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month'); // week, month, year
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentRooms, setRecentRooms] = useState([]);
  
  const roomChartRef = useRef(null);
  const userChartRef = useRef(null);
  const bookingChartRef = useRef(null);
  const pieChartRef = useRef(null);
  
  const chartInstances = useRef({
    roomChart: null,
    userChart: null,
    bookingChart: null,
    pieChart: null
  });

  // Load initial data
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);
  
  // Create/update charts when data changes
  useEffect(() => {
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
      const [statsData, users, rooms] = await Promise.all([
        getAdminStats(timeRange),
        getRecentUsersAdmin(),
        getRecentRoomsAdmin()
      ]);
      
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
      const { pending = 0, approved = 0, rejected = 0 } = stats.rooms || {};
      chartInstances.current.pieChart = new Chart(pieChartRef.current, {
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
                font: { size: 13, family: "'Inter', sans-serif" }
              }
            },
            title: {
              display: true,
              text: 'Room Status Distribution',
              font: { size: 16, family: "'Inter', sans-serif" }
            }
          }
        }
      });
    }

    // User growth line chart
    if (userChartRef.current && stats.userGrowth) {
      const labels = stats.userGrowth.map(item => item.date);
      chartInstances.current.userChart = new Chart(userChartRef.current, {
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
            x: { grid: { display: false } },
            y: { beginAtZero: true }
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'User Growth',
              font: { size: 16, family: "'Inter', sans-serif" }
            }
          }
        }
      });
    }

    // Room creation bar chart
    if (roomChartRef.current && stats.roomGrowth) {
      const labels = stats.roomGrowth.map(item => item.date);
      chartInstances.current.roomChart = new Chart(roomChartRef.current, {
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
            x: { grid: { display: false } },
            y: { beginAtZero: true }
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Room Listings Growth',
              font: { size: 16, family: "'Inter', sans-serif" }
            }
          }
        }
      });
    }

    // Booking trends line chart
    if (bookingChartRef.current && stats.bookingTrends) {
      const labels = stats.bookingTrends.map(item => item.date);
      chartInstances.current.bookingChart = new Chart(bookingChartRef.current, {
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
            x: { grid: { display: false } },
            y: { beginAtZero: true }
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Booking Trends',
              font: { size: 16, family: "'Inter', sans-serif" }
            }
          }
        }
      });
    }
  };

  const getTotalRooms = () => {
    if (!stats || !stats.rooms) return '-';
    const { pending = 0, approved = 0, rejected = 0 } = stats.rooms;
    return pending + approved + rejected;
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2 className="analytics-title">Analytics Dashboard</h2>
        
        <div className="analytics-filters">
          <FaCalendarAlt className="analytics-filter-icon" />
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="analytics-time-filter"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="analytics-loading">Loading analytics data...</div>
      ) : !stats ? (
        <div className="analytics-error">Failed to load analytics data</div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="analytics-metrics">
            <div className="analytics-metric">
              <div className="analytics-metric-icon" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
                <FaChartLine />
              </div>
              <div className="analytics-metric-content">
                <div className="analytics-metric-value">{stats.users?.count || '-'}</div>
                <div className="analytics-metric-label">Total Users</div>
                <div className="analytics-metric-change positive">
                  +{stats.users?.recent7 || '0'} this week
                </div>
              </div>
            </div>
            
            <div className="analytics-metric">
              <div className="analytics-metric-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)' }}>
                <FaHome />
              </div>
              <div className="analytics-metric-content">
                <div className="analytics-metric-value">{getTotalRooms()}</div>
                <div className="analytics-metric-label">Total Rooms</div>
                <div className="analytics-metric-change positive">
                  +{stats.rooms?.recent7 || '0'} this week
                </div>
              </div>
            </div>
            
            <div className="analytics-metric">
              <div className="analytics-metric-icon" style={{ background: 'linear-gradient(135deg, #f59e42, #fbbf24)' }}>
                <FaChartBar />
              </div>
              <div className="analytics-metric-content">
                <div className="analytics-metric-value">{stats.bookings?.total || '-'}</div>
                <div className="analytics-metric-label">Total Bookings</div>
                <div className="analytics-metric-change positive">
                  +{stats.bookings?.recent7 || '0'} this week
                </div>
              </div>
            </div>
            
            <div className="analytics-metric">
              <div className="analytics-metric-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}>
                <FaChartPie />
              </div>
              <div className="analytics-metric-content">
                <div className="analytics-metric-value">${stats.revenue?.total || '0'}</div>
                <div className="analytics-metric-label">Total Revenue</div>
                <div className="analytics-metric-change positive">
                  +${stats.revenue?.recent7 || '0'} this week
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="analytics-charts">
            <div className="analytics-chart-container">
              <canvas ref={userChartRef}></canvas>
            </div>
            
            <div className="analytics-chart-container">
              <canvas ref={roomChartRef}></canvas>
            </div>
            
            <div className="analytics-chart-container">
              <canvas ref={bookingChartRef}></canvas>
            </div>
            
            <div className="analytics-chart-container">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="analytics-recent-activity">
            <div className="analytics-recent-section">
              <h3 className="analytics-recent-title">Recent Users</h3>
              <div className="analytics-recent-list">
                {recentUsers.length > 0 ? (
                  recentUsers.slice(0, 5).map(user => (
                    <div key={user._id} className="analytics-recent-item">
                      <div className="analytics-recent-item-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.email} />
                        ) : (
                          <div className="analytics-avatar-placeholder">
                            {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="analytics-recent-item-content">
                        <div className="analytics-recent-item-primary">{user.email}</div>
                        <div className="analytics-recent-item-secondary">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="analytics-no-data">No recent users</div>
                )}
              </div>
            </div>
            
            <div className="analytics-recent-section">
              <h3 className="analytics-recent-title">Recent Rooms</h3>
              <div className="analytics-recent-list">
                {recentRooms.length > 0 ? (
                  recentRooms.slice(0, 5).map(room => (
                    <div key={room._id} className="analytics-recent-item">
                      <div className="analytics-recent-item-image">
                        {room.imageUrl ? (
                          <img src={room.imageUrl} alt={room.title} />
                        ) : (
                          <div className="analytics-image-placeholder">
                            <FaHome />
                          </div>
                        )}
                      </div>
                      <div className="analytics-recent-item-content">
                        <div className="analytics-recent-item-primary">{room.title}</div>
                        <div className="analytics-recent-item-secondary">
                          {room.location} • ${room.price}/month
                        </div>
                      </div>
                      <div className={`analytics-recent-item-status analytics-status-${room.status}`}>
                        {room.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="analytics-no-data">No recent rooms</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

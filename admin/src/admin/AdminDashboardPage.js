import React from 'react';
import { FaChartBar, FaUsers, FaBed, FaCalendarAlt } from 'react-icons/fa/index.esm.js';

import './AdminDashboardPage.css';
import './AdminPage.css';

const AdminDashboardPage = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-dashboard">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Total Rooms</div>
              <div className="admin-stat-icon rooms">
                <FaBed />
              </div>
            </div>
            <div className="admin-stat-value">248</div>
            <div className="admin-stat-change positive">
              +12% <span className="admin-stat-period">from last month</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Total Users</div>
              <div className="admin-stat-icon users">
                <FaUsers />
              </div>
            </div>
            <div className="admin-stat-value">1,024</div>
            <div className="admin-stat-change positive">
              +18% <span className="admin-stat-period">from last month</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Bookings</div>
              <div className="admin-stat-icon bookings">
                <FaCalendarAlt />
              </div>
            </div>
            <div className="admin-stat-value">156</div>
            <div className="admin-stat-change positive">
              +5% <span className="admin-stat-period">from last month</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-title">Revenue</div>
              <div className="admin-stat-icon revenue">
                <FaChartBar />
              </div>
            </div>
            <div className="admin-stat-value">$32,450</div>
            <div className="admin-stat-change positive">
              +8% <span className="admin-stat-period">from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

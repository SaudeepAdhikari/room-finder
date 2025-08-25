import React from 'react';


import AdminSettingsPanel from './AdminSettingsPanel.js';
import AdminAuthDebug from './AdminAuthDebug.js';
import './AdminPage.css';

const AdminSettingsPage = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin Settings</h1>
      <div className="admin-page-content">
        <AdminSettingsPanel />
        <AdminAuthDebug />
      </div>
    </div>
  );
};

export default AdminSettingsPage;

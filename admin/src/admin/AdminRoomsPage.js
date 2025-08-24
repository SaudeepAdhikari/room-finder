import React from 'react';

import RoomManagement from './RoomManagement';
import './AdminPage.css';

const AdminRoomsPage = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Room Management</h1>
      <div className="admin-page-content">
        <RoomManagement />
      </div>
    </div>
  );
};

export default AdminRoomsPage;

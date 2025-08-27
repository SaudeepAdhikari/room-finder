import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { useAdminUser } from './AdminUserContext.js';
import './AdminHeader.css';

export default function AdminProfilePanel({ onClose }) {
  const { admin } = useAdminUser();
  const [loading, setLoading] = useState(false);

  // Minimal local copy of admin data for display
  const user = admin || {};

  return (
    <div className="admin-profile-panel">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="admin-profile-panel-avatar">
          {user.avatar ? <img src={user.avatar} alt={user.name || user.email || 'Admin'} /> : <FaUserCircle />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name || 'Admin'}</div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>{user.email || '-'}</div>
          {user.phone && <div style={{ color: '#374151', fontSize: 13, marginTop: 6 }}>Phone: {user.phone}</div>}
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="admin-profile-panel-edit" onClick={() => { onClose && onClose(); window.location.pathname = '/admin/profile'; }}>
          <FaEdit style={{ marginRight: 8 }} /> View / Edit Profile
        </button>
      </div>
    </div>
  );
}

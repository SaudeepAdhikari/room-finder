import React from 'react';
import AdminProfile from './AdminProfile.js';

export default function AdminProfilePage() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Profile</h2>
      <div style={{ maxWidth: 980 }}>
        <AdminProfile />
      </div>
    </div>
  );
}

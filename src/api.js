// API utility for Room Finder frontend
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchRooms(params = {}) {
  // Always filter for approved rooms unless explicitly overridden
  if (!('status' in params)) params.status = 'approved';
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/rooms?${query}`);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function addRoom(room) {
  console.log('addRoom - Sending request to:', `${API_BASE}/rooms`);
  console.log('addRoom - Room data:', room);

  const res = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(room),
  });

  console.log('addRoom - Response status:', res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('addRoom - Error response:', errorText);
    throw new Error('Failed to add room');
  }

  const data = await res.json();
  console.log('addRoom - Success response:', data);
  return data;
}

export async function fetchAllUsers() {
  const res = await fetch(`${API_BASE}/auth/users`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchAllRoomsAdmin() {
  const res = await fetch(`${API_BASE}/rooms/admin/all`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function updateRoomAdmin(id, data) {
  const res = await fetch(`${API_BASE}/rooms/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update room');
  return res.json();
}

export async function deleteRoomAdmin(id) {
  const res = await fetch(`${API_BASE}/rooms/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete room');
  return res.json();
}

export async function approveRoomAdmin(id) {
  const res = await fetch(`${API_BASE}/rooms/admin/${id}/approve`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to approve room');
  return res.json();
}

export async function rejectRoomAdmin(id) {
  const res = await fetch(`${API_BASE}/rooms/admin/${id}/reject`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to reject room');
  return res.json();
}

export async function getUserCountAdmin() {
  const res = await fetch(`${API_BASE}/auth/admin/usercount`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch user count');
  return res.json(); // { count, recent7, recent30 }
}

export async function getRoomCountAdmin() {
  const res = await fetch(`${API_BASE}/rooms/admin/roomcount`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch room count');
  return res.json(); // { total, pending, approved, rejected, recent7, recent30 }
}

export async function getRecentUsersAdmin() {
  const res = await fetch(`${API_BASE}/auth/admin/recentusers`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch recent users');
  return res.json();
}

export async function getRecentRoomsAdmin() {
  const res = await fetch(`${API_BASE}/rooms/admin/recentrooms`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch recent rooms');
  return res.json();
}

// New Admin Settings API functions
export async function getAdminSettings() {
  console.log('Fetching admin settings from:', `${API_BASE}/admin/settings`);
  const res = await fetch(`${API_BASE}/admin/settings`, { credentials: 'include' });
  console.log('Admin settings response status:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Admin settings error response:', errorText);
    throw new Error('Failed to fetch admin settings');
  }
  const data = await res.json();
  console.log('Admin settings data:', data);
  return data;
}

export async function updateAdminSettings(settings) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update admin settings');
  return res.json();
}

// Enhanced Admin User Management
export async function fetchAllUsersAdmin() {
  const res = await fetch(`${API_BASE}/admin/users`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function banUser(userId, banned) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/ban`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ banned }),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

// Enhanced Admin Room Management
export async function fetchAllRoomsAdminEnhanced() {
  const res = await fetch(`${API_BASE}/admin/rooms`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function approveRoomAdminEnhanced(roomId) {
  const res = await fetch(`${API_BASE}/admin/rooms/${roomId}/approve`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to approve room');
  return res.json();
}

export async function rejectRoomAdminEnhanced(roomId) {
  const res = await fetch(`${API_BASE}/admin/rooms/${roomId}/reject`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to reject room');
  return res.json();
}

export async function deleteRoomAdminEnhanced(roomId) {
  const res = await fetch(`${API_BASE}/admin/rooms/${roomId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete room');
  return res.json();
}

// Admin Dashboard Statistics
export async function getAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch admin statistics');
  return res.json();
}

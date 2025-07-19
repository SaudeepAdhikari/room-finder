// API utility for Room Finder frontend
import { API_BASE_URL, getApiUrl } from './config/apiConfig';

// Use the base URL for API requests
const API_BASE = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

// Global error handler for session expiration
const handleApiError = (response, errorMessage) => {
  if (response.status === 401) {
    // Session expired, redirect to login
    localStorage.removeItem('userSession');
    window.location.href = '/auth';
    throw new Error('Session expired. Please login again.');
  }
  throw new Error(errorMessage);
};

export async function fetchRooms(params = {}) {
  // Always filter for approved rooms unless explicitly overridden
  if (!('status' in params)) params.status = 'approved';
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/rooms?${query}`);
  if (!res.ok) handleApiError(res, 'Failed to fetch rooms');
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

export async function addRoomWithImages(roomData, imageFiles) {
  console.log('addRoomWithImages - Preparing data');

  // Create FormData object
  const formData = new FormData();

  // Add room data as a JSON string
  formData.append('roomData', JSON.stringify(roomData));

  // Add each image file to the FormData
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file, index) => {
      formData.append('images', file);
    });
  }

  console.log('addRoomWithImages - Sending request to:', `${API_BASE}/rooms/upload`);

  const res = await fetch(`${API_BASE}/rooms/upload`, {
    method: 'POST',
    credentials: 'include',
    // Do NOT set Content-Type header when using FormData
    body: formData,
  });

  console.log('addRoomWithImages - Response status:', res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('addRoomWithImages - Error response:', errorText);
    throw new Error('Failed to add room');
  }

  const data = await res.json();
  console.log('addRoomWithImages - Success response:', data);
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

// Fetch rooms listed by the current user
export async function fetchMyRooms() {
  const res = await fetch(`${API_BASE}/rooms/mine`, { credentials: 'include' });
  if (!res.ok) handleApiError(res, 'Failed to fetch your listings');
  return res.json();
}

// Booking API functions
export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const error = await res.json();
    handleApiError(res, error.error || 'Failed to create booking');
  }
  return res.json();
}

export async function fetchMyBookings() {
  const res = await fetch(`${API_BASE}/bookings/my-bookings`, { credentials: 'include' });
  if (!res.ok) handleApiError(res, 'Failed to fetch your bookings');
  return res.json();
}

export async function fetchBookingsForMyRooms() {
  console.log('Making API call to:', `${API_BASE}/bookings/for-my-rooms`);
  const res = await fetch(`${API_BASE}/bookings/for-my-rooms`, { credentials: 'include' });
  console.log('Response status:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error response:', errorText);
    handleApiError(res, 'Failed to fetch bookings for your rooms');
  }
  const data = await res.json();
  console.log('Bookings data:', data);
  return data;
}

export async function updateBookingStatus(bookingId, status) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const error = await res.json();
    handleApiError(res, error.error || 'Failed to update booking status');
  }
  return res.json();
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json();
    handleApiError(res, error.error || 'Failed to cancel booking');
  }
  return res.json();
}

export async function getBookingDetails(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, { credentials: 'include' });
  if (!res.ok) handleApiError(res, 'Failed to fetch booking details');
  return res.json();
}

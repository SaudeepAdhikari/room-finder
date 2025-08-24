import axios from 'axios';

import { API_BASE_URL, getApiUrl } from './config/apiConfig';
import { mockOccupancyData, mockBookingFrequencyData, mockTopRatedListings } from './utils/mockAnalyticsData';

// API utility for Room Finder frontend
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


  const res = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(room),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('addRoom - Error response:', errorText);
    throw new Error('Failed to add room');
  }

  const data = await res.json();

  return data;
}

export async function addRoomWithImages(roomData, imageFiles) {

  try {
    // Create FormData object
    const formData = new FormData();
  
    // Add room data as a JSON string
    formData.append('roomData', JSON.stringify(roomData));
  
    // Add each image file to the FormData
    if (imageFiles && imageFiles.length > 0) {

      imageFiles.forEach((file, index) => {

        formData.append('images', file);
      });
    } else {
      console.warn('addRoomWithImages - No image files provided');
    }

    const res = await fetch(`${API_BASE}/rooms/upload`, {
      method: 'POST',
      credentials: 'include',
      // Do NOT set Content-Type header when using FormData
      body: formData,
    });

    if (!res.ok) {
      let errorMessage = 'Failed to add room';
      try {
        const errorResponse = await res.json();
        errorMessage = errorResponse.error || errorMessage;
      } catch (jsonError) {
        // If response is not JSON, get text instead
        const errorText = await res.text();
        errorMessage = errorText || errorMessage;
      }
      console.error('addRoomWithImages - Error response:', errorMessage);
      throw new Error(errorMessage);
    }
  
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('addRoomWithImages - Exception:', error);
    throw error; // Re-throw for handling in the component
  }
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

  const res = await fetch(`${API_BASE}/admin/settings`, { credentials: 'include' });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Admin settings error response:', errorText);
    throw new Error('Failed to fetch admin settings');
  }
  const data = await res.json();

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
  try {

    const response = await axios.get(`${API_BASE}/admin/users`, { 
      withCredentials: true 
    });

    return response.data;
  } catch (error) {
    console.error('Error in fetchAllUsersAdmin:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
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

// Admin: Add Room
export async function addRoomAdmin(room) {
  const res = await fetch(`${API_BASE}/admin/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(room),
  });
  if (!res.ok) throw new Error('Failed to add room');
  return res.json();
}
// Admin: Update Room
export async function updateRoomAdmin(id, room) {
  const res = await fetch(`${API_BASE}/admin/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(room),
  });
  if (!res.ok) throw new Error('Failed to update room');
  return res.json();
}
// Admin: Delete Room
export async function deleteRoomAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/rooms/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete room');
  return res.json();
}

// Admin: Ban/Unban User
export async function banUserAdmin(id, banned) {
  const res = await fetch(`${API_BASE}/admin/users/${id}/ban`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ banned }),
  });
  if (!res.ok) throw new Error('Failed to update user ban status');
  return res.json();
}
// Admin: Delete User
export async function deleteUserAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

// Admin Dashboard Statistics
export async function getAdminStats(timeRange = 'month') {
  const res = await fetch(`${API_BASE}/admin/stats?timeRange=${timeRange}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch admin statistics');
  return res.json();
}

// Analytics specific API functions
export async function getOccupancyData(timeRange = 'month') {
  try {
    // Try the actual API endpoint first
    const res = await fetch(`${API_BASE}/admin/analytics/occupancy?timeRange=${timeRange}`, { credentials: 'include' });
    if (!res.ok) throw new Error('API endpoint not ready');
    return res.json();
  } catch (error) {

    // Fall back to mock data if API not ready
    return Promise.resolve(mockOccupancyData[timeRange]);
  }
}

export async function getBookingFrequency(timeRange = 'month') {
  try {
    // Try the actual API endpoint first
    const res = await fetch(`${API_BASE}/admin/analytics/booking-frequency?timeRange=${timeRange}`, { credentials: 'include' });
    if (!res.ok) throw new Error('API endpoint not ready');
    return res.json();
  } catch (error) {

    // Fall back to mock data if API not ready
    return Promise.resolve(mockBookingFrequencyData[timeRange]);
  }
}

export async function getTopRatedListings(limit = 10) {
  try {
    // Try the actual API endpoint first
    const res = await fetch(`${API_BASE}/admin/analytics/top-rated?limit=${limit}`, { credentials: 'include' });
    if (!res.ok) throw new Error('API endpoint not ready');
    return res.json();
  } catch (error) {

    // Fall back to mock data if API not ready
    return Promise.resolve(mockTopRatedListings.slice(0, limit));
  }
}

// Admin Search Autocomplete
export async function searchAdminAutocomplete(query, type = 'all', limit = 5) {
  const params = new URLSearchParams({
    query,
    type,
    limit
  }).toString();
  
  const res = await fetch(`${API_BASE}/search/autocomplete?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch search results');
  return res.json();
}

// Admin Bookings Count
export async function getAdminBookingsCount() {
  const res = await fetch(`${API_BASE}/admin/bookings/count`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch bookings count');
  return res.json();
}

// Admin: Fetch all bookings
export async function fetchAllBookingsAdmin() {
  const res = await fetch(`${API_BASE}/admin/bookings`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}
// Admin: Update booking status
export async function updateBookingStatusAdmin(id, status) {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update booking status');
  return res.json();
}

// Admin: Fetch all reviews
export async function fetchAllReviewsAdmin() {
  const res = await fetch(`${API_BASE}/admin/reviews`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}
// Admin: Approve review
export async function approveReviewAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/reviews/${id}/approve`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to approve review');
  return res.json();
}
// Admin: Delete review
export async function deleteReviewAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete review');
  return res.json();
}
// Admin: Report review
export async function reportReviewAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/reviews/${id}/report`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to report review');
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

  const res = await fetch(`${API_BASE}/bookings/for-my-rooms`, { credentials: 'include' });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error response:', errorText);
    handleApiError(res, 'Failed to fetch bookings for your rooms');
  }
  const data = await res.json();

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

// Admin: Fetch current admin profile
export async function fetchAdminProfile() {
  const res = await fetch(`/api/admin/me`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch admin profile');
  return res.json();
}
// Admin: Update current admin profile
export async function updateAdminProfile(data) {
  const res = await fetch(`/api/admin/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update admin profile');
  return res.json();
}

// Notification API Functions
export async function getAdminNotifications() {
  const res = await fetch(`${API_BASE}/admin/notifications`, {
    credentials: 'include',
  });
  if (!res.ok) handleApiError(res, 'Failed to fetch notifications');
  return res.json();
}

export async function markNotificationAsRead(notificationId) {
  const res = await fetch(`${API_BASE}/admin/notifications/${notificationId}/read`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) handleApiError(res, 'Failed to mark notification as read');
  return res.json();
}

export async function markAllNotificationsAsRead() {
  const res = await fetch(`${API_BASE}/admin/notifications/read-all`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) handleApiError(res, 'Failed to mark all notifications as read');
  return res.json();
}

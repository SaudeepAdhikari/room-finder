import axios from 'axios';

// Local API config (inlined from client to avoid cross-src imports)
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';
export const getApiUrl = (path) => {
	const cleanPath = path.startsWith('/') ? path.substring(1) : path;
	return `${API_BASE_URL}/${cleanPath}`;
};

// Inlined mock analytics data (copied from client/utils/mockAnalyticsData.js)
export const mockOccupancyData = {
	week: [
		{ day: 'Mon', occupancyRate: 72, availableRooms: 45 },
		{ day: 'Tue', occupancyRate: 68, availableRooms: 48 },
		{ day: 'Wed', occupancyRate: 75, availableRooms: 44 },
		{ day: 'Thu', occupancyRate: 80, availableRooms: 42 },
		{ day: 'Fri', occupancyRate: 90, availableRooms: 40 },
		{ day: 'Sat', occupancyRate: 95, availableRooms: 38 },
		{ day: 'Sun', occupancyRate: 88, availableRooms: 41 }
	],
	month: [
		{ month: 'Week 1', occupancyRate: 65, availableRooms: 120 },
		{ month: 'Week 2', occupancyRate: 70, availableRooms: 122 },
		{ month: 'Week 3', occupancyRate: 75, availableRooms: 125 },
		{ month: 'Week 4', occupancyRate: 82, availableRooms: 118 }
	],
	year: [
		{ month: 'Jan', occupancyRate: 68, availableRooms: 120 },
		{ month: 'Feb', occupancyRate: 72, availableRooms: 118 },
		{ month: 'Mar', occupancyRate: 75, availableRooms: 125 },
		{ month: 'Apr', occupancyRate: 80, availableRooms: 130 },
		{ month: 'May', occupancyRate: 85, availableRooms: 132 },
		{ month: 'Jun', occupancyRate: 90, availableRooms: 135 },
		{ month: 'Jul', occupancyRate: 95, availableRooms: 140 },
		{ month: 'Aug', occupancyRate: 92, availableRooms: 138 },
		{ month: 'Sep', occupancyRate: 88, availableRooms: 136 },
		{ month: 'Oct', occupancyRate: 82, availableRooms: 132 },
		{ month: 'Nov', occupancyRate: 78, availableRooms: 128 },
		{ month: 'Dec', occupancyRate: 85, availableRooms: 124 }
	]
};

export const mockBookingFrequencyData = {
	week: [
		{ day: 'Mon', bookings: 15 },
		{ day: 'Tue', bookings: 12 },
		{ day: 'Wed', bookings: 18 },
		{ day: 'Thu', bookings: 20 },
		{ day: 'Fri', bookings: 25 },
		{ day: 'Sat', bookings: 30 },
		{ day: 'Sun', bookings: 22 }
	],
	month: [
		{ day: 'Week 1', bookings: 85 },
		{ day: 'Week 2', bookings: 92 },
		{ day: 'Week 3', bookings: 110 },
		{ day: 'Week 4', bookings: 125 }
	],
	year: [
		{ day: 'Jan', bookings: 210 },
		{ day: 'Feb', bookings: 240 },
		{ day: 'Mar', bookings: 280 },
		{ day: 'Apr', bookings: 300 },
		{ day: 'May', bookings: 320 },
		{ day: 'Jun', bookings: 350 },
		{ day: 'Jul', bookings: 380 },
		{ day: 'Aug', bookings: 400 },
		{ day: 'Sep', bookings: 360 },
		{ day: 'Oct', bookings: 330 },
		{ day: 'Nov', bookings: 280 },
		{ day: 'Dec', bookings: 320 }
	]
};

export const mockTopRatedListings = [
	{ id: 1, title: 'Luxury Apartment in Downtown', rating: 4.9, reviewCount: 42, location: 'Downtown', price: 1200, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 2, title: 'Cozy Studio near University', rating: 4.8, reviewCount: 38, location: 'University Area', price: 850, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 3, title: 'Modern Loft with City View', rating: 4.7, reviewCount: 56, location: 'West End', price: 1100, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 4, title: 'Spacious 2 Bedroom with Garden', rating: 4.7, reviewCount: 31, location: 'Suburbs', price: 950, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 5, title: 'Charming Victorian House', rating: 4.6, reviewCount: 27, location: 'Historic District', price: 1300, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 6, title: 'Riverside Apartment with Balcony', rating: 4.6, reviewCount: 24, location: 'Riverfront', price: 1150, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 7, title: 'Cozy Cottage in the Woods', rating: 4.5, reviewCount: 19, location: 'Outskirts', price: 800, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 8, title: 'Urban Studio with Workspace', rating: 4.5, reviewCount: 22, location: 'Business District', price: 920, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 9, title: 'Lakeside Cabin with Dock', rating: 4.4, reviewCount: 18, location: 'Lake Area', price: 1050, imageUrl: 'https://via.placeholder.com/100' },
	{ id: 10, title: 'Renovated Basement Apartment', rating: 4.3, reviewCount: 14, location: 'Residential Area', price: 750, imageUrl: 'https://via.placeholder.com/100' }
];

// API utility for Room Finder frontend
// Use the base URL for API requests
const API_BASE = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

// Global error handler for session expiration
const handleApiError = (response, errorMessage) => {
	if (response.status === 401) {
		// Session expired, redirect to login
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
	if (!res.ok) throw new Error('Failed to update admin user ban status');
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

// Admin Notifications
export async function getAdminNotifications() {
	const res = await fetch(`${API_BASE}/admin/notifications`, { credentials: 'include' });
	if (!res.ok) throw new Error('Failed to fetch notifications');
	return res.json();
}

export async function markNotificationAsRead(id) {
	const res = await fetch(`${API_BASE}/admin/notifications/${id}/read`, {
		method: 'PUT',
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Failed to mark notification as read');
	return res.json();
}

export async function markAllNotificationsAsRead() {
	const res = await fetch(`${API_BASE}/admin/notifications/read-all`, {
		method: 'PUT',
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Failed to mark all notifications as read');
	return res.json();
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

// Admin profile endpoints
export async function fetchAdminProfile() {
	const res = await fetch(`${API_BASE}/admin/profile`, { credentials: 'include' });
	if (!res.ok) throw new Error('Failed to fetch admin profile');
	return res.json();
}

export async function updateAdminProfile(profile) {
	const res = await fetch(`${API_BASE}/admin/profile`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(profile)
	});
	if (!res.ok) throw new Error('Failed to update admin profile');
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
		method: 'POST',
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Failed to report review');
	return res.json();
}

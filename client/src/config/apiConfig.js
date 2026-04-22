// Central configuration for API endpoints
// On Vercel, if REACT_APP_API_URL is not set, it defaults to relative paths (e.g., /api/rooms)
export const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://room-finder-cmbe.onrender.com' : 'http://localhost:5000');

// Function to generate API URLs
export const getApiUrl = (path) => {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

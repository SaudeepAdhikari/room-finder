// Central configuration for API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Function to generate API URLs
export const getApiUrl = (path) => {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

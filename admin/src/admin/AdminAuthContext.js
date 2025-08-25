import React, { createContext, useState, useContext, useEffect } from 'react';

import axios from 'axios';


// Create the context
const AdminAuthContext = createContext();

// Create a custom hook for using this context
export const useAdminAuth = () => useContext(AdminAuthContext);

// Create the provider component
export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/admin/me`, { withCredentials: true });
        setAdminUser(response.data);
        setError(null);
      } catch (err) {
        setAdminUser(null);
        // Differentiate network/proxy errors from auth failures
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || err.response?.status === 502 || err.response?.status === 500) {
          setError('Unable to reach backend. Please ensure the backend server is running on http://localhost:5000');
        } else {
          setError('Not authenticated');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_BASE]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/admin/login`, 
        { email, password },
        { withCredentials: true }
      );
      
      setAdminUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/admin/logout`, {}, { withCredentials: true });
      setAdminUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    adminUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!adminUser
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;

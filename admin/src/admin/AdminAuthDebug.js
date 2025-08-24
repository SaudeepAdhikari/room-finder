import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';

const AdminAuthDebug = () => {
  const { adminUser, loading, error, isAuthenticated } = useAdminAuth();
  const [sessionInfo, setSessionInfo] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  
  const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';

  const checkSession = async () => {
    setSessionLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/admin/debug-session`, { 
        withCredentials: true 
      });
      setSessionInfo(response.data);
      setSessionError(null);
    } catch (err) {
      console.error('Error checking session:', err);
      setSessionError(err.message || 'Failed to check session');
      setSessionInfo(null);
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div className="admin-debug">
      <h2>Admin Auth Debugging</h2>
      
      <div className="debug-section">
        <h3>Authentication Context</h3>
        {loading ? (
          <p>Loading auth context...</p>
        ) : (
          <div className="debug-info">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Admin User:</strong></p>
            <pre>{adminUser ? JSON.stringify(adminUser, null, 2) : 'Not logged in'}</pre>
          </div>
        )}
      </div>

      <div className="debug-section">
        <h3>Session Information</h3>
        <button 
          onClick={checkSession}
          disabled={sessionLoading}
          className="debug-button"
        >
          {sessionLoading ? 'Checking...' : 'Check Session'}
        </button>
        
        {sessionLoading ? (
          <p>Loading session info...</p>
        ) : sessionError ? (
          <p className="error-text">Error: {sessionError}</p>
        ) : (
          <div className="debug-info">
            <pre>{sessionInfo ? JSON.stringify(sessionInfo, null, 2) : 'No session data'}</pre>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .admin-debug {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .debug-section {
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .debug-info {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          overflow: auto;
        }
        
        pre {
          margin: 0;
          white-space: pre-wrap;
        }
        
        .debug-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        
        .debug-button:disabled {
          background: #cccccc;
        }
        
        .error-text {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default AdminAuthDebug;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminLogin.css';

import { useAdminAuth } from './AdminAuthContext.js';
import { useAdminUser } from './AdminUserContext.js';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAdminAuth();
  const { login: setAdminUser } = useAdminUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use shared auth context to login (this hits /api/admin/login)
      const user = await authLogin(email, password);

  // Persist admin user in AdminUserContext so layout picks it up
  if (user) {
        setAdminUser(user);
        navigate('/admin');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || err.response?.status === 502 || err.response?.status === 500) {
        setError('Unable to reach backend. Ensure backend is running at http://localhost:5000');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="admin-login-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

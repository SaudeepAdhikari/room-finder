import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import './Login.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Logo() {
    return (
        <div className="login-logo">
            <img src="/logo192.png" alt="SajiloStay Logo" />
        </div>
    );
}

export default function AuthPage({ onNavigate }) {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login, register } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
                setSuccess('Login successful!');
            } else {
                await register(email, password, phone);
                setSuccess('Registration successful!');
            }
            setEmail('');
            setPassword('');
            setPhone('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            <div className="login-card">
                <Logo />
                <h2 className="login-title">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
                    <div className="login-input-group">
                        <label htmlFor="email">Email</label>
                        <div className="login-input-wrapper">
                            <FaEnvelope className="login-input-icon" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    {mode === 'register' && (
                        <div className="login-input-group">
                            <label htmlFor="phone">Phone</label>
                            <div className="login-input-wrapper">
                                <FaUser className="login-input-icon" />
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                    autoComplete="tel"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>
                    )}
                    <div className="login-input-group">
                        <label htmlFor="password">Password</label>
                        <div className="login-input-wrapper">
                            <FaLock className="login-input-icon" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                            />
                        </div>
                    </div>
                    {error && <div className="login-error">{error}</div>}
                    {success && <div className="login-success">{success}</div>}
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
                    </button>
                </form>
                <div className="login-links">
                    {mode === 'login' ? (
                        <>
                            <span>Don&apos;t have an account?</span>
                            <button className="login-link-btn" onClick={() => setMode('register')}>Register</button>
                        </>
                    ) : (
                        <>
                            <span>Already have an account?</span>
                            <button className="login-link-btn" onClick={() => setMode('login')}>Login</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 
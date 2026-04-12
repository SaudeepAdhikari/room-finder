import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCamera, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';


import { useUser } from '../context/UserContext';
import './Login.css';

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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login, register } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
        if (location.state?.error) {
            setError(location.state.error);
            window.history.replaceState({}, document.title);
        }
    }, [user, navigate, location.state]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (mode === 'register') {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
                setSuccess('Login successful!');
            } else {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                formData.append('phone', phone);
                formData.append('firstName', firstName);
                formData.append('lastName', lastName);
                if (avatar) {
                    formData.append('avatar', avatar);
                }
                
                await register(formData);
                setSuccess('Registration successful!');
            }
            // Reset form
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPhone('');
            setFirstName('');
            setLastName('');
            setAvatar(null);
            setAvatarPreview(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            <div className={`login-card ${mode === 'register' ? 'register-mode' : ''}`}>
                <Logo />
                <h2 className="login-title">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
                
                <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
                    {mode === 'register' && (
                        <>
                            <div className="avatar-upload-container">
                                <div className="avatar-preview-wrapper" onClick={() => fileInputRef.current.click()}>
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="avatar-preview-img" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <FaCamera className="camera-icon" />
                                            <span>Upload Avatar</span>
                                        </div>
                                    )}
                                </div>
                                {avatarPreview && (
                                    <button type="button" className="remove-avatar-btn" onClick={removeAvatar}>
                                        <FaTimes />
                                    </button>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleAvatarChange} 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                />
                            </div>

                            <div className="login-input-row">
                                <div className="login-input-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <div className="login-input-wrapper">
                                        <FaUser className="login-input-icon" />
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            required
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div className="login-input-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <div className="login-input-wrapper">
                                        <FaUser className="login-input-icon" />
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            required
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="login-input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="login-input-wrapper">
                            <FaEnvelope className="login-input-icon" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {mode === 'register' && (
                        <div className="login-input-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="login-input-wrapper">
                                <FaPhone className="login-input-icon" />
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                    autoComplete="tel"
                                    placeholder="+977 98XXXXXXXX"
                                />
                            </div>
                        </div>
                    )}

                    <div className={mode === 'register' ? 'login-input-row' : ''}>
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
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div className="login-input-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="login-input-wrapper">
                                    <FaLock className="login-input-icon" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {error && <div className="login-error animation-shake">{error}</div>}
                    {success && <div className="login-success animation-fade-in">{success}</div>}
                    
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="login-links">
                    {mode === 'login' ? (
                        <>
                            <span>New here?</span>
                            <button className="login-link-btn" onClick={() => setMode('register')}>Create Account</button>
                        </>
                    ) : (
                        <>
                            <span>Already joined?</span>
                            <button className="login-link-btn" onClick={() => setMode('login')}>Sign In</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
 
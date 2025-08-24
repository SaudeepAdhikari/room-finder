import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';


import { useUser } from '../context/UserContext';
import '../styles/pages/home.css';
import Modal from './ui/Modal';
import AdvancedSearchFilter from './AdvancedSearchFilter';

export default function UniversalNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useUser();
    const dropdownRef = useRef();
    const [searchOpen, setSearchOpen] = useState(false);

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return;
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
        navigate('/');
    };

    return (
        <header className="wc-navbar">
            <div className="wc-navbar-inner">
                <Link to="/" className="wc-navbar-logo">SajiloStay <span className="wc-navbar-logo-tag">Nepal</span></Link>
                <nav className={`wc-navbar-links ${mobileOpen ? 'open' : ''}`}>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
                    <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
                    <Link to="/post-room" className={location.pathname === '/post-room' ? 'active' : ''}>List Your Room</Link>
                </nav>
                {/* Search Button */}
                <button
                    className="wc-navbar-search-btn"
                    aria-label="Search rooms"
                    onClick={() => setSearchOpen(true)}
                >
                    <FaSearch style={{ marginRight: 8, fontSize: '1.1em' }} />
                    Search Rooms
                </button>
                {/* Auth/Profile Button */}
                <div className="wc-navbar-auth">
                    {!user ? (
                        <button
                            className="wc-navbar-login-btn"
                            onClick={() => navigate('/auth')}
                            aria-label="Login"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="wc-navbar-profile-wrapper" ref={dropdownRef}>
                            <button
                                className="wc-navbar-profile-btn"
                                onClick={() => setDropdownOpen((o) => !o)}
                                aria-label="User menu"
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                                tabIndex={0}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="wc-navbar-profile-pic" />
                                ) : (
                                    <span className="wc-navbar-profile-initial">
                                        {user.firstName?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </button>
                            {dropdownOpen && (
                                <div className="wc-navbar-profile-dropdown" role="menu">
                                    <div className="wc-navbar-profile-info">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="wc-navbar-profile-pic-lg" />
                                        ) : (
                                            <span className="wc-navbar-profile-initial-lg">
                                                {user.firstName?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        )}
                                        <div className="wc-navbar-profile-details">
                                            <div className="wc-navbar-profile-name">{user.name}</div>
                                            <div className="wc-navbar-profile-email">{user.email}</div>
                                        </div>
                                    </div>
                                    <button className="wc-navbar-profile-dropdown-link" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>Profile</button>
                                    <button className="wc-navbar-profile-dropdown-link" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button className="wc-navbar-hamburger" onClick={() => setMobileOpen(m => !m)} aria-label="Menu">
                    <span className="wc-navbar-hamburger-icon">☰</span>
                </button>
                {mobileOpen && <div className="wc-navbar-backdrop" onClick={() => setMobileOpen(false)} />}
            </div>
            {/* Search Panel Below Navbar */}
            {searchOpen && (
                <div className="wc-navbar-search-panel" style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.98)',
                    boxShadow: '0 8px 32px #7c3aed22',
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    padding: '2.5rem 0 2rem 0',
                    position: 'relative',
                    zIndex: 1200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'fadeInDown 0.25s cubic-bezier(0.4,0,0.2,1)'
                }}>
                    <button
                        onClick={() => setSearchOpen(false)}
                        aria-label="Close search panel"
                        style={{
                            position: 'absolute',
                            top: 18,
                            right: 36,
                            background: 'none',
                            border: 'none',
                            fontSize: 28,
                            color: '#7c3aed',
                            cursor: 'pointer',
                            zIndex: 1300
                        }}
                    >
                        <FaTimes />
                    </button>
                    <h2 style={{ fontWeight: 800, fontSize: '2rem', color: '#7c3aed', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Find Your Perfect Room</h2>
                    <div style={{ width: '100%', maxWidth: 900 }}>
                        <AdvancedSearchFilter onSearch={() => setSearchOpen(false)} variant="horizontal" />
                    </div>
                </div>
            )}
        </header>
    );
} 
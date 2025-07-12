import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import ProfileModal from './ProfileModal';

const userShimmerKeyframes = `
@keyframes userShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, setUser, loading } = useUser();
  const { showToast } = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const profileBtnRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', key: 'home' },
    { label: 'Search', key: 'search' },
    { label: 'Post Room', key: 'post' }
  ];

  // Removed isAdmin logic

  const handleNavClick = (page) => {
    let path = '/';
    if (page === 'search') path = '/search';
    else if (page === 'post') path = '/post';
    else if (page === 'auth') path = '/auth';
    else path = '/';
    navigate(path);
    setMobileNavOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully.', 'success');
    navigate('/');
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (profileBtnRef.current && !profileBtnRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  // Handler to update user info
  const handleProfileSave = async (updates) => {
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(errorData.error || 'Update failed');
    }
    const updatedUser = await res.json();
    setUser(updatedUser);
  };

  // Inject shimmer keyframes for user header
  React.useEffect(() => {
    if (!document.getElementById('user-header-shimmer')) {
      const style = document.createElement('style');
      style.id = 'user-header-shimmer';
      style.innerHTML = userShimmerKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(120, 63, 255, 0.68)',
      backgroundImage: 'linear-gradient(90deg, rgba(120,63,255,0.68) 0%, rgba(0,212,255,0.55) 100%)',
      borderBottom: '2px solid rgba(168,85,247,0.13)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 4px 32px 0 rgba(120,63,255,0.10)',
      overflow: 'visible',
    }}>
      {/* Subtle dark overlay for clarity */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        background: 'rgba(0,0,0,0.10)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      {/* Animated gradient border/glow */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: -4, height: 'calc(100% + 8px)',
        zIndex: 0,
        borderRadius: '0 0 32px 32px',
        pointerEvents: 'none',
        background: 'linear-gradient(90deg, #a855f7, #6366f1, #38bdf8, #ec4899, #a855f7)',
        backgroundSize: '300% 100%',
        filter: 'blur(8px) brightness(1.2)',
        opacity: 0.18,
        animation: 'userShimmer 4s linear infinite',
      }} />
      <div style={{
        maxWidth: 'var(--container-max-width)',
        margin: '0 auto',
        padding: '0 var(--space-6)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            background: 'none',
            WebkitTextFillColor: 'unset',
            transition: 'color 0.3s',
          }}
          onClick={() => handleNavClick('home')}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.7rem',
            boxShadow: '0 2px 12px rgba(168,85,247,0.10)',
            border: '2.5px solid #fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>
            S
          </div>
          <span style={{
            fontWeight: 800,
            fontSize: '1.45rem',
            letterSpacing: '-0.025em',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            background: 'none',
            WebkitTextFillColor: 'unset',
            transition: 'color 0.3s',
          }}>
            SajiloStay
          </span>
        </motion.div>
        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)',
        }}>
          {navItems.map((item) => {
            const path = item.key === 'home' ? '/' : `/${item.key}`;
            const isActive = location.pathname === path;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                style={{
                  background: isActive ? 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)' : 'none',
                  color: '#fff',
                  fontSize: '1.08rem',
                  fontWeight: isActive ? 800 : 500,
                  padding: '10px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 12px rgba(168,85,247,0.10)' : 'none',
                  position: 'relative',
                  transition: 'all 0.22s cubic-bezier(.4,1.3,.6,1)',
                  outline: isActive ? '2px solid #a855f7' : 'none',
                  textShadow: '0 2px 8px rgba(0,0,0,0.18)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 18,
                      right: 18,
                      height: '3px',
                      background: 'linear-gradient(90deg, #a855f7, #38bdf8)',
                      borderRadius: '8px',
                      boxShadow: '0 1px 4px #a855f7',
                      animation: 'userShimmer 4s linear infinite',
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          {/* Admin link, only for admins */}
          {/* Removed admin button and logic */}
        </nav>
        {/* Right Side Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)',
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
              </svg>
            )}
          </motion.button>

          {/* User Auth Controls */}
          {!loading && user ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                ref={profileBtnRef}
                onClick={() => setProfileDropdownOpen((open) => !open)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: 'var(--font-size-base)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius)',
                  transition: 'background var(--transition)',
                  gap: 8,
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8, border: '2px solid var(--primary)' }}
                  />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ marginRight: 8 }}>
                    <circle cx="16" cy="16" r="16" fill="#e0e7ef" />
                    <circle cx="16" cy="13" r="6" fill="#b6c2d1" />
                    <ellipse cx="16" cy="24" rx="8" ry="5" fill="#b6c2d1" />
                  </svg>
                )}
                Profile
                <svg width="16" height="16" style={{ marginLeft: 4 }} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6l4 4 4-4" /></svg>
              </button>
              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  background: 'var(--surface)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-md)',
                  minWidth: 160,
                  zIndex: 1000,
                }}>
                  <button
                    onMouseDown={e => {
                      e.preventDefault();
                      setProfileDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      padding: 'var(--space-3) var(--space-4)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-base)',
                      borderBottom: '1px solid var(--gray-100)',
                    }}
                  >
                    Profile Info
                  </button>
                  <button
                    onMouseDown={e => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      padding: 'var(--space-3) var(--space-4)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-base)',
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
              {/* Profile Modal (to be implemented) */}
              {profileModalOpen && (
                <ProfileModal user={user} onClose={() => setProfileModalOpen(false)} onSave={handleProfileSave} />
              )}
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick('auth')}
                style={{
                  background: '#fff',
                  color: '#a855f7',
                  border: '2px solid #a855f7',
                  borderRadius: 14,
                  padding: '10px 26px',
                  fontSize: 17,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  boxShadow: '0 2px 12px #a855f7cc',
                  marginRight: 10,
                  textShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  letterSpacing: 0.2,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#a855f7';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = '0 4px 16px #a855f7cc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#a855f7';
                  e.currentTarget.style.boxShadow = '0 2px 12px #a855f7cc';
                }}
              >
                Login
              </motion.button>
            </>
          )}

          {/* Post Room Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('post')}
            style={{
              background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '10px 26px',
              fontSize: 17,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.18s',
              boxShadow: '0 2px 12px #38bdf8cc',
              textShadow: '0 2px 8px rgba(0,0,0,0.10)',
              letterSpacing: 0.2,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)';
              e.currentTarget.style.boxShadow = '0 4px 16px #38bdf8cc';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)';
              e.currentTarget.style.boxShadow = '0 2px 12px #38bdf8cc';
            }}
          >
            Post Room
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            style={{
              display: 'none',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)',
              background: 'var(--surface)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'var(--surface)',
              borderTop: '1px solid var(--gray-200)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              padding: 'var(--space-4) var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}>
              {navItems.map((item) => {
                const path = item.key === 'home' ? '/' : `/${item.key}`;
                const isActive = location.pathname === path;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: isActive ? 600 : 500,
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;

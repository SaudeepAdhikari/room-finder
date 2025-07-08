import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import ProfileModal from './ProfileModal';

function Header({ onNavigate, activePage }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, setUser, loading } = useUser();
  const { showToast } = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const profileBtnRef = useRef(null);

  const navItems = [
    { label: 'Home', key: 'home' },
    { label: 'Search', key: 'search' },
    { label: 'Post Room', key: 'post' }
  ];

  const isAdmin = user && user.isAdmin;

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileNavOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully.', 'success');
    onNavigate('home');
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

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--gray-200)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <div style={{
        maxWidth: 'var(--container-max-width)',
        margin: '0 auto',
        padding: '0 var(--space-6)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
          }}
          onClick={() => handleNavClick('home')}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-inverse)',
            fontWeight: 700,
            fontSize: 'var(--font-size-lg)',
          }}>
            S
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: 'var(--font-size-xl)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
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
          {activePage !== 'admindashboard' && navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              style={{
                background: 'none',
                border: 'none',
                color: activePage === item.key ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: 'var(--font-size-base)',
                fontWeight: activePage === item.key ? 600 : 500,
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = activePage === item.key ? 'var(--primary)' : 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {item.label}
              {activePage === item.key && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 'var(--space-4)',
                    right: 'var(--space-4)',
                    height: '2px',
                    background: 'var(--primary)',
                    borderRadius: 'var(--radius-full)',
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
          {/* Admin link, only for admins */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admindashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: activePage === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: 'var(--font-size-base)',
                fontWeight: activePage === 'admin' ? 700 : 500,
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = activePage === 'admin' ? 'var(--primary)' : 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Admin
              {activePage === 'admin' && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 'var(--space-4)',
                    right: 'var(--space-4)',
                    height: '2px',
                    background: 'var(--primary)',
                    borderRadius: 'var(--radius-full)',
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )}
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick('auth')}
                style={{
                  background: 'none',
                  color: 'var(--primary)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--space-3) var(--space-6)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  boxShadow: 'none',
                  marginRight: 8,
                }}
              >
                Login
              </motion.button>
            </>
          )}

          {/* Post Room Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('post')}
            style={{
              background: 'var(--primary-gradient)',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary-gradient-hover)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--primary-gradient)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
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
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activePage === item.key ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: activePage === item.key ? 600 : 500,
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
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;

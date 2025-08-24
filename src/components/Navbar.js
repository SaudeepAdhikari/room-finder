import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';



const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Search', path: '/search' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar-root">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label="Home">
          <span className="navbar-logo-icon">🏠</span>
          <span className="navbar-logo-text">SajiloStay</span>
        </Link>
        <div className="navbar-links">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link${location.pathname === link.path ? ' active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button
          className="navbar-hamburger"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <span className="navbar-hamburger-icon">☰</span>
        </button>
      </div>
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <button
            className="navbar-mobile-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
          <div className="navbar-mobile-links">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-mobile-link${location.pathname === link.path ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 
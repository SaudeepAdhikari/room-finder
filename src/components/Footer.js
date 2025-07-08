import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

function Footer({ onNavigate }) {
  const { user } = useUser();
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      borderTop: 'none',
      marginTop: 'auto',
      width: '100%',
      boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)',
      borderRadius: '24px 24px 0 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        maxWidth: 'var(--container-max-width)',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-6) var(--space-4) var(--space-6)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'var(--space-8)',
      }}>
        {/* Brand & Tagline */}
        <div style={{ minWidth: 220, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius)', background: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: 'var(--font-size-lg)'
            }}>S</div>
            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-xl)', color: '#fff', letterSpacing: '-0.02em' }}>SajiloStay</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--font-size-base)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
            Find your perfect room in Nepal. Trusted by thousands of students and professionals.
          </p>
        </div>
        {/* Quick Links */}
        <div style={{ minWidth: 180, flex: 1 }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: '#fff', marginBottom: 'var(--space-4)' }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {[
              { label: 'Search Rooms', key: 'search' },
              { label: 'Post a Room', key: 'post' },
              { label: 'Popular Cities', key: 'home' },
              { label: 'How it Works', key: 'home' },
            ].map((link, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ x: 4 }}
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  fontSize: 'var(--font-size-base)',
                  transition: 'color var(--transition)',
                  cursor: 'pointer',
                }}
                onClick={e => {
                  e.preventDefault();
                  if (onNavigate) onNavigate(link.key);
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ffd700'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              >
                {link.label}
              </motion.a>
            ))}
            {/* Admin Login button styled like other quick links */}
            <motion.a
              href="#"
              whileHover={{ x: 4 }}
              style={{
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-base)',
                transition: 'color var(--transition)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
              onClick={e => {
                e.preventDefault();
                if (onNavigate) {
                  if (user && user.isAdmin) {
                    onNavigate('admindashboard');
                  } else {
                    onNavigate('adminlogin');
                  }
                }
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffd700'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
            >
              Admin Login
            </motion.a>
          </div>
        </div>
        {/* Contact Info */}
        <div style={{ minWidth: 200, flex: 1 }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: '#fff', marginBottom: 'var(--space-4)' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.85)', fontSize: 'var(--font-size-base)' }}>
              <span>📍</span>
              <span>Kathmandu, Nepal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.85)', fontSize: 'var(--font-size-base)' }}>
              <span>📧</span>
              <span>hello@sajilostay.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.85)', fontSize: 'var(--font-size-base)' }}>
              <span>📱</span>
              <span>+977 1-4XXXXXXX</span>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright & Legal - always at the very end of the footer */}
      <div style={{
        borderTop: '1.5px solid #1e293b',
        marginTop: 'var(--space-4)',
        paddingTop: 'var(--space-3)',
        textAlign: 'center',
        color: '#e0e7ef',
        fontSize: 'var(--font-size-sm)',
        letterSpacing: '0.01em',
        background: '#1e293b',
        fontWeight: 500,
      }}>
        © {new Date().getFullYear()} SajiloStay. All rights reserved. | Designed & Developed by Saudeep Adhikari | <a href="#" style={{ color: '#ffd700', textDecoration: 'underline', marginLeft: 4 }}>Privacy Policy</a> | <a href="#" style={{ color: '#ffd700', textDecoration: 'underline', marginLeft: 4 }}>Terms of Service</a>
      </div>
    </footer>
  );
}

export default Footer;

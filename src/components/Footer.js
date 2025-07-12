import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

function Footer({ onNavigate }) {
  const { user } = useUser();
  return (
    <footer style={{
      background: 'rgba(63,0,153,0.60)',
      backgroundImage: 'linear-gradient(135deg, rgba(63,0,153,0.60) 0%, rgba(0,212,255,0.45) 100%)',
      borderTop: 'none',
      marginTop: 'auto',
      width: '100%',
      boxShadow: '0 8px 32px 0 rgba(120,63,255,0.13)',
      borderRadius: '32px 32px 0 0',
      overflow: 'hidden',
      position: 'relative',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 'var(--container-max-width)',
        margin: '0 auto',
        padding: '48px 36px 28px 36px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 48,
      }}>
        {/* Brand & Tagline */}
        <div style={{ minWidth: 220, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, boxShadow: '0 2px 8px #a855f7cc', border: '2.5px solid #fff',
            }}>S</div>
            <span style={{ fontWeight: 900, fontSize: 24, color: '#fff', letterSpacing: '-0.02em' }}>SajiloStay</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16, lineHeight: 1.6, marginBottom: 18, fontWeight: 500 }}>
            Find your perfect room in Nepal. Trusted by thousands of students and professionals.
          </p>
        </div>
        {/* Quick Links */}
        <div style={{ minWidth: 180, flex: 1 }}>
          <h3 style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 18, letterSpacing: 0.2 }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                  color: 'rgba(255,255,255,0.88)',
                  textDecoration: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'color 0.18s',
                  cursor: 'pointer',
                  letterSpacing: 0.1,
                }}
                onClick={e => {
                  e.preventDefault();
                  if (onNavigate) onNavigate(link.key);
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.88)'; }}
              >
                {link.label}
              </motion.a>
            ))}

          </div>
        </div>
        {/* Contact Info */}
        <div style={{ minWidth: 200, flex: 1 }}>
          <h3 style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 18, letterSpacing: 0.2 }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              <span>📍</span>
              <span>Kathmandu, Nepal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              <span>📧</span>
              <span>hello@sajilostay.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.88)', fontSize: 16 }}>
              <span>📱</span>
              <span>+977 1-4XXXXXXX</span>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright & Legal - always at the very end of the footer */}
      <div style={{
        borderTop: '2px solid #a855f7',
        marginTop: 18,
        paddingTop: 14,
        textAlign: 'center',
        color: '#e0e7ef',
        fontSize: 15,
        letterSpacing: '0.01em',
        background: 'rgba(63,0,153,0.32)',
        fontWeight: 600,
        borderRadius: '0 0 28px 28px',
      }}>
        © {new Date().getFullYear()} SajiloStay. All rights reserved. | Designed & Developed by Saudeep Adhikari | <a href="#" style={{ color: '#38bdf8', textDecoration: 'underline', marginLeft: 4 }}>Privacy Policy</a> | <a href="#" style={{ color: '#38bdf8', textDecoration: 'underline', marginLeft: 4 }}>Terms of Service</a>
      </div>
    </footer>
  );
}

export default Footer;

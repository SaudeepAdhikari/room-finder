import React, { useEffect } from 'react';
import ModernPostRoomForm from './components/forms/ModernPostRoomForm';
import Container from './components/Container';
import { useUser } from './context/UserContext';
import { useToast } from './context/ToastContext';
import './components/forms/ModernPostRoomForm.css';

const PostRoomPage = ({ onNavigate }) => {
  const { user, loading } = useUser();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !user && onNavigate) {
      showToast('Please log in to post a room.', 'info');
      onNavigate('auth');
    }
  }, [user, loading, onNavigate, showToast]);

  if (!user) return null;

  // Simple, clean background without heavy animations
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: `
      linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.03) 50%, rgba(6, 182, 212, 0.05) 100%),
      linear-gradient(45deg, #f8fafc 0%, #e0e7ef 100%)
    `,
  };

  return (
    <>
      {/* Simple Background */}
      <div style={backgroundStyle} />

      <Container>
        <div
          className="post-room-page"
          style={{
            minHeight: '100vh',
            padding: '120px 20px 80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 800,
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 32,
              boxShadow: `
                0 20px 40px -12px rgba(139, 92, 246, 0.15),
                0 8px 16px -4px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(139, 92, 246, 0.1)
              `,
              border: '1px solid rgba(139, 92, 246, 0.2)',
              padding: '60px 40px 50px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Header Section with Icon */}
            <div
              className="text-center mb-12"
              style={{ position: 'relative', zIndex: 2 }}
            >
              {/* Simple Icon */}
              <div className="mb-6">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 8px 16px rgba(139, 92, 246, 0.2)',
                    border: '3px solid rgba(255, 255, 255, 0.8)',
                  }}
                >
                  🏠
                </div>
              </div>

              {/* Title with Gradient */}
              <h1
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '16px',
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                }}
              >
                Post Your Room
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '1.2rem',
                  color: '#6b7280',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Share your space with travelers and earn extra income. 
                It's simple, secure, and rewarding.
              </p>
            </div>

            {/* Form Container */}
            <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
              <ModernPostRoomForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PostRoomPage;

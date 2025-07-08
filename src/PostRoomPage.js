import React, { useEffect } from 'react';
import MultiStepForm from './components/MultiStepForm';
import Container from './components/Container';
import { useUser } from './context/UserContext';
import { useToast } from './context/ToastContext';

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

  return (
    <Container>
      <div className="post-room-page" style={{ background: 'var(--background)', minHeight: '100vh', padding: '40px 0' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 'var(--card-padding)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: 30, fontWeight: 700 }}>Post a Room</h1>
          <MultiStepForm onNavigate={onNavigate} />
        </div>
      </div>
    </Container>
  );
};

export default PostRoomPage;

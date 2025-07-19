import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaHome, FaUpload, FaCheckCircle, FaStar } from 'react-icons/fa';
import ModernPostRoomForm from '../components/forms/ModernPostRoomForm';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import '../components/forms/ModernPostRoomForm.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  }
};

const AnimatedIcon = ({ children, type = "float", delay = 0 }) => {
  const iconVariants = {
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div variants={iconVariants} animate={type}>
      {children}
    </motion.div>
  );
};

const BENEFITS = [
  {
    icon: <FaUpload />,
    title: 'Easy Upload',
    description: 'Simple and intuitive room listing process',
    color: '#3b82f6'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Verified Listings',
    description: 'All rooms are verified for quality and safety',
    color: '#10b981'
  },
  {
    icon: <FaStar />,
    title: 'Premium Features',
    description: 'Access to premium listing features and tools',
    color: '#f59e0b'
  },
];

const PostRoomPage = ({ onNavigate }) => {
  const { user, loading } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroParallaxY = useTransform(scrollY, [0, 300], [0, -50]);
  const formParallaxY = useTransform(scrollY, [0, 400], [0, 30]);

  useEffect(() => {
    if (!loading && !user && onNavigate) {
      showToast('Please log in to post a room.', 'info');
      onNavigate('auth');
    }
  }, [user, loading, onNavigate, showToast]);

  if (!user && !loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <motion.div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: 16,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Please log in to post a room
          </motion.h2>
          <motion.p
            style={{ color: '#64748b', marginBottom: 24 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            You need to be signed in to list your property on SajiloStay.
          </motion.p>
          <motion.button
            style={{
              background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)',
              color: '#fff',
              fontWeight: 700,
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.7rem',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 12px #7c3aed22',
              transition: 'background 0.18s, box-shadow 0.18s'
            }}
            onClick={() => navigate('/auth')}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Log In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Animated Background */}
      <div className="post-room-bg-animation">
        <motion.div
          className="floating-shape shape-1"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-shape shape-2"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="floating-shape shape-3"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div style={{ width: '100vw', margin: 0, padding: 'var(--space-8) 0', boxSizing: 'border-box' }}>
        <motion.div
          className="post-room-page"
          style={{
            minHeight: '100vh',
            padding: '120px 0 80px',
            display: 'block',
            position: 'relative',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            style={{
              width: '100vw',
              margin: 0,
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 0,
              boxShadow: 'none',
              border: 'none',
              padding: '60px 0 50px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{
              boxShadow: `
                0 25px 50px -12px rgba(139, 92, 246, 0.25),
                0 12px 24px -4px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(139, 92, 246, 0.15)
              `
            }}
          >
            {/* Header Section with Icon */}
            <motion.div
              className="text-center mb-12"
              style={{ position: 'relative', zIndex: 2 }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Animated Icon */}
              <motion.div
                className="mb-6"
                variants={itemVariants}
              >
                <motion.div
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
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 12px 24px rgba(139, 92, 246, 0.3)'
                  }}
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <AnimatedIcon type="float" delay={0.5}>
                    🏠
                  </AnimatedIcon>
                </motion.div>
              </motion.div>

              {/* Title with Gradient */}
              <motion.h1
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
                variants={itemVariants}
              >
                Post Your Room
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                style={{
                  fontSize: '1.2rem',
                  color: '#6b7280',
                  maxWidth: '500px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                }}
                variants={itemVariants}
              >
                Share your space with travelers and earn extra income.
                It's simple, secure, and rewarding.
              </motion.p>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              style={{
                width: '100%',
                marginBottom: '40px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={i}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${benefit.color}22`,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 8px 32px ${benefit.color}22`
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    style={{
                      fontSize: '2rem',
                      color: benefit.color,
                      marginBottom: '12px'
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <AnimatedIcon type="pulse" delay={i * 0.2}>
                      {benefit.icon}
                    </AnimatedIcon>
                  </motion.div>
                  <motion.h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1f2937'
                    }}
                  >
                    {benefit.title}
                  </motion.h3>
                  <motion.p
                    style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      lineHeight: 1.5
                    }}
                  >
                    {benefit.description}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>

            {/* Form Container */}
            <motion.div
              style={{ width: '100%', position: 'relative', zIndex: 2 }}
              style={{ y: formParallaxY }}
            >
              <ModernPostRoomForm />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default PostRoomPage;

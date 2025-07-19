import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/home.css';
import { motion } from 'framer-motion';
import { FloatingElement, AnimatedButton } from '../../utils/animations';
import RevampedSearch from '../RevampedSearch';

const HeroSection = () => {
  const navigate = useNavigate();
  
  // Animation variants for staggered elements
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const handleSearch = (filters) => {
    // Build query params
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.priceMin) params.append('priceMin', filters.priceMin);
    if (filters.priceMax) params.append('priceMax', filters.priceMax);
    if (filters.roomType) params.append('roomType', filters.roomType);
    if (filters.genderPreference) params.append('gender', filters.genderPreference);
    
    // Navigate to search page with filters
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        {/* Animated background elements */}
        <FloatingElement className="bg-circle-1" delay={0.5} duration={4} distance={15} />
        <FloatingElement className="bg-circle-2" delay={0.2} duration={5} distance={20} />
        <FloatingElement className="bg-circle-3" delay={0.8} duration={6} distance={12} />
      </div>
      <div className="hero-content">
        <motion.div 
          className="hero-text"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={itemVariant}>
            Find Your Perfect Room in Minutes
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariant}>
            Discover comfortable, affordable accommodations that feel just like home. 
            Browse thousands of verified listings with detailed photos and reviews.
          </motion.p>
          
          {/* Search component */}
          <motion.div 
            className="hero-search" 
            variants={itemVariant}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <RevampedSearch onSearch={handleSearch} showMap={false} />
          </motion.div>
        </motion.div>
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <FloatingElement distance={8} duration={4}>
            <img 
              src="https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/hero-illustration.svg" 
              alt="Room Finder Illustration" 
              className="hero-illustration"
            />
          </FloatingElement>
        </motion.div>
      </div>
      <motion.div 
        className="scroll-down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="scroll-text">Scroll to explore</span>
        <motion.div 
          className="scroll-icon"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        ></motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

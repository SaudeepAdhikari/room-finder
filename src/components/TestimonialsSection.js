import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TestimonialsSection.css';

// Sample testimonial data - in a real app, this would come from an API
const testimonials = [
  {
    id: 1,
    name: "Aarav Sharma",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Student",
    rating: 5,
    text: "Finding a room near my university was so easy with Room Finder. I got a great place within my budget in just two days!",
    location: "Kirtipur, Kathmandu"
  },
  {
    id: 2,
    name: "Priya Tamang",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Professional",
    rating: 4.5,
    text: "As someone new to the city, Room Finder helped me find a safe and convenient apartment. The verification process gave me peace of mind.",
    location: "Baluwatar, Kathmandu"
  },
  {
    id: 3,
    name: "Rohan Magar",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    role: "IT Specialist",
    rating: 5,
    text: "I needed a place with good internet connectivity and Room Finder's filter options helped me find exactly what I needed. Highly recommended!",
    location: "Thamel, Kathmandu"
  },
  {
    id: 4,
    name: "Sita Gurung",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    role: "Healthcare Worker",
    rating: 4,
    text: "The map view feature helped me find a room close to the hospital where I work. Saved me hours of commuting time!",
    location: "Patan, Lalitpur"
  },
  {
    id: 5,
    name: "Niraj Thapa",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    role: "Business Owner",
    rating: 5,
    text: "I was able to list my vacant rooms quickly and found great tenants within a week. The platform is easy to use for property owners too.",
    location: "Sanepa, Lalitpur"
  },
  {
    id: 6,
    name: "Anisha Rai",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    role: "Graduate Student",
    rating: 4.5,
    text: "The detailed descriptions and verified photos gave me confidence in my choice. I found a wonderful room that exactly matched what I saw online.",
    location: "Chabahil, Kathmandu"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const [autoSlideInterval, setAutoSlideInterval] = useState(null);
  
  // Define nextTestimonial function first since it's used in useEffect
  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  // Check if mobile view is needed
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Set visible testimonials based on view type
  useEffect(() => {
    if (isMobile) {
      setVisibleTestimonials([testimonials[activeIndex]]);
    } else {
      // For desktop, show 3 testimonials
      setVisibleTestimonials(testimonials.slice(0, 3));
    }
  }, [isMobile, activeIndex]);

  // Auto-slide for mobile view
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000); // Change every 5 seconds
      setAutoSlideInterval(interval);
    } else if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    
    return () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    };
  }, [isMobile, activeIndex, nextTestimonial, autoSlideInterval]);

  // Go to previous testimonial in slider
  const prevTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Go to specific testimonial
  const goToTestimonial = useCallback((index) => {
    setActiveIndex(index);
    
    // Reset auto-slide timer when manually changing slides
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000);
      setAutoSlideInterval(interval);
    }
  }, [autoSlideInterval, nextTestimonial]);

  // Generate star rating component
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <motion.div 
          className="testimonials-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <h2>What Our Users Say</h2>
          <p>Discover how Room Finder has helped people find their perfect accommodations</p>
        </motion.div>

        {isMobile ? (
          // Mobile slider view with AnimatePresence for smooth transitions
          <div className="testimonials-slider">
            <AnimatePresence mode="wait">
              <motion.div 
                className="testimonials-slider-container"
                key={activeIndex} // Re-render on index change
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {visibleTestimonials.map((testimonial) => (
                  <motion.div 
                    className="testimonial-card" 
                    key={testimonial.id}
                    whileHover="hover"
                    variants={cardVariants}
                  >
                    <div className="testimonial-avatar-container">
                      <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                      <div className="testimonial-info">
                        <h3>{testimonial.name}</h3>
                        <span className="testimonial-role">{testimonial.role}</span>
                      </div>
                    </div>
                    <div className="testimonial-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <div className="testimonial-location">
                      <i className="fas fa-map-marker-alt"></i> {testimonial.location}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            
            <div className="slider-controls">
              <button onClick={prevTestimonial} aria-label="Previous testimonial">
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="slider-dots">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    className={`slider-dot ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => goToTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial} aria-label="Next testimonial">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        ) : (
          // Desktop grid view with staggered animation
          <motion.div 
            className="testimonials-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {visibleTestimonials.map((testimonial) => (
              <motion.div 
                className="testimonial-card"
                key={testimonial.id}
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="testimonial-avatar-container">
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h3>{testimonial.name}</h3>
                    <span className="testimonial-role">{testimonial.role}</span>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-location">
                  <i className="fas fa-map-marker-alt"></i> {testimonial.location}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="testimonials-footer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <a href="/testimonials" className="view-all-link">
            View all testimonials <i className="fas fa-arrow-right"></i>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

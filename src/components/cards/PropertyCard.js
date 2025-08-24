import React, { useState, useRef } from 'react';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import './PropertyCard.css';
import './PropertyCardAnimations.css';  // Import the new animations
import { useTilt } from '../../utils/animations';

const PropertyCard = ({ property }) => {
  const [favorite, setFavorite] = useState(property.isFavorite || false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);  // Ref for ripple effect

  const {
    id,
    image,
    title,
    location,
    price,
    priceUnit = "month",
    beds = 1,
    baths = 1,
    area,
    rating = 4.5,
    reviewCount = 0,
    tags = [],
    amenities = [],
    isVerified = false,
    isNew = false
  } = property;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    // Here you would typically call an API to save the favorite status
  };

  // Generate rating stars
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

  // Create ripple effect for buttons
  const createRipple = (event) => {
    const button = event.currentTarget;
    
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const ripple = document.createElement("span");
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    ripple.classList.add("ripple");
    
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  // Use our custom tilt hook with enhanced options
  const tiltRef = useTilt({ 
    max: 5,           // Maximum tilt angle
    scale: 1.03,      // Scale on hover
    speed: 800,       // Transition speed
    perspective: 1500 // 3D perspective
  });

  // Animation for hover effect
  const cardVariants = {
    initial: { 
      y: 0,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    hover: { 
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div 
      ref={tiltRef}
      className={`property-card ${isHovered ? 'hovered' : ''}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Glare effect overlay */}
      <div className="property-card-glare"></div>
      
      <div className="property-image-container">
        <div className="property-image-wrapper">
          <motion.img 
            src={image} 
            alt={title}
            className="property-image"
          />
        </div>
        
        {/* Tags */}
        <div className="property-tags">
          {isNew && <span className="tag tag-new">NEW</span>}
          {isVerified && <span className="tag tag-verified">VERIFIED</span>}
          {tags.map((tag, index) => (
            <span key={index} className={`tag tag-${tag.toLowerCase()}`}>{tag}</span>
          ))}
        </div>
        
        {/* Favorite Button with enhanced animation */}
        <button 
          className={`favorite-button ${favorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className={favorite ? "fas fa-heart" : "far fa-heart"}></i>
        </button>
      </div>

      <div className="property-content">
        <div className="property-header">
          <h3 className="property-title">{title}</h3>
          <div className="property-price">
            <span className="amount">${price}</span>
            <span className="period">/{priceUnit}</span>
          </div>
        </div>
        
        <p className="property-location">
          <i className="fas fa-map-marker-alt"></i> {location}
        </p>
        
        <div className="property-features">
          {beds && (
            <div className="feature">
              <i className="fas fa-bed"></i>
              <span>{beds} {beds === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {baths && (
            <div className="feature">
              <i className="fas fa-bath"></i>
              <span>{baths} {baths === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {area && (
            <div className="feature">
              <i className="fas fa-vector-square"></i>
              <span>{area} sq.ft</span>
            </div>
          )}
        </div>
        
        {amenities.length > 0 && (
          <div className="property-amenities">
            {amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="amenity">
                <i className={getAmenityIcon(amenity)}></i>
                <span>{amenity}</span>
              </div>
            ))}
            {amenities.length > 3 && (
              <div className="amenity more">
                <span>+{amenities.length - 3} more</span>
              </div>
            )}
          </div>
        )}
        
        <div className="property-footer">
          <div className="property-rating">
            <div className="stars">
              {renderStars(rating)}
            </div>
            {reviewCount > 0 && <span className="review-count">({reviewCount})</span>}
          </div>
          <button 
            className="view-details-button"
            ref={buttonRef}
            onClick={createRipple}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to get the appropriate icon for each amenity
const getAmenityIcon = (amenity) => {
  const amenityLower = amenity.toLowerCase();
  
  if (amenityLower.includes('wifi')) return 'fas fa-wifi';
  if (amenityLower.includes('parking')) return 'fas fa-parking';
  if (amenityLower.includes('air') || amenityLower.includes('ac')) return 'fas fa-snowflake';
  if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return 'fas fa-dumbbell';
  if (amenityLower.includes('laundry') || amenityLower.includes('washing')) return 'fas fa-washer';
  if (amenityLower.includes('security') || amenityLower.includes('guard')) return 'fas fa-shield-alt';
  if (amenityLower.includes('furniture') || amenityLower.includes('furnished')) return 'fas fa-couch';
  if (amenityLower.includes('pet')) return 'fas fa-paw';
  if (amenityLower.includes('kitchen')) return 'fas fa-utensils';
  if (amenityLower.includes('tv') || amenityLower.includes('television')) return 'fas fa-tv';
  if (amenityLower.includes('balcony')) return 'fas fa-door-open';
  if (amenityLower.includes('water')) return 'fas fa-water';
  if (amenityLower.includes('electricity') || amenityLower.includes('power')) return 'fas fa-bolt';
  if (amenityLower.includes('garden')) return 'fas fa-leaf';
  if (amenityLower.includes('heating')) return 'fas fa-temperature-high';
  
  // Default icon
  return 'fas fa-check-circle';
};

export default PropertyCard;

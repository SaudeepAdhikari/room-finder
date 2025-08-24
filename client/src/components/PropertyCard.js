import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt, FaWifi, FaParking, FaCoffee, FaSwimmingPool } from 'react-icons/fa';

import './PropertyCard.css';

const PropertyCard = ({
  id,
  image,
  title,
  location,
  pricePerNight,
  originalPrice,
  rating = 0,
  reviewCount = 0,
  amenities = [],
  isWishlisted = false,
  onBookNow,
  onWishlistToggle,
  className = '',
  size = 'medium' // small, medium, large
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star filled" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half-filled" />);
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  // Render amenity icons
  const renderAmenityIcon = (amenity) => {
    const amenityIcons = {
      wifi: FaWifi,
      parking: FaParking,
      coffee: FaCoffee,
      pool: FaSwimmingPool,
    };

    const IconComponent = amenityIcons[amenity.toLowerCase()] || FaCoffee;
    return <IconComponent key={amenity} className="amenity-icon" title={amenity} />;
  };

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow(id);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(id);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`property-card ${size} ${className}`}>
      {/* Image Container */}
      <div className="property-image-container">
        {!imageError ? (
          <img
            src={image}
            alt={title}
            className={`property-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="property-image-placeholder">
            <div className="placeholder-icon">🏠</div>
            <span>No Image Available</span>
          </div>
        )}
        
        {/* Image Overlay Elements */}
        <div className="image-overlay">
          {/* Wishlist Button */}
          <button
            className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Discount Badge */}
          {originalPrice && originalPrice > pricePerNight && (
            <div className="discount-badge">
              {Math.round(((originalPrice - pricePerNight) / originalPrice) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Loading Shimmer */}
        {!imageLoaded && !imageError && (
          <div className="image-shimmer">
            <div className="shimmer-animation"></div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="property-content">
        {/* Title and Location */}
        <div className="property-header">
          <h3 className="property-title">{title}</h3>
          {location && (
            <div className="property-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="property-rating">
          <div className="stars-container">
            {renderStars(rating)}
            <span className="rating-number">{rating.toFixed(1)}</span>
          </div>
          {reviewCount > 0 && (
            <span className="review-count">({reviewCount} reviews)</span>
          )}
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="property-amenities">
            {amenities.slice(0, 4).map(renderAmenityIcon)}
            {amenities.length > 4 && (
              <span className="amenities-more">+{amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Price and Action */}
        <div className="property-footer">
          <div className="price-container">
            {originalPrice && originalPrice > pricePerNight && (
              <span className="original-price">${originalPrice}</span>
            )}
            <div className="current-price">
              <span className="price">${pricePerNight}</span>
              <span className="price-period">/ night</span>
            </div>
          </div>

          <button
            className="book-now-btn"
            onClick={handleBookNow}
            aria-label={`Book ${title} now`}
          >
            <span>Book Now</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="book-icon"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Glassmorphism Background Elements */}
      <div className="card-glass-bg"></div>
      <div className="card-border-glow"></div>
    </div>
  );
};

// Sample data for demonstration
PropertyCard.sampleData = {
  id: 1,
  image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  title: "Luxury Oceanview Suite",
  location: "Malibu, California",
  pricePerNight: 299,
  originalPrice: 399,
  rating: 4.8,
  reviewCount: 127,
  amenities: ['wifi', 'parking', 'coffee', 'pool'],
  isWishlisted: false
};

export default PropertyCard;

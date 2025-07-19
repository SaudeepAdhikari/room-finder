import React, { useState } from 'react';
import PropertyCard from './components/PropertyCard';
import './PropertyShowcase.css';

const PropertyShowcase = () => {
  const [wishlistedItems, setWishlistedItems] = useState(new Set());

  // Sample property data
  const sampleProperties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Luxury Oceanview Suite",
      location: "Malibu, California",
      pricePerNight: 299,
      originalPrice: 399,
      rating: 4.8,
      reviewCount: 127,
      amenities: ['wifi', 'parking', 'coffee', 'pool']
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Modern Downtown Loft",
      location: "New York, NY",
      pricePerNight: 189,
      originalPrice: 249,
      rating: 4.6,
      reviewCount: 89,
      amenities: ['wifi', 'parking', 'coffee']
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      pricePerNight: 159,
      rating: 4.9,
      reviewCount: 234,
      amenities: ['wifi', 'coffee', 'parking', 'pool']
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Beachfront Villa",
      location: "Miami Beach, FL",
      pricePerNight: 445,
      originalPrice: 595,
      rating: 4.7,
      reviewCount: 156,
      amenities: ['wifi', 'parking', 'pool', 'coffee']
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Historic City Center Apartment",
      location: "Boston, MA",
      pricePerNight: 129,
      rating: 4.4,
      reviewCount: 67,
      amenities: ['wifi', 'coffee']
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Desert Resort Spa",
      location: "Scottsdale, Arizona",
      pricePerNight: 349,
      originalPrice: 449,
      rating: 4.9,
      reviewCount: 203,
      amenities: ['wifi', 'parking', 'pool', 'coffee']
    }
  ];

  const handleBookNow = (propertyId) => {
    console.log(`Booking property ${propertyId}`);
    alert(`Booking initiated for property ${propertyId}!`);
  };

  const handleWishlistToggle = (propertyId) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  return (
    <div className="property-showcase">
      {/* Header Section */}
      <div className="showcase-header">
        <div className="showcase-container">
          <h1 className="showcase-title">Property Card Showcase</h1>
          <p className="showcase-description">
            Beautiful, reusable property cards with glassmorphism effects and smooth animations
          </p>
        </div>
      </div>

      {/* Size Variations */}
      <section className="showcase-section">
        <div className="showcase-container">
          <h2 className="section-title">Size Variations</h2>
          <div className="size-demo-grid">
            <div className="size-demo-item">
              <h3>Small</h3>
              <PropertyCard
                {...sampleProperties[0]}
                size="small"
                isWishlisted={wishlistedItems.has(sampleProperties[0].id)}
                onBookNow={handleBookNow}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
            <div className="size-demo-item">
              <h3>Medium (Default)</h3>
              <PropertyCard
                {...sampleProperties[1]}
                size="medium"
                isWishlisted={wishlistedItems.has(sampleProperties[1].id)}
                onBookNow={handleBookNow}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
            <div className="size-demo-item">
              <h3>Large</h3>
              <PropertyCard
                {...sampleProperties[2]}
                size="large"
                isWishlisted={wishlistedItems.has(sampleProperties[2].id)}
                onBookNow={handleBookNow}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="showcase-section">
        <div className="showcase-container">
          <h2 className="section-title">Property Listings Grid</h2>
          <div className="properties-grid">
            {sampleProperties.map(property => (
              <PropertyCard
                key={property.id}
                {...property}
                isWishlisted={wishlistedItems.has(property.id)}
                onBookNow={handleBookNow}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="showcase-section">
        <div className="showcase-container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h3>Glassmorphism Effects</h3>
              <p>Beautiful frosted glass appearance with backdrop blur effects</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>Mobile Responsive</h3>
              <p>Optimized layouts for all screen sizes with square image thumbnails on mobile</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎭</div>
              <h3>Smooth Animations</h3>
              <p>Hover effects with scaling, lifting, and color transitions</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <h3>Interactive Elements</h3>
              <p>Wishlist toggle, rating display, and prominent call-to-action buttons</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h3>Modern Design</h3>
              <p>Clean layout with soft shadows, rounded corners, and gradient accents</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">♿</div>
              <h3>Accessible</h3>
              <p>Full keyboard navigation, screen reader support, and high contrast mode</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyShowcase;

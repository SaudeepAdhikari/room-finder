import React from 'react';
import PropertyCardGrid from '../components/cards/PropertyCardGrid';

const PropertyShowcase = () => {
  // Sample property data
  const properties = [
    {
      id: 1,
      image: "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/property-1.jpg",
      title: "Modern Studio Apartment with City View",
      location: "Downtown, Kathmandu",
      price: 350,
      priceUnit: "month",
      beds: 1,
      baths: 1,
      area: 450,
      rating: 4.8,
      reviewCount: 24,
      tags: ["Featured"],
      amenities: ["WiFi", "Air Conditioning", "Furnished", "Parking"],
      isVerified: true,
      isNew: false
    },
    {
      id: 2,
      image: "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/property-2.jpg",
      title: "Cozy Single Room near University",
      location: "Kirtipur, Kathmandu",
      price: 150,
      priceUnit: "month",
      beds: 1,
      baths: 1,
      area: 200,
      rating: 4.2,
      reviewCount: 16,
      tags: ["Student Friendly"],
      amenities: ["WiFi", "Laundry", "Water Supply"],
      isVerified: false,
      isNew: true
    },
    {
      id: 3,
      image: "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/property-3.jpg",
      title: "Luxury 2BHK Apartment with Mountain View",
      location: "Lazimpat, Kathmandu",
      price: 650,
      priceUnit: "month",
      beds: 2,
      baths: 2,
      area: 900,
      rating: 4.9,
      reviewCount: 32,
      tags: ["Premium", "Featured"],
      amenities: ["WiFi", "AC", "Parking", "Security", "Furnished", "Kitchen"],
      isVerified: true,
      isNew: false
    },
    {
      id: 4,
      image: "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/property-4.jpg",
      title: "Budget Friendly Single Room",
      location: "Patan, Lalitpur",
      price: 120,
      priceUnit: "month",
      beds: 1,
      baths: 1,
      area: 180,
      rating: 3.8,
      reviewCount: 7,
      tags: ["Deal"],
      amenities: ["WiFi", "Water Supply"],
      isVerified: false,
      isNew: false
    }
  ];

  return (
    <div className="property-showcase-container">
      <h2 className="section-title">Featured Properties</h2>
      <p className="section-subtitle">Discover our hand-picked selection of top properties</p>
      <PropertyCardGrid properties={properties} />
    </div>
  );
};

export default PropertyShowcase;

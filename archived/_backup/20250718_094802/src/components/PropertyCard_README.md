# PropertyCard Component Documentation

A beautiful, reusable card UI component for displaying room and property listings on travel platforms with glassmorphism effects, smooth animations, and comprehensive functionality.

## 🎨 **Design Features**

### **Visual Design**

- **Glassmorphism Effects**: Semi-transparent background with backdrop blur
- **Modern Layout**: Clean card design with rounded corners (20px radius)
- **Soft Shadows**: Multi-layered shadow system for depth
- **Gradient Accents**: Pink to purple gradients for interactive elements
- **Hover Animations**: Scale and lift effects with smooth transitions

### **Image Handling**

- **Lazy Loading**: Optimized image loading for performance
- **Error Fallback**: Placeholder with icon when image fails to load
- **Loading Shimmer**: Animated loading state with shimmer effect
- **Responsive Images**: Optimized for different screen sizes
- **Square Thumbnails**: Mobile-optimized aspect ratios

## 🚀 **Key Features**

### **Property Information Display**

- **Title**: Property name with text overflow handling
- **Location**: Icon + location string with map marker
- **Price Display**: Current price with optional original price (strikethrough)
- **Discount Badge**: Percentage off calculation and display
- **Rating System**: Star rating with half-star support
- **Review Count**: Number of reviews with proper formatting

### **Interactive Elements**

- **Wishlist Toggle**: Heart icon with fill/outline states
- **Book Now Button**: Primary CTA with arrow icon animation
- **Hover Effects**: Card lifting, scaling, and color transitions
- **Touch Optimized**: Mobile-friendly tap targets

### **Amenities Display**

- **Icon System**: Visual amenity indicators (WiFi, Parking, etc.)
- **Smart Truncation**: Shows first 4 amenities + count for more
- **Hover Effects**: Color transitions on card hover

## 📱 **Responsive Design**

### **Size Variations**

```javascript
// Available sizes
size = "small"; // 280px max-width, 320px min-height
size = "medium"; // 320px max-width, 380px min-height (default)
size = "large"; // 380px max-width, 420px min-height
```

### **Mobile Adaptations**

- **Square Images**: 1:1 aspect ratio on mobile screens
- **Full-width Layout**: Responsive grid adaptation
- **Touch Targets**: Minimum 44px touch areas
- **Optimized Spacing**: Reduced padding and margins

## 🛠️ **Technical Implementation**

### **Component Props**

```javascript
PropTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string,
  pricePerNight: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  amenities: PropTypes.arrayOf(PropTypes.string),
  isWishlisted: PropTypes.bool,
  onBookNow: PropTypes.func,
  onWishlistToggle: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};
```

### **State Management**

```javascript
const [imageLoaded, setImageLoaded] = useState(false);
const [imageError, setImageError] = useState(false);
```

### **Event Handlers**

```javascript
// Booking action
const handleBookNow = () => {
  if (onBookNow) onBookNow(id);
};

// Wishlist toggle (prevents event bubbling)
const handleWishlistToggle = (e) => {
  e.stopPropagation();
  if (onWishlistToggle) onWishlistToggle(id);
};
```

## 🎭 **Animation System**

### **Hover Effects**

```css
.property-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
```

### **Image Zoom**

```css
.property-card:hover .property-image {
  transform: scale(1.05);
}
```

### **Button Animations**

```css
.book-now-btn:hover {
  background: linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 100%);
  transform: translateY(-2px);
}
```

### **Loading Shimmer**

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

## 🌟 **Usage Examples**

### **Basic Implementation**

```jsx
import PropertyCard from "./components/PropertyCard";

<PropertyCard
  id={1}
  image="https://example.com/image.jpg"
  title="Luxury Oceanview Suite"
  location="Malibu, California"
  pricePerNight={299}
  rating={4.8}
  reviewCount={127}
  amenities={["wifi", "parking", "coffee", "pool"]}
  onBookNow={(id) => console.log(`Booking ${id}`)}
  onWishlistToggle={(id) => console.log(`Wishlist ${id}`)}
/>;
```

### **With Discounts and Wishlist**

```jsx
<PropertyCard
  id={2}
  image="https://example.com/image.jpg"
  title="Modern Downtown Loft"
  location="New York, NY"
  pricePerNight={189}
  originalPrice={249}
  rating={4.6}
  reviewCount={89}
  amenities={["wifi", "parking"]}
  isWishlisted={true}
  size="large"
  onBookNow={handleBookNow}
  onWishlistToggle={handleWishlistToggle}
/>
```

### **Grid Layout Example**

```jsx
<div className="properties-grid">
  {properties.map((property) => (
    <PropertyCard
      key={property.id}
      {...property}
      isWishlisted={wishlistedItems.has(property.id)}
      onBookNow={handleBookNow}
      onWishlistToggle={handleWishlistToggle}
    />
  ))}
</div>
```

## 🎨 **Styling Customization**

### **Color Scheme Variables**

```css
:root {
  --card-bg: rgba(255, 255, 255, 0.1);
  --card-border: rgba(255, 255, 255, 0.2);
  --primary-pink: #ff6b9d;
  --primary-purple: #8b5cf6;
  --text-primary: #1a1a1a;
  --text-secondary: #6c757d;
}
```

### **Custom Size Variant**

```css
.property-card.custom {
  max-width: 400px;
  min-height: 450px;
}

.property-card.custom .property-image-container {
  height: 250px;
}
```

### **Theme Integration**

```css
@media (prefers-color-scheme: dark) {
  .property-card {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .property-title {
    color: #ffffff;
  }
}
```

## ♿ **Accessibility Features**

### **Keyboard Navigation**

```jsx
// Focus management
<button
  className="book-now-btn"
  onClick={handleBookNow}
  aria-label={`Book ${title} now`}
>
```

### **Screen Reader Support**

```jsx
// ARIA labels for interactive elements
<button
  className="wishlist-btn"
  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
>
```

### **High Contrast Mode**

```css
@media (prefers-contrast: high) {
  .property-card {
    border: 2px solid #000;
    background: #fff;
  }
}
```

### **Reduced Motion**

```css
@media (prefers-reduced-motion: reduce) {
  .property-card,
  .property-image,
  .book-now-btn {
    transition: none;
  }
}
```

## 🔧 **Configuration Options**

### **Amenity Icons Mapping**

```javascript
const amenityIcons = {
  wifi: FaWifi,
  parking: FaParking,
  coffee: FaCoffee,
  pool: FaSwimmingPool,
  // Add more mappings as needed
};
```

### **Star Rating Precision**

```javascript
// Supports decimal ratings
rating={4.8} // Displays 4 full stars + half star
rating={4.0} // Displays 4 full stars + 1 empty star
```

### **Price Formatting**

```javascript
// Automatic currency formatting
pricePerNight={299} // Displays as "$299"
```

## 🚀 **Performance Optimizations**

### **Image Optimization**

- **Lazy Loading**: `loading="lazy"` attribute
- **Error Handling**: Graceful fallback to placeholder
- **Progressive Enhancement**: Shimmer loading state

### **Animation Performance**

```css
.property-card {
  will-change: transform, box-shadow;
  transform: translateZ(0); /* Hardware acceleration */
}
```

### **Bundle Size**

- **Icon Tree Shaking**: Import only needed icons
- **CSS Optimization**: Minimal critical styles
- **Component Splitting**: Separate concerns

## 🌐 **Browser Compatibility**

### **Modern Features**

- **Backdrop Filter**: Chrome 76+, Safari 9+, Firefox 103+
- **CSS Grid**: Universal support
- **CSS Custom Properties**: All modern browsers
- **Aspect Ratio**: Safari iOS 15+, Chrome 88+

### **Fallbacks**

```css
/* Aspect ratio fallback for older browsers */
.property-image-container {
  height: 0;
  padding-bottom: 100%; /* 1:1 ratio */
  aspect-ratio: 1; /* Modern browsers */
}
```

## 🔮 **Future Enhancements**

### **Potential Features**

- **360° View Integration**: Virtual tour support
- **Video Thumbnails**: Auto-playing preview videos
- **Comparison Mode**: Multi-select for property comparison
- **Social Sharing**: Direct sharing buttons
- **Availability Calendar**: Quick date picker integration

### **Advanced Animations**

- **Parallax Effects**: Background image movement
- **Micro-interactions**: Detailed hover states
- **Loading Skeletons**: More sophisticated loading states
- **Gesture Support**: Swipe interactions on mobile

## 📊 **Sample Data Structure**

```javascript
const sampleProperty = {
  id: 1,
  image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  title: "Luxury Oceanview Suite",
  location: "Malibu, California",
  pricePerNight: 299,
  originalPrice: 399, // Optional for discounts
  rating: 4.8,
  reviewCount: 127,
  amenities: ["wifi", "parking", "coffee", "pool"],
  isWishlisted: false,
};
```

This PropertyCard component provides a professional, modern interface for displaying property listings with excellent user experience, accessibility, and performance across all devices and browsers.

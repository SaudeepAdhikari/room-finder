# AdvancedSearchFilter Component Documentation

A modern, Airbnb-style search and filter interface for hotel booking platforms with glassmorphism effects, location autocomplete, date selection, and comprehensive filtering options.

## 🎨 **Design Features**

### **Visual Design**

- **Glassmorphism Effects**: Semi-transparent background with backdrop blur for modern appearance
- **Pill-shaped Fields**: Rounded input containers with clean, modern styling
- **Gradient Accents**: Pink to purple gradients for primary actions and interactive elements
- **Soft Elevation**: Multi-layered shadows for depth and visual hierarchy
- **Icons Inside Fields**: Contextual icons to improve usability and visual appeal

### **Layout Variants**

- **Horizontal**: Traditional search bar layout for desktop
- **Vertical**: Stacked layout for mobile and compact spaces
- **Compact**: Condensed version for limited space scenarios

## 🚀 **Key Features**

### **Location Search with Autocomplete**

- **Smart Suggestions**: Real-time filtering of popular destinations
- **Dropdown Interface**: Clean dropdown with destination details
- **Country Information**: Shows city and country for clarity
- **Click to Select**: Easy selection from suggestion list
- **Empty State Handling**: Graceful handling when no matches found

### **Date Selection System**

- **Check-in/Check-out**: Separate date inputs with validation
- **Date Validation**: Ensures check-out is after check-in
- **Minimum Date**: Prevents past date selection
- **Native Date Pickers**: Uses browser date controls for consistency
- **Visual Labels**: Clear field labeling for better UX

### **Guest Management**

- **Multi-category Guests**: Adults, Children, and Infants
- **Age Specifications**: Clear age ranges for each category
- **Increment/Decrement**: Plus/minus controls with validation
- **Smart Display**: Contextual text based on guest counts
- **Minimum Validation**: Ensures at least one adult

### **Advanced Filtering**

- **Price Range Slider**: Dual-handle range with visual feedback
- **Property Types**: Visual selection with icons (House, Apartment, Villa)
- **Amenities Grid**: Multi-select amenities with toggle functionality
- **Filter Indicators**: Visual count of active filters
- **Clear All Option**: Easy reset of all applied filters

## 📱 **Responsive Design**

### **Desktop (1024px+)**

```css
.search-fields-wrapper {
  display: flex;
  flex-direction: row;
  gap: 2px;
}
```

- Horizontal search bar layout
- All fields in single row
- Filters toggle on the side
- Full dropdown functionality

### **Tablet (768px - 1023px)**

- Maintained horizontal layout
- Adjusted spacing and padding
- Touch-optimized controls
- Responsive field sizing

### **Mobile (< 768px)**

```css
.search-fields-wrapper {
  flex-direction: column;
  gap: 1px;
}
```

- Vertical stacked layout
- Full-width search button
- Collapsible advanced filters
- Touch-friendly interactions

## 🛠️ **Technical Implementation**

### **Component Props**

```javascript
PropTypes = {
  onSearch: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["horizontal", "vertical", "compact"]),
};
```

### **State Management**

```javascript
const [filters, setFilters] = useState({
  location: "",
  checkIn: "",
  checkOut: "",
  guests: { adults: 2, children: 0, infants: 0 },
  priceRange: [50, 500],
  propertyType: "",
  amenities: [],
});

const [activeField, setActiveField] = useState(null);
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
const [locationSuggestions, setLocationSuggestions] = useState([]);
```

### **Key Functionality**

```javascript
// Location autocomplete
useEffect(() => {
  if (filters.location.length > 0) {
    const filtered = popularDestinations.filter((dest) =>
      dest.name.toLowerCase().includes(filters.location.toLowerCase())
    );
    setLocationSuggestions(filtered);
  }
}, [filters.location]);

// Guest management
const handleGuestChange = (type, operation) => {
  setFilters((prev) => ({
    ...prev,
    guests: {
      ...prev.guests,
      [type]:
        operation === "increment"
          ? prev.guests[type] + 1
          : Math.max(0, prev.guests[type] - 1),
    },
  }));
};
```

## 🎭 **Animation System**

### **Dropdown Animations**

```css
@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### **Panel Slide-in**

```css
@keyframes panelSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### **Hover Effects**

- **Field Highlighting**: Background color transitions
- **Button Scaling**: Subtle scale effects on interaction
- **Shadow Enhancement**: Dynamic shadow changes
- **Icon Color Transitions**: Contextual color changes

## 🌟 **Usage Examples**

### **Basic Implementation**

```jsx
import AdvancedSearchFilter from "./components/AdvancedSearchFilter";

<AdvancedSearchFilter
  onSearch={(filters) => {
    console.log("Search filters:", filters);
    // Handle search logic
  }}
  variant="horizontal"
/>;
```

### **With Initial State**

```jsx
<AdvancedSearchFilter
  onSearch={handleSearch}
  initialFilters={{
    location: "New York City",
    guests: { adults: 2, children: 1, infants: 0 },
    priceRange: [100, 400],
    amenities: ["WiFi", "Pool"],
  }}
  variant="horizontal"
  className="custom-search-filter"
/>
```

### **Search Handler Example**

```javascript
const handleSearch = (filters) => {
  // Construct search query
  const searchParams = {
    location: filters.location,
    checkIn: filters.checkIn,
    checkOut: filters.checkOut,
    guests: filters.guests.adults + filters.guests.children,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    propertyType: filters.propertyType,
    amenities: filters.amenities,
  };

  // API call or routing
  searchProperties(searchParams);
};
```

## 🎨 **Glassmorphism Implementation**

### **Main Search Bar**

```css
.search-bar-container {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05);
}
```

### **Advanced Filters Panel**

```css
.advanced-filters-panel {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}
```

### **Dropdowns**

```css
.location-dropdown,
.guests-dropdown {
  background: white;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

## 🔧 **Customization Options**

### **Color Scheme**

```css
:root {
  --search-bg: rgba(255, 255, 255, 0.95);
  --search-border: rgba(255, 255, 255, 0.3);
  --primary-gradient: linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 100%);
  --text-primary: #222;
  --text-secondary: #666;
  --text-muted: #999;
}
```

### **Custom Property Types**

```javascript
const propertyTypes = [
  { id: "house", label: "House", icon: FaHome },
  { id: "apartment", label: "Apartment", icon: FaBuilding },
  { id: "villa", label: "Villa", icon: FaUmbrellaBeach },
  // Add custom types
  { id: "cabin", label: "Cabin", icon: FaCabin },
];
```

### **Amenities Configuration**

```javascript
const amenityOptions = [
  "WiFi",
  "Pool",
  "Parking",
  "Kitchen",
  "Air Conditioning",
  "Gym",
  "Pet Friendly",
  "Balcony",
  "Hot Tub",
  "Fireplace",
  // Add more amenities as needed
];
```

## ♿ **Accessibility Features**

### **Keyboard Navigation**

```jsx
// Tab navigation through all interactive elements
<button
  className="search-btn"
  onClick={handleSearch}
  aria-label="Search properties with current filters"
>
```

### **Screen Reader Support**

```jsx
// ARIA labels for complex interactions
<button
  className="guest-btn"
  onClick={() => handleGuestChange('adults', 'increment')}
  aria-label="Increase number of adults"
>
```

### **Focus Management**

```css
.search-field:focus-within {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 2px rgba(255, 107, 157, 0.3);
}
```

### **High Contrast Mode**

```css
@media (prefers-contrast: high) {
  .search-bar-container {
    background: #ffffff;
    border: 2px solid #000000;
  }

  .search-btn {
    background: #000000;
    color: #ffffff;
  }
}
```

## 🚀 **Performance Optimizations**

### **Debounced Search**

```javascript
// Implement debouncing for location search
const debouncedLocationSearch = useCallback(
  debounce((query) => {
    // API call for location suggestions
  }, 300),
  []
);
```

### **Memoized Components**

```javascript
// Optimize re-renders
const LocationSuggestion = React.memo(({ destination, onSelect }) => {
  return (
    <button onClick={() => onSelect(destination)}>{destination.name}</button>
  );
});
```

### **Lazy Loading**

```javascript
// Load filter options only when needed
const amenityOptions = useMemo(() => {
  return showAdvancedFilters ? loadAmenities() : [];
}, [showAdvancedFilters]);
```

## 🌐 **Browser Compatibility**

### **Modern Features**

- **Backdrop Filter**: Chrome 76+, Safari 9+, Firefox 103+
- **CSS Grid**: Universal support
- **Date Input**: All modern browsers
- **CSS Custom Properties**: Universal support

### **Fallbacks**

```css
/* Backdrop filter fallback */
.search-bar-container {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  /* Fallback for older browsers */
  background: rgba(255, 255, 255, 0.98);
}
```

## 🔮 **Future Enhancements**

### **Advanced Features**

- **Map Integration**: Location selection via interactive map
- **Saved Searches**: Store and recall previous searches
- **Voice Search**: Voice input for location and preferences
- **Smart Suggestions**: AI-powered search recommendations
- **Calendar Widget**: Custom date picker with availability

### **Internationalization**

- **Multi-language Support**: Localized text and date formats
- **Currency Selection**: Dynamic currency based on location
- **Regional Preferences**: Adapted to local booking patterns

### **API Integration**

- **Real-time Availability**: Live property availability checking
- **Dynamic Pricing**: Real-time price updates
- **Location Services**: GPS-based location detection
- **Search Analytics**: Track search patterns and optimize

## 📊 **Filter Data Structure**

```javascript
const filterObject = {
  location: "New York City",
  checkIn: "2025-07-20",
  checkOut: "2025-07-25",
  guests: {
    adults: 2,
    children: 1,
    infants: 0,
  },
  priceRange: [100, 400],
  propertyType: "apartment",
  amenities: ["WiFi", "Pool", "Parking"],
};
```

This AdvancedSearchFilter component provides a comprehensive, modern search interface that matches the quality and functionality of leading travel platforms while maintaining excellent performance and accessibility across all devices and browsers.

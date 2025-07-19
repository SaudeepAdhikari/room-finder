# SajiloStay UI Component System

A modern, accessible, and responsive UI component library designed specifically for room booking and travel platforms. Built with React, featuring glassmorphism effects, vibrant gradients, and mobile-first design principles.

## 🌟 Features

- **Modern Design**: Glassmorphism effects with backdrop filters and transparency
- **Vibrant Gradients**: Eye-catching color schemes from #FF385C to #764ba2
- **Mobile-First**: Responsive design that works on all screen sizes
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **TypeScript Ready**: Full TypeScript support (when converted)
- **Customizable**: Easy theming with CSS custom properties
- **Performance**: Optimized with minimal re-renders and lazy loading

## 🎨 Design System

### Color Palette

- **Primary**: Vibrant gradient from pink (#FF385C) to purple (#764ba2)
- **Secondary**: Blue (#2196F3), Teal (#00BCD4), Orange (#FF9800)
- **Neutrals**: Complete gray scale from 50 to 900
- **Semantic**: Success, Warning, Error, and Info colors
- **Glassmorphism**: Transparent backgrounds with backdrop blur

### Typography

- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto')
- **Sizes**: xs (0.75rem) to 4xl (2.25rem)
- **Weights**: thin (100) to extrabold (800)

### Spacing

- **Scale**: 0.25rem increments (1-12, corresponding to 4px-48px)
- **Responsive**: Adaptive spacing for different screen sizes

## 📦 Components

### Button

Modern buttons with multiple variants and states.

```jsx
import { Button, PlusIcon, ChevronRightIcon } from './components/ui';

// Basic usage
<Button variant="primary" size="md">
  Click me
</Button>

// With icons
<Button
  variant="secondary"
  leftIcon={<PlusIcon />}
  rightIcon={<ChevronRightIcon />}
>
  Add Item
</Button>

// Loading state
<Button loading>Processing...</Button>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `leftIcon`, `rightIcon`: React nodes

### Input

Beautiful form inputs with glassmorphism styling.

```jsx
import { Input, SearchIcon, UserIcon } from './components/ui';

// Basic usage
<Input
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  variant="default"
/>

// With icons
<Input
  label="Search"
  placeholder="Search destinations..."
  leftIcon={<SearchIcon />}
  rightIcon={<SearchIcon />}
  onRightIconClick={() => console.log('Search clicked')}
/>

// Error state
<Input
  label="Name"
  error
  errorMessage="This field is required"
/>
```

**Props:**

- `variant`: 'default' | 'outlined' | 'filled'
- `size`: 'sm' | 'md' | 'lg'
- `error`: boolean
- `errorMessage`: string
- `helperText`: string
- `leftIcon`, `rightIcon`: React nodes

### Card

Versatile card components with glassmorphism effects.

```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui';

// Basic card
<Card variant="default" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card with image
<Card
  image="/path/to/image.jpg"
  imagePosition="top"
  clickable
  onClick={() => console.log('Card clicked')}
>
  <CardContent>
    <CardTitle>Property Name</CardTitle>
    <p>Beautiful oceanview suite...</p>
  </CardContent>
</Card>
```

**Props:**

- `variant`: 'default' | 'solid' | 'elevated' | 'gradient' | 'dark'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `hoverable`: boolean
- `clickable`: boolean
- `image`: string | React node
- `imagePosition`: 'top' | 'left' | 'right'

### Modal

Accessible modal dialogs with smooth animations.

```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./components/ui";

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  size="md"
  variant="default"
>
  <ModalBody>
    <p>Modal content...</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary">Confirm</Button>
  </ModalFooter>
</Modal>;
```

**Props:**

- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `variant`: 'default' | 'solid' | 'elevated' | 'dark'
- `closeOnOverlayClick`: boolean
- `closeOnEscape`: boolean

### Badge

Status indicators and notification badges.

```jsx
import { Badge, BadgeWrapper } from './components/ui';

// Basic badge
<Badge variant="primary">New</Badge>

// Count badge
<Badge variant="error" count={5} />

// Dot badge
<Badge variant="success" dot />

// Badge wrapper for positioning
<BadgeWrapper
  badge={<Badge variant="error" count={3} />}
  position="top-right"
>
  <Button>Notifications</Button>
</BadgeWrapper>
```

**Props:**

- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'light' | 'outline'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `count`: number
- `dot`: boolean
- `max`: number (default: 99)

### Navbar

Modern navigation bar with responsive design.

```jsx
import { Navbar, HomeIcon, SearchIcon, UserIcon } from "./components/ui";

const navItems = [
  { label: "Home", href: "/", icon: <HomeIcon />, active: true },
  { label: "Search", href: "/search", icon: <SearchIcon /> },
  {
    label: "Account",
    dropdown: [
      { label: "Profile", href: "/profile" },
      { label: "Settings", href: "/settings" },
      { divider: true },
      { label: "Sign Out", onClick: handleSignOut },
    ],
  },
];

<Navbar
  brand="🏠 SajiloStay"
  items={navItems}
  rightItems={[
    <Button key="signin" variant="primary">
      Sign In
    </Button>,
  ]}
  variant="default"
  sticky
/>;
```

**Props:**

- `brand`: React node
- `items`: Array of navigation items
- `rightItems`: Array of React nodes
- `variant`: 'default' | 'solid' | 'dark' | 'transparent'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `sticky`: boolean

## 🎨 Design System Utilities

The component library includes Tailwind-style utility classes:

### Spacing

```css
.p-4    /* padding: 1rem */
/* padding: 1rem */
.px-6   /* padding-left: 1.5rem; padding-right: 1.5rem */
.m-2    /* margin: 0.5rem */
.gap-4; /* gap: 1rem */
```

### Layout

```css
.flex            /* display: flex */
/* display: flex */
.grid            /* display: grid */
.items-center    /* align-items: center */
.justify-between; /* justify-content: space-between */
```

### Colors

```css
.text-primary    /* color: var(--primary-red) */
/* color: var(--primary-red) */
.bg-success      /* background-color: var(--success-primary) */
.border-gray-200; /* border-color: var(--gray-200) */
```

### Effects

```css
.glass           /* glassmorphism effect */
/* glassmorphism effect */
.shadow-lg       /* large shadow */
.rounded-xl      /* border-radius: 0.75rem */
.transition-all; /* smooth transitions */
```

## 🚀 Usage

### Installation

```bash
# Copy the components to your project
cp -r src/components/ui your-project/src/components/

# Install required dependencies
npm install react react-dom
```

### Import Components

```jsx
// Import individual components
import { Button, Input, Card } from "./components/ui";

// Or import everything
import * as UI from "./components/ui";
```

### Setup CSS

```jsx
// Import design system CSS in your main CSS file or index.js
import "./components/ui/design-system.css";
```

## 🎯 Examples

### Booking Form

```jsx
import { Card, Input, Button, Badge } from "./components/ui";

const BookingForm = () => (
  <Card variant="elevated" size="lg">
    <CardHeader>
      <CardTitle>Book Your Stay</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-4">
        <Input
          label="Destination"
          placeholder="Where to?"
          leftIcon={<MapPinIcon />}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Check-in" type="date" />
          <Input label="Check-out" type="date" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" dot />
          <span>Free cancellation</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="primary" size="lg" fullWidth>
        Search Rooms
      </Button>
    </CardFooter>
  </Card>
);
```

### Property Card

```jsx
const PropertyCard = ({ property }) => (
  <Card
    image={property.image}
    imagePosition="top"
    hoverable
    clickable
    onClick={() => navigate(`/property/${property.id}`)}
  >
    <CardContent>
      <div className="flex justify-between items-start mb-2">
        <CardTitle>{property.name}</CardTitle>
        <Badge variant="success">Available</Badge>
      </div>
      <p className="text-gray-600 mb-3">{property.location}</p>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">{/* Rating stars */}</div>
        <span className="text-sm text-gray-500">
          ({property.reviewCount} reviews)
        </span>
      </div>
    </CardContent>
    <CardFooter>
      <div className="flex justify-between items-center w-full">
        <div>
          <span className="text-2xl font-bold text-primary">
            ${property.price}
          </span>
          <span className="text-gray-500"> / night</span>
        </div>
        <Button variant="primary">Book Now</Button>
      </div>
    </CardFooter>
  </Card>
);
```

## 🔧 Customization

### CSS Custom Properties

Override the design system by modifying CSS custom properties:

```css
:root {
  /* Primary colors */
  --primary-red: #your-color;
  --primary-purple: #your-color;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(20px);

  /* Spacing (if needed) */
  --spacing-unit: 0.25rem;
}
```

### Component Styling

Each component can be styled using CSS classes:

```css
/* Custom button styling */
.my-custom-button {
  --primary-gradient: linear-gradient(45deg, #your-color1, #your-color2);
}

/* Custom card styling */
.my-custom-card {
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

## 📱 Responsive Behavior

All components are mobile-first and responsive:

- **Mobile (< 480px)**: Simplified layouts, larger touch targets
- **Tablet (480px - 768px)**: Adjusted spacing and sizing
- **Desktop (> 768px)**: Full feature set with hover effects

### Responsive Classes

```css
.sm:hidden     /* Hidden on small screens */
.md:grid-cols-2 /* 2 columns on medium screens */
.lg:text-xl    /* Extra large text on large screens */
```

## ♿ Accessibility

- **Keyboard Navigation**: All interactive elements support keyboard navigation
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations
- **Reduced Motion**: Respects user preferences for reduced motion

## 🌐 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 88+
- **Backdrop Filter**: Graceful degradation for older browsers

## 📄 License

This component library is part of the SajiloStay project. See the main project license for details.

## 🤝 Contributing

1. Follow the existing component patterns
2. Include proper TypeScript types (when converting)
3. Add accessibility features
4. Test on multiple screen sizes
5. Update documentation

## 🔗 Related

- [Color Palette Showcase](/colors) - Complete color system documentation
- [Property Card Component](/showcase) - Specialized room listing cards
- [Advanced Search Filter](/search-filter) - Complex search interface

---

**Demo**: Visit `/ui` to see all components in action with interactive examples and code snippets.

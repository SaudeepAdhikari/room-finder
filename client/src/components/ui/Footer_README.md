# Footer Component

A modern, responsive footer component designed for travel booking and room discovery platforms. Features glassmorphism effects, social media integration, newsletter signup, and comprehensive link organization.

## 🌟 Features

- **Modern Design**: Glassmorphism effects with subtle gradients and transparency
- **Responsive Layout**: Mobile-first design that adapts to all screen sizes
- **Newsletter Integration**: Built-in email subscription with validation and loading states
- **Social Media Links**: Ready-to-use social media icons with hover effects
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
- **Multiple Variants**: Different styling options to match your brand
- **Customizable**: Easy to customize with props and CSS custom properties

## 🎨 Variants

### Default

Dark gradient background with glassmorphism effects - perfect for modern travel sites.

### Glass

Enhanced transparency with backdrop blur effects - ideal for overlay layouts.

### Minimal

Clean light background for simple, professional applications.

### Dark

Deep dark background for sleek, modern applications.

## 📦 Installation

```jsx
import Footer from "./components/ui/Footer";
import "./components/ui/Footer.css";
```

## 🚀 Basic Usage

```jsx
import { Footer } from "./components/ui";

function App() {
  return (
    <div>
      {/* Your main content */}
      <Footer />
    </div>
  );
}
```

## 📋 Props

| Prop                 | Type     | Default             | Description                                                 |
| -------------------- | -------- | ------------------- | ----------------------------------------------------------- |
| `className`          | string   | `''`                | Additional CSS classes                                      |
| `variant`            | string   | `'default'`         | Footer style variant: 'default', 'glass', 'dark', 'minimal' |
| `showNewsletter`     | boolean  | `true`              | Show/hide newsletter signup section                         |
| `showSocial`         | boolean  | `true`              | Show/hide social media links                                |
| `companyName`        | string   | `'SajiloStay'`      | Company/brand name                                          |
| `companyDescription` | string   | Default description | Company description text                                    |
| `onNewsletterSubmit` | function | `undefined`         | Newsletter submission handler                               |
| `customLinks`        | object   | Default links       | Custom link sections                                        |

## 🎯 Advanced Usage

### Newsletter Integration

```jsx
const handleNewsletterSubmit = async (email) => {
  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Subscription failed");
    }

    return response.json();
  } catch (error) {
    throw new Error("Network error");
  }
};

<Footer
  variant="glass"
  onNewsletterSubmit={handleNewsletterSubmit}
  showNewsletter={true}
/>;
```

### Custom Link Structure

```jsx
const customLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press Kit", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Support", href: "/support" },
    { label: "Report Issue", href: "/report" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "GDPR", href: "/gdpr" },
  ],
  resources: [
    { label: "API Documentation", href: "/docs", external: true },
    { label: "Developer Portal", href: "/dev", external: true },
  ],
};

<Footer
  customLinks={customLinks}
  companyName="YourBrand"
  companyDescription="Your custom description here."
/>;
```

### Minimal Footer

```jsx
<Footer
  variant="minimal"
  showNewsletter={false}
  showSocial={true}
  companyName="CleanBrand"
  companyDescription="Simple. Clean. Professional."
/>
```

## 🔧 Customization

### CSS Custom Properties

Override default styling by modifying CSS custom properties:

```css
:root {
  /* Primary colors */
  --primary-red: #your-primary-color;
  --primary-purple: #your-secondary-color;

  /* Footer specific */
  --footer-bg-primary: rgba(17, 24, 39, 0.95);
  --footer-bg-secondary: rgba(31, 41, 55, 0.98);
  --footer-text-primary: #f3f4f6;
  --footer-text-secondary: #d1d5db;

  /* Glassmorphism */
  --footer-glass-bg: rgba(17, 24, 39, 0.8);
  --footer-glass-blur: blur(20px);
}
```

### Custom Styling

```css
/* Custom footer styling */
.my-custom-footer {
  --footer-bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.my-custom-footer .footer-brand {
  text-align: center;
}

.my-custom-footer .social-link {
  background: rgba(255, 255, 255, 0.2);
}
```

## 📱 Responsive Behavior

The footer automatically adapts to different screen sizes:

- **Desktop (1024px+)**: Three-column layout with full feature set
- **Tablet (768px-1023px)**: Adjusted spacing and column layout
- **Mobile (< 768px)**: Single-column stacked layout
- **Small Mobile (< 480px)**: Compact spacing and simplified newsletter form

## ♿ Accessibility Features

- **Keyboard Navigation**: All interactive elements support tab navigation
- **Screen Readers**: Proper ARIA labels and semantic HTML structure
- **Focus Management**: Visible focus indicators and logical tab order
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user preferences for reduced motion

## 🔗 Link Structure

### Default Link Organization

```jsx
const defaultLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Safety", href: "/safety" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refunds" },
  ],
  hosting: [
    { label: "Host Your Property", href: "/host" },
    { label: "Host Resources", href: "/host-resources" },
    { label: "Community Forum", href: "/community" },
    { label: "Host Insurance", href: "/host-insurance" },
  ],
};
```

## 🌐 Social Media Integration

### Supported Platforms

- **Facebook** - Facebook page link
- **Twitter** - Twitter profile link
- **Instagram** - Instagram profile link
- **LinkedIn** - LinkedIn company page
- **YouTube** - YouTube channel link

### Custom Social Links

```jsx
// To customize social links, modify the socialLinks array in Footer.js
const customSocialLinks = [
  {
    icon: FaFacebookF,
    href: "https://facebook.com/yourpage",
    label: "Facebook",
  },
  { icon: FaTwitter, href: "https://twitter.com/yourhandle", label: "Twitter" },
  {
    icon: FaInstagram,
    href: "https://instagram.com/youraccount",
    label: "Instagram",
  },
  // Add more platforms as needed
];
```

## 📧 Newsletter Features

### Validation

- Email format validation
- Required field validation
- Real-time feedback

### States

- Loading state with spinner
- Success message
- Error handling
- Privacy notice

### Integration

```jsx
const handleNewsletterSubmit = async (email) => {
  // Your newsletter API integration
  const response = await subscribeToNewsletter(email);
  return response;
};
```

## 🎨 Examples

### Travel Booking Site

```jsx
<Footer
  variant="default"
  companyName="TravelCo"
  companyDescription="Discover amazing destinations and create unforgettable memories with our curated travel experiences."
  onNewsletterSubmit={handleSubscription}
/>
```

### Minimal Business Site

```jsx
<Footer
  variant="minimal"
  showNewsletter={false}
  companyName="BusinessCorp"
  customLinks={{
    company: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
    ],
    legal: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  }}
/>
```

### Dark Theme Site

```jsx
<Footer
  variant="dark"
  companyName="DarkTheme"
  companyDescription="Modern, sleek, and professional."
  showSocial={true}
  showNewsletter={true}
/>
```

## 🔧 Development

### File Structure

```
Footer.js          # Main component
Footer.css         # Styling
FooterDemo.js      # Demo page
FooterDemo.css     # Demo styling
```

### Testing

- Component renders correctly
- Newsletter form validation
- Responsive behavior
- Accessibility compliance
- Social link functionality

## 🌟 Best Practices

1. **Keep Links Organized**: Group related links into logical sections
2. **Mobile-First**: Test on mobile devices first
3. **Accessibility**: Always include proper ARIA labels
4. **Performance**: Lazy load social media scripts if needed
5. **SEO**: Use semantic HTML structure
6. **Legal Compliance**: Include required legal links for your region

## 🆕 Version History

- **v1.0.0**: Initial release with all variants and features
- Core functionality: Newsletter, social links, responsive design
- Accessibility: WCAG 2.1 AA compliance
- Customization: CSS custom properties and props

---

**Demo**: Visit `/footer` to see the Footer component in action with all variants and features.

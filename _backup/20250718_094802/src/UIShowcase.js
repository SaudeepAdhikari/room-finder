import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Badge, BadgeWrapper,
  Navbar,
  Footer
} from './components/ui';
// Import icons from specific components to avoid conflicts
import { ChevronRightIcon, PlusIcon, SearchIcon as ButtonSearchIcon, HeartIcon, BookmarkIcon } from './components/ui/Button';
import { UserIcon, MailIcon, PhoneIcon, LockIcon, CalendarIcon, MapPinIcon, SearchIcon as InputSearchIcon } from './components/ui/Input';
import { HomeIcon, BellIcon } from './components/ui/Navbar';
import './components/ui/design-system.css';
import './UIShowcase.css';

const UIShowcase = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    date: ''
  });

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const navItems = [
    { label: 'Home', href: '#', icon: <HomeIcon />, active: true },
    { label: 'Explore', href: '#', icon: <ButtonSearchIcon /> },
    { 
      label: 'Bookings', 
      href: '#',
      badge: <Badge variant="primary" size="xs" count={3} />
    },
    {
      label: 'More',
      dropdown: [
        { label: 'Profile', href: '#', icon: <UserIcon /> },
        { label: 'Settings', href: '#' },
        { divider: true },
        { label: 'Sign Out', href: '#' }
      ]
    }
  ];

  const rightNavItems = [
    <BadgeWrapper 
      key="notifications"
      badge={<Badge variant="error" size="xs" dot />}
      position="top-right"
    >
      <Button variant="ghost" size="sm">
        <BellIcon />
      </Button>
    </BadgeWrapper>,
    <Button key="login" variant="primary" size="sm">
      Sign In
    </Button>
  ];

  return (
    <div className="ui-showcase">
      {/* Navigation */}
      <Navbar
        brand="🏠 SajiloStay"
        items={navItems}
        rightItems={rightNavItems}
        variant="default"
        size="md"
        sticky
      />

      <div className="showcase-container">
        {/* Hero Section */}
        <section className="showcase-hero">
          <div className="hero-content">
            <h1 className="hero-title">Complete UI Component System</h1>
            <p className="hero-description">
              A modern, accessible, and responsive component library for room booking platforms.
              Built with glassmorphism effects, vibrant gradients, and mobile-first design.
            </p>
            <div className="hero-actions">
              <Button size="lg" leftIcon={<ButtonSearchIcon />}>
                Explore Components
              </Button>
              <Button variant="outline" size="lg" rightIcon={<ChevronRightIcon />}>
                View Documentation
              </Button>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="showcase-section">
          <h2 className="section-title">Buttons</h2>
          <p className="section-description">
            Modern buttons with glassmorphism effects, vibrant gradients, and responsive design.
          </p>
          
          <div className="component-grid">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different styles for various use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="button-showcase">
                  <div className="button-row">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                  <div className="button-row">
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="error">Error</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Button Sizes & Icons</CardTitle>
                <CardDescription>Various sizes with icon support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="button-showcase">
                  <div className="button-row">
                    <Button size="xs" leftIcon={<PlusIcon />}>Extra Small</Button>
                    <Button size="sm" leftIcon={<HeartIcon />}>Small</Button>
                    <Button size="md" rightIcon={<ChevronRightIcon />}>Medium</Button>
                  </div>
                  <div className="button-row">
                    <Button size="lg" leftIcon={<BookmarkIcon />}>Large</Button>
                    <Button size="xl" rightIcon={<ButtonSearchIcon />}>Extra Large</Button>
                  </div>
                  <div className="button-row">
                    <Button fullWidth leftIcon={<PlusIcon />} rightIcon={<ChevronRightIcon />}>
                      Full Width Button
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="showcase-section">
          <h2 className="section-title">Input Fields</h2>
          <p className="section-description">
            Beautiful form inputs with glassmorphism styling and comprehensive validation.
          </p>
          
          <div className="component-grid">
            <Card>
              <CardHeader>
                <CardTitle>Input Variants</CardTitle>
                <CardDescription>Different styles and states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="input-showcase">
                  <Input
                    label="Default Input"
                    placeholder="Enter your name"
                    variant="default"
                    leftIcon={<UserIcon />}
                    value={formData.name}
                    onChange={handleInputChange('name')}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    variant="outlined"
                    leftIcon={<MailIcon />}
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    helperText="We'll never share your email"
                  />
                  
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    variant="filled"
                    leftIcon={<LockIcon />}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                  />
                  
                  <Input
                    label="Location"
                    placeholder="Search destination"
                    leftIcon={<MapPinIcon />}
                    rightIcon={<InputSearchIcon />}
                    value={formData.location}
                    onChange={handleInputChange('location')}
                    onRightIconClick={() => alert('Search clicked!')}
                  />
                  
                  <Input
                    label="Check-in Date"
                    type="date"
                    leftIcon={<CalendarIcon />}
                    value={formData.date}
                    onChange={handleInputChange('date')}
                  />
                  
                  <Input
                    label="Error State"
                    placeholder="Invalid input"
                    error
                    errorMessage="This field is required"
                    leftIcon={<UserIcon />}
                  />
                  
                  <Input
                    label="Disabled Input"
                    placeholder="Cannot edit"
                    disabled
                    value="Disabled value"
                    leftIcon={<UserIcon />}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input Sizes</CardTitle>
                <CardDescription>Different sizes for various use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="input-showcase">
                  <Input
                    size="sm"
                    placeholder="Small input"
                    leftIcon={<ButtonSearchIcon />}
                  />
                  <Input
                    size="md"
                    placeholder="Medium input (default)"
                    leftIcon={<ButtonSearchIcon />}
                  />
                  <Input
                    size="lg"
                    placeholder="Large input"
                    leftIcon={<ButtonSearchIcon />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cards Section */}
        <section className="showcase-section">
          <h2 className="section-title">Cards</h2>
          <p className="section-description">
            Versatile card components with glassmorphism effects and multiple variants.
          </p>
          
          <div className="component-grid">
            <Card variant="default" hoverable>
              <CardHeader>
                <CardTitle>Glassmorphism Card</CardTitle>
                <CardDescription>Default card with glass effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card uses the default glassmorphism styling with backdrop blur and transparent background.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="primary">Action</Button>
                <Button size="sm" variant="ghost">Cancel</Button>
              </CardFooter>
            </Card>

            <Card 
              variant="solid" 
              clickable 
              onClick={() => alert('Card clicked!')}
              image="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              imagePosition="top"
            >
              <CardContent>
                <CardTitle>Clickable Card with Image</CardTitle>
                <CardDescription>
                  Beautiful oceanview suite with modern amenities. Click anywhere on this card to interact.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <div className="card-price">
                  <span className="price">$299</span>
                  <span className="period">/ night</span>
                </div>
                <BadgeWrapper badge={<Badge variant="success" size="sm">Available</Badge>}>
                  <Button size="sm" fullWidth>Book Now</Button>
                </BadgeWrapper>
              </CardFooter>
            </Card>

            <Card variant="elevated" size="lg">
              <CardContent>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>
                  This card has enhanced shadows and elevation for important content.
                </CardDescription>
                <div className="feature-list">
                  <div className="feature-item">
                    <Badge variant="primary" size="sm">Premium</Badge>
                    <span>Premium features included</span>
                  </div>
                  <div className="feature-item">
                    <Badge variant="success" size="sm" dot />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              variant="gradient" 
              image="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              imagePosition="left"
              hoverable
            >
              <CardContent>
                <CardTitle>Gradient Border Card</CardTitle>
                <CardDescription>
                  Modern apartment with gradient border styling and side image layout.
                </CardDescription>
                <div className="amenities">
                  <Badge variant="outline" size="sm">WiFi</Badge>
                  <Badge variant="outline" size="sm">Pool</Badge>
                  <Badge variant="outline" size="sm">Parking</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="showcase-section">
          <h2 className="section-title">Badges</h2>
          <p className="section-description">
            Status indicators and notification badges with various styles and animations.
          </p>
          
          <div className="component-grid">
            <Card>
              <CardHeader>
                <CardTitle>Badge Variants</CardTitle>
                <CardDescription>Different styles for various use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="badge-showcase">
                  <div className="badge-row">
                    <Badge>Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                  </div>
                  <div className="badge-row">
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="light">Light</Badge>
                  </div>
                  <div className="badge-row">
                    <Badge variant="primary-light">Primary Light</Badge>
                    <Badge variant="success-light">Success Light</Badge>
                    <Badge variant="warning-light">Warning Light</Badge>
                    <Badge variant="error-light">Error Light</Badge>
                  </div>
                  <div className="badge-row">
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="primary-outline">Primary Outline</Badge>
                    <Badge variant="success-outline">Success Outline</Badge>
                    <Badge variant="error-outline">Error Outline</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Sizes & Counts</CardTitle>
                <CardDescription>Different sizes and notification counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="badge-showcase">
                  <div className="badge-row">
                    <Badge size="xs" variant="primary">XS</Badge>
                    <Badge size="sm" variant="primary">SM</Badge>
                    <Badge size="md" variant="primary">MD</Badge>
                    <Badge size="lg" variant="primary">LG</Badge>
                    <Badge size="xl" variant="primary">XL</Badge>
                  </div>
                  <div className="badge-row">
                    <Badge variant="error" count={1} />
                    <Badge variant="error" count={5} />
                    <Badge variant="error" count={25} />
                    <Badge variant="error" count={100} max={99} />
                    <Badge variant="warning" count={1000} max={999} />
                  </div>
                  <div className="badge-row">
                    <Badge variant="success" dot size="sm" />
                    <Badge variant="warning" dot size="md" />
                    <Badge variant="error" dot size="lg" />
                    <Badge variant="primary" dot size="xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Positioning</CardTitle>
                <CardDescription>Badges positioned on other elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="badge-positioning-showcase">
                  <BadgeWrapper badge={<Badge variant="error" count={3} />} position="top-right">
                    <Button variant="secondary" size="lg">
                      <BellIcon />
                      Notifications
                    </Button>
                  </BadgeWrapper>
                  
                  <BadgeWrapper badge={<Badge variant="success" dot />} position="top-left">
                    <div className="avatar">
                      <UserIcon />
                    </div>
                  </BadgeWrapper>
                  
                  <BadgeWrapper badge={<Badge variant="primary" count={12} />} position="bottom-right">
                    <Button variant="outline">
                      Messages
                    </Button>
                  </BadgeWrapper>
                  
                  <BadgeWrapper badge={<Badge variant="warning" count={99} max={99} />} position="top-center">
                    <Card size="sm" className="mini-card">
                      <CardContent>
                        <CardTitle>Inbox</CardTitle>
                      </CardContent>
                    </Card>
                  </BadgeWrapper>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Modal Section */}
        <section className="showcase-section">
          <h2 className="section-title">Modals</h2>
          <p className="section-description">
            Accessible modal dialogs with glassmorphism effects and smooth animations.
          </p>
          
          <div className="component-grid">
            <Card>
              <CardHeader>
                <CardTitle>Modal Examples</CardTitle>
                <CardDescription>Click to open different modal variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="modal-showcase">
                  <Button onClick={() => setModalOpen(true)}>
                    Open Modal
                  </Button>
                  <Button variant="secondary">
                    Large Modal
                  </Button>
                  <Button variant="outline">
                    Form Modal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Integration Example */}
        <section className="showcase-section">
          <h2 className="section-title">Component Integration</h2>
          <p className="section-description">
            Real-world example showing how components work together.
          </p>
          
          <Card variant="elevated" size="lg">
            <CardHeader>
              <CardTitle>Book Your Perfect Stay</CardTitle>
              <CardDescription>Complete booking form with all UI components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="booking-form">
                <div className="form-row">
                  <Input
                    label="Destination"
                    placeholder="Where are you going?"
                    leftIcon={<MapPinIcon />}
                    rightIcon={<InputSearchIcon />}
                    fullWidth
                  />
                </div>
                
                <div className="form-row">
                  <Input
                    label="Check-in"
                    type="date"
                    leftIcon={<CalendarIcon />}
                  />
                  <Input
                    label="Check-out"
                    type="date"
                    leftIcon={<CalendarIcon />}
                  />
                </div>
                
                <div className="form-row">
                  <Input
                    label="Guests"
                    placeholder="2 guests"
                    leftIcon={<UserIcon />}
                  />
                </div>
                
                <div className="form-features">
                  <div className="feature-item">
                    <Badge variant="success" size="sm" dot />
                    <span>Free cancellation</span>
                  </div>
                  <div className="feature-item">
                    <Badge variant="primary" size="sm" dot />
                    <span>Instant booking</span>
                  </div>
                  <div className="feature-item">
                    <Badge variant="info" size="sm" dot />
                    <span>Best price guarantee</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" fullWidth leftIcon={<ButtonSearchIcon />}>
                Search Available Rooms
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Footer Component */}
        <section className="showcase-section">
          <h2 className="section-title">Footer Component</h2>
          <p className="section-description">
            Modern, responsive footer with glassmorphism effects and social links.
          </p>
          
          <div className="component-demo">
            <h3 className="demo-title">Default Footer</h3>
            <div className="footer-preview">
              <Footer 
                variant="default"
                onNewsletterSubmit={(email) => {
                  console.log('Newsletter signup:', email);
                  return Promise.resolve();
                }}
              />
            </div>
          </div>

          <div className="component-demo">
            <h3 className="demo-title">Glass Footer</h3>
            <div className="footer-preview">
              <Footer 
                variant="glass"
                showNewsletter={true}
                showSocial={true}
                companyName="TravelCo"
                companyDescription="Discover amazing places and create unforgettable memories."
              />
            </div>
          </div>

          <div className="component-demo">
            <h3 className="demo-title">Minimal Footer</h3>
            <div className="footer-preview minimal-preview">
              <Footer 
                variant="minimal"
                showNewsletter={false}
                companyName="MinimalStay"
                companyDescription="Simple. Clean. Beautiful."
                customLinks={{
                  company: [
                    { label: 'About', href: '/about' },
                    { label: 'Careers', href: '/careers' }
                  ],
                  support: [
                    { label: 'Help', href: '/help' },
                    { label: 'Contact', href: '/contact' }
                  ],
                  legal: [
                    { label: 'Terms', href: '/terms' },
                    { label: 'Privacy', href: '/privacy' }
                  ]
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Welcome to SajiloStay"
        size="md"
        variant="default"
      >
        <ModalBody>
          <div className="modal-content-showcase">
            <p>
              This is a beautiful modal with glassmorphism effects. It includes proper focus management,
              keyboard navigation, and accessibility features.
            </p>
            
            <div className="modal-form">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                leftIcon={<MailIcon />}
                fullWidth
              />
              
              <div className="form-actions">
                <Badge variant="info" size="sm">
                  We'll send you exclusive deals
                </Badge>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Subscribe
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UIShowcase;

import React from 'react';
import Footer from './components/ui/Footer';
import './FooterDemo.css';

const FooterDemo = () => {
  const handleNewsletterSubmit = (email) => {
    console.log('Newsletter subscription for:', email);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="footer-demo">
      {/* Main Content */}
      <div className="demo-content">
        <div className="demo-container">
          <h1 className="demo-title">Footer Component Demo</h1>
          <p className="demo-description">
            Experience our modern, responsive footer component in action. 
            This page demonstrates how the footer looks and functions in a real-world scenario.
          </p>

          {/* Sample Content Cards */}
          <div className="demo-cards">
            <div className="demo-card">
              <h3>Modern Design</h3>
              <p>Beautiful glassmorphism effects with subtle backgrounds and smooth animations.</p>
            </div>
            <div className="demo-card">
              <h3>Responsive Layout</h3>
              <p>Adapts perfectly to all screen sizes with mobile-first design principles.</p>
            </div>
            <div className="demo-card">
              <h3>Accessibility First</h3>
              <p>WCAG compliant with proper keyboard navigation and screen reader support.</p>
            </div>
          </div>

          {/* Footer Variants Section */}
          <div className="variants-section">
            <h2>Footer Variants</h2>
            <div className="variant-grid">
              <div className="variant-item">
                <h4>Default</h4>
                <p>Dark gradient background with glassmorphism effects</p>
              </div>
              <div className="variant-item">
                <h4>Glass</h4>
                <p>Enhanced transparency with backdrop blur effects</p>
              </div>
              <div className="variant-item">
                <h4>Minimal</h4>
                <p>Clean light background for simple, professional sites</p>
              </div>
              <div className="variant-item">
                <h4>Dark</h4>
                <p>Deep dark background for modern, sleek applications</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              <div className="feature">
                <span className="feature-icon">📱</span>
                <h4>Mobile Responsive</h4>
                <p>Optimized layout that works perfectly on all devices and screen sizes.</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🎨</span>
                <h4>Customizable</h4>
                <p>Easy to customize with CSS custom properties and multiple variants.</p>
              </div>
              <div className="feature">
                <span className="feature-icon">📧</span>
                <h4>Newsletter Signup</h4>
                <p>Built-in newsletter subscription with validation and loading states.</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🔗</span>
                <h4>Social Integration</h4>
                <p>Ready-to-use social media links with hover effects and animations.</p>
              </div>
              <div className="feature">
                <span className="feature-icon">♿</span>
                <h4>Accessible</h4>
                <p>WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation.</p>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <h4>Performance</h4>
                <p>Lightweight and optimized for fast loading and smooth animations.</p>
              </div>
            </div>
          </div>

          {/* Spacer to push footer down */}
          <div className="content-spacer"></div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer
        variant="default"
        showNewsletter={true}
        showSocial={true}
        companyName="SajiloStay"
        companyDescription="Your trusted partner for finding the perfect stay, anywhere in the world. Discover amazing accommodations and create unforgettable memories."
        onNewsletterSubmit={handleNewsletterSubmit}
      />
    </div>
  );
};

export default FooterDemo;

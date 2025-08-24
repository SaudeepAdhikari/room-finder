import React, { useState } from 'react';
import './Footer.css';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPaperPlane,
  FaHeart,
  FaGlobe,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
const Footer = ({
  className = '',
  variant = 'default', // default, glass, dark, minimal
  showNewsletter = true,
  showSocial = true,
  companyName = 'SajiloStay',
  companyDescription = 'Your trusted partner for finding the perfect stay, anywhere in the world.',
  onNewsletterSubmit,
  customLinks = null
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const defaultLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety', href: '/safety' },
      { label: 'FAQ', href: '/faq' }
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refunds' }
    ]
    // Removed hosting
  };

  const links = customLinks || defaultLinks;

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' }
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      if (onNewsletterSubmit) {
        await onNewsletterSubmit(email);
      }
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }

    // Clear status after 3 seconds
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const LinkSection = ({ title, links }) => (
    <div className="footer-link-section">
      <h4 className="footer-section-title">{title}</h4>
      <ul className="footer-links">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="footer-link"
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className={`footer ${variant} ${className}`}>
      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🏠</span>
              <span className="logo-text">{companyName}</span>
            </div>
            <p className="footer-description">{companyDescription}</p>

            {/* Contact Info */}
            <div className="footer-contact">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <a href="tel:+977-9842064469" className="footer-link">+977-9842064469</a>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:hello@sajilostay.com" className="footer-link">hello@sajilostay.com</a>
              </div>
              <div className="contact-item">
                <FaGlobe className="contact-icon" />
                <a href="/" className="footer-link">Available worldwide</a>
              </div>
            </div>

            {/* Social Links */}
            {showSocial && (
              <div className="footer-social">
                <span className="social-title">Follow us</span>
                <div className="social-links">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="social-link"
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Link Sections */}
          <div className="footer-links-grid">
            <LinkSection title="Company" links={links.company} />
            <LinkSection title="Support" links={links.support} />
            <LinkSection title="Legal" links={links.legal} />
          </div>

          {/* Newsletter Section */}
          {showNewsletter && (
            <div className="footer-newsletter">
              <h4 className="newsletter-title">Stay Updated</h4>
              <p className="newsletter-description">
                Get the latest deals and travel inspiration delivered to your inbox.
              </p>

              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="newsletter-input"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    className="newsletter-submit"
                    disabled={isSubmitting || !email.trim()}
                    aria-label="Subscribe to newsletter"
                  >
                    {isSubmitting ? (
                      <div className="spinner"></div>
                    ) : (
                      <FaPaperPlane />
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="newsletter-status success">
                    ✅ Successfully subscribed to our newsletter!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="newsletter-status error">
                    ❌ Something went wrong. Please try again.
                  </div>
                )}
              </form>

              <p className="newsletter-privacy">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            {/* Copyright */}
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} SajiloStay. All rights reserved.
            </div>
            <div className="footer-credit" style={{ marginTop: 8, fontSize: 15, color: 'inherit', textAlign: 'center', letterSpacing: 0.1 }}>
              Designed and Developed by <a href="https://saudeepadhikari.com.np/" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline', fontWeight: 500 }}>Saudeep Adhikari</a>
            </div>

            <div className="footer-bottom-links">
              <a href="/terms" className="footer-bottom-link">Terms</a>
              <span className="separator">•</span>
              <a href="/privacy" className="footer-bottom-link">Privacy</a>
              <span className="separator">•</span>
              <a href="/cookies" className="footer-bottom-link">Cookies</a>
              <span className="separator">•</span>
              <a href="/sitemap" className="footer-bottom-link">Sitemap</a>
            </div>

            <div className="footer-made-with">
              <span>Made with</span>
              <FaHeart className="heart-icon" />
              <span>for travelers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="footer-bg-element footer-bg-1"></div>
      <div className="footer-bg-element footer-bg-2"></div>
    </footer>
  );
};

// Sample usage data
Footer.sampleData = {
  companyName: 'SajiloStay',
  companyDescription: 'Your trusted partner for finding the perfect stay, anywhere in the world.',
  customLinks: {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' }
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' }
    ]
  }
};

export default Footer;

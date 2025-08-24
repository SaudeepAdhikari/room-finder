import React, { useState } from 'react';
import './ColorPaletteShowcase.css';

const ColorPaletteShowcase = () => {
  const [copiedColor, setCopiedColor] = useState('');

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(''), 2000);
  };

  const ColorSwatch = ({ color, name, description, cssVar }) => (
    <div 
      className="color-swatch" 
      onClick={() => copyToClipboard(cssVar || color)}
      title={`Click to copy: ${cssVar || color}`}
    >
      <div 
        className="color-preview" 
        style={{ backgroundColor: color }}
      ></div>
      <div className="color-info">
        <h4 className="color-name">{name}</h4>
        <p className="color-description">{description}</p>
        <code className="color-value">{cssVar || color}</code>
        {copiedColor === (cssVar || color) && (
          <span className="copied-indicator">Copied!</span>
        )}
      </div>
    </div>
  );

  const GradientSwatch = ({ gradient, name, description, cssVar }) => (
    <div 
      className="gradient-swatch"
      onClick={() => copyToClipboard(cssVar)}
      title={`Click to copy: ${cssVar}`}
    >
      <div 
        className="gradient-preview"
        style={{ background: gradient }}
      ></div>
      <div className="gradient-info">
        <h4 className="gradient-name">{name}</h4>
        <p className="gradient-description">{description}</p>
        <code className="gradient-value">{cssVar}</code>
        {copiedColor === cssVar && (
          <span className="copied-indicator">Copied!</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="color-palette-showcase">
      {/* Hero Section */}
      <div className="palette-hero">
        <div className="hero-content">
          <h1 className="hero-title">SajiloStay Color Palette</h1>
          <p className="hero-description">
            A vibrant, modern color system designed for premium travel experiences.
            Click any color to copy its CSS variable.
          </p>
        </div>
      </div>

      <div className="palette-container">
        {/* Primary Brand Colors */}
        <section className="palette-section">
          <h2 className="section-title">Primary Brand Colors</h2>
          <p className="section-description">
            The core brand identity with vibrant gradient from pink to purple
          </p>
          
          <div className="color-grid">
            <ColorSwatch
              color="#FF385C"
              name="Primary Red"
              description="Main brand color for CTAs and highlights"
              cssVar="--primary-red"
            />
            <ColorSwatch
              color="#FF5A7A"
              name="Primary Red Light"
              description="Lighter variant for hover states"
              cssVar="--primary-red-light"
            />
            <ColorSwatch
              color="#E91E63"
              name="Primary Red Dark"
              description="Darker variant for active states"
              cssVar="--primary-red-dark"
            />
            <ColorSwatch
              color="#764ba2"
              name="Primary Purple"
              description="Secondary brand color for depth"
              cssVar="--primary-purple"
            />
            <ColorSwatch
              color="#8E24AA"
              name="Primary Purple Light"
              description="Lighter purple for gradients"
              cssVar="--primary-purple-light"
            />
            <ColorSwatch
              color="#512DA8"
              name="Primary Purple Dark"
              description="Deep purple for contrast"
              cssVar="--primary-purple-dark"
            />
          </div>

          <div className="gradient-showcase">
            <h3>Primary Gradients</h3>
            <div className="gradient-grid">
              <GradientSwatch
                gradient="linear-gradient(135deg, #FF385C 0%, #764ba2 100%)"
                name="Primary Gradient"
                description="Main brand gradient for buttons and highlights"
                cssVar="--primary-gradient"
              />
              <GradientSwatch
                gradient="linear-gradient(135deg, #E91E63 0%, #6A1B9A 100%)"
                name="Primary Gradient Hover"
                description="Darker variant for hover interactions"
                cssVar="--primary-gradient-hover"
              />
              <GradientSwatch
                gradient="linear-gradient(135deg, #C2185B 0%, #4A148C 100%)"
                name="Primary Gradient Active"
                description="Darkest variant for active states"
                cssVar="--primary-gradient-active"
              />
            </div>
          </div>
        </section>

        {/* Secondary Colors */}
        <section className="palette-section">
          <h2 className="section-title">Secondary Colors</h2>
          <p className="section-description">
            Supporting colors for variety and visual interest
          </p>
          
          <div className="color-grid">
            <ColorSwatch
              color="#2196F3"
              name="Secondary Blue"
              description="Trust and reliability"
              cssVar="--secondary-blue"
            />
            <ColorSwatch
              color="#00BCD4"
              name="Secondary Teal"
              description="Fresh and modern accent"
              cssVar="--secondary-teal"
            />
            <ColorSwatch
              color="#FF9800"
              name="Secondary Orange"
              description="Warmth and energy"
              cssVar="--secondary-orange"
            />
          </div>
        </section>

        {/* Neutral Colors */}
        <section className="palette-section">
          <h2 className="section-title">Neutral Colors</h2>
          <p className="section-description">
            Essential grays for text, backgrounds, and UI elements
          </p>
          
          <div className="color-grid neutrals">
            <ColorSwatch color="#FAFAFA" name="Gray 50" description="Lightest background" cssVar="--gray-50" />
            <ColorSwatch color="#F5F5F5" name="Gray 100" description="Very light background" cssVar="--gray-100" />
            <ColorSwatch color="#EEEEEE" name="Gray 200" description="Light border color" cssVar="--gray-200" />
            <ColorSwatch color="#E0E0E0" name="Gray 300" description="Medium border color" cssVar="--gray-300" />
            <ColorSwatch color="#BDBDBD" name="Gray 400" description="Disabled text" cssVar="--gray-400" />
            <ColorSwatch color="#9E9E9E" name="Gray 500" description="Placeholder text" cssVar="--gray-500" />
            <ColorSwatch color="#757575" name="Gray 600" description="Secondary text" cssVar="--gray-600" />
            <ColorSwatch color="#616161" name="Gray 700" description="Primary text light" cssVar="--gray-700" />
            <ColorSwatch color="#424242" name="Gray 800" description="Primary text" cssVar="--gray-800" />
            <ColorSwatch color="#212121" name="Gray 900" description="Darkest text" cssVar="--gray-900" />
          </div>
        </section>

        {/* Dark Mode Colors */}
        <section className="palette-section dark-mode">
          <h2 className="section-title">Dark Mode Colors</h2>
          <p className="section-description">
            Midnight blue palette for premium dark mode experience
          </p>
          
          <div className="color-grid">
            <ColorSwatch
              color="#0A0E1A"
              name="Dark Background Primary"
              description="Main dark background"
              cssVar="--dark-bg-primary"
            />
            <ColorSwatch
              color="#151B2D"
              name="Dark Background Secondary"
              description="Secondary dark background"
              cssVar="--dark-bg-secondary"
            />
            <ColorSwatch
              color="#1E2742"
              name="Dark Background Tertiary"
              description="Elevated dark background"
              cssVar="--dark-bg-tertiary"
            />
            <ColorSwatch
              color="#FFFFFF"
              name="Dark Text Primary"
              description="Primary text on dark"
              cssVar="--dark-text-primary"
            />
            <ColorSwatch
              color="#B3B8D4"
              name="Dark Text Secondary"
              description="Secondary text on dark"
              cssVar="--dark-text-secondary"
            />
            <ColorSwatch
              color="#8B91B5"
              name="Dark Text Tertiary"
              description="Tertiary text on dark"
              cssVar="--dark-text-tertiary"
            />
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="palette-section">
          <h2 className="section-title">Semantic Colors</h2>
          <p className="section-description">
            Status and feedback colors for user interface states
          </p>
          
          <div className="color-grid">
            <ColorSwatch
              color="#4CAF50"
              name="Success"
              description="Success states and confirmations"
              cssVar="--success-primary"
            />
            <ColorSwatch
              color="#FF9800"
              name="Warning"
              description="Warning states and cautions"
              cssVar="--warning-primary"
            />
            <ColorSwatch
              color="#F44336"
              name="Error"
              description="Error states and alerts"
              cssVar="--error-primary"
            />
            <ColorSwatch
              color="#2196F3"
              name="Info"
              description="Information and tips"
              cssVar="--info-primary"
            />
          </div>
        </section>

        {/* Background Gradients */}
        <section className="palette-section">
          <h2 className="section-title">Background Gradients</h2>
          <p className="section-description">
            Playful and premium gradient backgrounds for hero sections
          </p>
          
          <div className="gradient-grid large">
            <GradientSwatch
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"
              name="Hero Gradient 1"
              description="Multi-color vibrant gradient"
              cssVar="--hero-gradient-1"
            />
            <GradientSwatch
              gradient="linear-gradient(135deg, #FF385C 0%, #FF6B9D 25%, #8B5CF6 50%, #764ba2 75%, #2196F3 100%)"
              name="Hero Gradient 2"
              description="Brand-focused gradient"
              cssVar="--hero-gradient-2"
            />
            <GradientSwatch
              gradient="radial-gradient(circle at 30% 40%, #FF385C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #2196F3 0%, transparent 50%)"
              name="Hero Gradient 3"
              description="Radial multi-point gradient"
              cssVar="--hero-gradient-3"
            />
          </div>
        </section>

        {/* Interactive States Demo */}
        <section className="palette-section">
          <h2 className="section-title">Interactive States</h2>
          <p className="section-description">
            Hover, active, and focus states with live demonstrations
          </p>
          
          <div className="interactive-demo">
            <button className="demo-btn btn-primary">
              Primary Button
              <span className="btn-description">Hover to see gradient shift</span>
            </button>
            
            <button className="demo-btn btn-secondary">
              Secondary Button
              <span className="btn-description">Glass morphism effect</span>
            </button>
            
            <div className="demo-card hover-lift">
              <h4>Hover Lift Card</h4>
              <p>Elevates on hover with shadow</p>
            </div>
            
            <div className="demo-card hover-glow">
              <h4>Hover Glow Card</h4>
              <p>Glows with brand color on hover</p>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="palette-section">
          <h2 className="section-title">Usage Guidelines</h2>
          
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h3>🎨 Primary Colors</h3>
              <ul>
                <li>Use primary gradient for main CTAs</li>
                <li>Primary red for highlights and links</li>
                <li>Primary purple for secondary actions</li>
                <li>Maintain 4.5:1 contrast ratio minimum</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h3>🌙 Dark Mode</h3>
              <ul>
                <li>Use midnight blue backgrounds for premium feel</li>
                <li>Maintain brand colors for consistency</li>
                <li>Increase glass opacity for better visibility</li>
                <li>Use lighter text colors for readability</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h3>✨ Glassmorphism</h3>
              <ul>
                <li>Use backdrop-blur for glass effects</li>
                <li>Layer with semi-transparent backgrounds</li>
                <li>Add subtle borders for definition</li>
                <li>Apply multi-layered shadows for depth</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h3>🎯 Interactive States</h3>
              <ul>
                <li>Use subtle elevation for hover states</li>
                <li>Apply color shifts for active states</li>
                <li>Include focus rings for accessibility</li>
                <li>Maintain consistent timing (300ms)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorPaletteShowcase;

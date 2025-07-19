import React from 'react';
import './design-system.css';
import './DesignSystemPage.css';

const DesignSystemPage = () => {
  return (
    <div className="design-system-page">
      <div className="container">
        <header className="ds-header">
          <h1>Room Finder Design System</h1>
          <p>A comprehensive collection of design tokens and components used throughout the application</p>
        </header>

        <section className="ds-section">
          <h2>Colors</h2>
          
          <h3>Primary Colors</h3>
          <div className="ds-color-grid">
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-50)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-50</span>
                <span className="ds-color-value">#eef2ff</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-100)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-100</span>
                <span className="ds-color-value">#e0e7ff</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-200)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-200</span>
                <span className="ds-color-value">#c7d2fe</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-300)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-300</span>
                <span className="ds-color-value">#a5b4fc</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-400)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-400</span>
                <span className="ds-color-value">#818cf8</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-500)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-500</span>
                <span className="ds-color-value">#6366f1</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-600)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-600</span>
                <span className="ds-color-value">#4f46e5</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-700)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-700</span>
                <span className="ds-color-value">#4338ca</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-800)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-800</span>
                <span className="ds-color-value">#3730a3</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--primary-900)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">primary-900</span>
                <span className="ds-color-value">#312e81</span>
              </div>
            </div>
          </div>
          
          <h3>Secondary Colors</h3>
          <div className="ds-color-grid">
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--secondary-500)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">secondary-500</span>
                <span className="ds-color-value">#8b5cf6</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--secondary-600)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">secondary-600</span>
                <span className="ds-color-value">#7c3aed</span>
              </div>
            </div>
          </div>
          
          <h3>Semantic Colors</h3>
          <div className="ds-color-grid">
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--success)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">success</span>
                <span className="ds-color-value">#10b981</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--warning)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">warning</span>
                <span className="ds-color-value">#f59e0b</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--error)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">error</span>
                <span className="ds-color-value">#ef4444</span>
              </div>
            </div>
            <div className="ds-color-item">
              <div className="ds-color-swatch" style={{ backgroundColor: 'var(--info)' }}></div>
              <div className="ds-color-info">
                <span className="ds-color-name">info</span>
                <span className="ds-color-value">#3b82f6</span>
              </div>
            </div>
          </div>
        </section>

        <section className="ds-section">
          <h2>Typography</h2>
          
          <h3>Font Families</h3>
          <div className="ds-typography-sample">
            <div className="ds-font-sample" style={{ fontFamily: 'var(--font-sans)' }}>
              <span className="ds-font-name">Sans: Inter</span>
              <p>The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="ds-font-sample" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="ds-font-name">Heading: Poppins</span>
              <p>The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="ds-font-sample" style={{ fontFamily: 'var(--font-mono)' }}>
              <span className="ds-font-name">Mono</span>
              <p>The quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
          
          <h3>Font Sizes</h3>
          <div className="ds-type-scale">
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-xs)' }}>Text XS</span>
              <span className="ds-type-value">0.75rem (12px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-sm)' }}>Text SM</span>
              <span className="ds-type-value">0.875rem (14px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-base)' }}>Text Base</span>
              <span className="ds-type-value">1rem (16px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-lg)' }}>Text LG</span>
              <span className="ds-type-value">1.125rem (18px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-xl)' }}>Text XL</span>
              <span className="ds-type-value">1.25rem (20px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-2xl)' }}>Text 2XL</span>
              <span className="ds-type-value">1.5rem (24px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-3xl)' }}>Text 3XL</span>
              <span className="ds-type-value">1.875rem (30px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-4xl)' }}>Text 4XL</span>
              <span className="ds-type-value">2.25rem (36px)</span>
            </div>
            <div className="ds-type-item">
              <span className="ds-type-sample" style={{ fontSize: 'var(--text-5xl)' }}>Text 5XL</span>
              <span className="ds-type-value">3rem (48px)</span>
            </div>
          </div>
          
          <h3>Font Weights</h3>
          <div className="ds-weight-samples">
            <p style={{ fontWeight: 'var(--font-light)' }}>Font Light (300)</p>
            <p style={{ fontWeight: 'var(--font-normal)' }}>Font Normal (400)</p>
            <p style={{ fontWeight: 'var(--font-medium)' }}>Font Medium (500)</p>
            <p style={{ fontWeight: 'var(--font-semibold)' }}>Font Semibold (600)</p>
            <p style={{ fontWeight: 'var(--font-bold)' }}>Font Bold (700)</p>
            <p style={{ fontWeight: 'var(--font-extrabold)' }}>Font Extrabold (800)</p>
          </div>
        </section>
        
        <section className="ds-section">
          <h2>Spacing</h2>
          <div className="ds-spacing-scale">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(size => (
              <div className="ds-spacing-item" key={size}>
                <div className="ds-spacing-box" style={{ width: `var(--space-${size})`, height: `var(--space-${size})` }}></div>
                <div className="ds-spacing-info">
                  <span className="ds-spacing-name">space-{size}</span>
                  <span className="ds-spacing-value">var(--space-{size})</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="ds-section">
          <h2>Shadows</h2>
          <div className="ds-shadow-samples">
            <div className="ds-shadow-item">
              <div className="ds-shadow-box" style={{ boxShadow: 'var(--shadow-xs)' }}></div>
              <span className="ds-shadow-name">shadow-xs</span>
            </div>
            <div className="ds-shadow-item">
              <div className="ds-shadow-box" style={{ boxShadow: 'var(--shadow-sm)' }}></div>
              <span className="ds-shadow-name">shadow-sm</span>
            </div>
            <div className="ds-shadow-item">
              <div className="ds-shadow-box" style={{ boxShadow: 'var(--shadow)' }}></div>
              <span className="ds-shadow-name">shadow</span>
            </div>
            <div className="ds-shadow-item">
              <div className="ds-shadow-box" style={{ boxShadow: 'var(--shadow-md)' }}></div>
              <span className="ds-shadow-name">shadow-md</span>
            </div>
            <div className="ds-shadow-item">
              <div className="ds-shadow-box" style={{ boxShadow: 'var(--shadow-lg)' }}></div>
              <span className="ds-shadow-name">shadow-lg</span>
            </div>
            <div className="ds-shadow-item">
              <div className="ds-shadow-box" style={{ boxShadow: 'var(--shadow-xl)' }}></div>
              <span className="ds-shadow-name">shadow-xl</span>
            </div>
          </div>
        </section>
        
        <section className="ds-section">
          <h2>Border Radius</h2>
          <div className="ds-radius-samples">
            {['xs', 'sm', '', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map(size => {
              const radiusVar = size ? `var(--radius-${size})` : 'var(--radius)';
              const displayName = size || 'default';
              
              return (
                <div className="ds-radius-item" key={size}>
                  <div className="ds-radius-box" style={{ borderRadius: radiusVar }}></div>
                  <span className="ds-radius-name">radius-{displayName}</span>
                </div>
              );
            })}
          </div>
        </section>
        
        <section className="ds-section">
          <h2>Gradients</h2>
          <div className="ds-gradient-samples">
            <div className="ds-gradient-item" style={{ background: 'var(--gradient-primary)' }}>
              <span className="ds-gradient-name">gradient-primary</span>
            </div>
            <div className="ds-gradient-item" style={{ background: 'var(--gradient-primary-hover)' }}>
              <span className="ds-gradient-name">gradient-primary-hover</span>
            </div>
            <div className="ds-gradient-item" style={{ background: 'var(--gradient-accent)' }}>
              <span className="ds-gradient-name">gradient-accent</span>
            </div>
            <div className="ds-gradient-item" style={{ background: 'var(--gradient-hero)' }}>
              <span className="ds-gradient-name">gradient-hero</span>
            </div>
            <div className="ds-gradient-item" style={{ background: 'var(--gradient-card-glass)' }}>
              <span className="ds-gradient-name">gradient-card-glass</span>
            </div>
          </div>
        </section>

        <section className="ds-section">
          <h2>Component Examples</h2>
          
          <h3>Buttons</h3>
          <div className="ds-component-samples">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-outline">Outline Button</button>
            <button className="btn btn-ghost">Ghost Button</button>
          </div>
          
          <h3>Form Controls</h3>
          <div className="ds-component-samples ds-form-samples">
            <div className="ds-form-group">
              <label className="ds-label">Input Label</label>
              <input type="text" className="ds-input" placeholder="Enter text..." />
            </div>
            
            <div className="ds-form-group">
              <label className="ds-label">Select Menu</label>
              <select className="ds-select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            
            <div className="ds-form-group">
              <label className="ds-label">Textarea</label>
              <textarea className="ds-textarea" placeholder="Enter text..."></textarea>
            </div>
          </div>
          
          <h3>Card</h3>
          <div className="ds-card">
            <div className="ds-card-header">
              <h3>Card Title</h3>
            </div>
            <div className="ds-card-body">
              <p>This is a sample card component using our design system tokens.</p>
            </div>
            <div className="ds-card-footer">
              <button className="btn btn-primary">Action</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemPage;

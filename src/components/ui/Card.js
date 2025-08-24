import React from 'react';


import './Card.css';

const Card = ({
  children,
  variant = 'default',
  size = 'md',
  padding = true,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  header,
  footer,
  image,
  imagePosition = 'top',
  ...props
}) => {
  const baseClasses = [
    'card',
    `card-${variant}`,
    `card-${size}`,
    !padding && 'card-no-padding',
    hoverable && 'card-hoverable',
    clickable && 'card-clickable',
    image && `card-has-image-${imagePosition}`,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={baseClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {/* Image */}
      {image && imagePosition === 'top' && (
        <div className="card-image">
          {typeof image === 'string' ? (
            <img src={image} alt="" loading="lazy" />
          ) : (
            image
          )}
        </div>
      )}
      
      {/* Header */}
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      
      {/* Main Content */}
      <div className="card-content">
        {image && imagePosition === 'left' && (
          <div className="card-image card-image-side">
            {typeof image === 'string' ? (
              <img src={image} alt="" loading="lazy" />
            ) : (
              image
            )}
          </div>
        )}
        
        <div className="card-body">
          {children}
        </div>
        
        {image && imagePosition === 'right' && (
          <div className="card-image card-image-side">
            {typeof image === 'string' ? (
              <img src={image} alt="" loading="lazy" />
            ) : (
              image
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
      
      {/* Glassmorphism background elements */}
      <div className="card-glass-bg"></div>
      <div className="card-border-glow"></div>
      
      {/* Hover overlay */}
      {(hoverable || clickable) && (
        <div className="card-hover-overlay"></div>
      )}
    </div>
  );
};

// Card sub-components for better composition
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`card-content ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`card-title ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`card-description ${className}`} {...props}>
    {children}
  </p>
);

export default Card;

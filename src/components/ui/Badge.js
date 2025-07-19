import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  count,
  showZero = false,
  max = 99,
  className = '',
  ...props
}) => {
  // Handle count display
  const displayCount = () => {
    if (count === undefined || count === null) return null;
    if (count === 0 && !showZero) return null;
    if (count > max) return `${max}+`;
    return count;
  };

  const baseClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    dot && 'badge-dot',
    count !== undefined && 'badge-count',
    className
  ].filter(Boolean).join(' ');

  const content = dot ? null : children || displayCount();
  const shouldShow = dot || content !== null;

  if (!shouldShow) return null;

  return (
    <span className={baseClasses} {...props}>
      {content}
      
      {/* Glassmorphism background */}
      <div className="badge-glass-bg"></div>
      
      {/* Pulse animation for notifications */}
      {(variant === 'error' || variant === 'warning') && count > 0 && (
        <div className="badge-pulse"></div>
      )}
    </span>
  );
};

// Badge wrapper component for positioning
export const BadgeWrapper = ({ children, badge, position = 'top-right', className = '', ...props }) => {
  const wrapperClasses = [
    'badge-wrapper',
    `badge-position-${position}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} {...props}>
      {children}
      {badge && <div className="badge-container">{badge}</div>}
    </div>
  );
};

export default Badge;

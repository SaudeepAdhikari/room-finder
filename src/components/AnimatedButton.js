import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedButton - A reusable button component with beautiful animations
 * 
 * @param {Object} props
 * @param {string} [props.variant='primary'] - Button variant: 'primary', 'secondary', 'outline', 'text'
 * @param {string} [props.size='md'] - Button size: 'sm', 'md', 'lg'
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} [props.disabled] - Disable button
 * @param {boolean} [props.fullWidth] - Make button full width
 */
export default function AnimatedButton({ 
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  children,
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const [isRippling, setIsRippling] = useState(false);
  const [rippleX, setRippleX] = useState(0);
  const [rippleY, setRippleY] = useState(0);

  // Button variants
  const variants = {
    primary: {
      rest: { 
        background: "linear-gradient(90deg, rgb(79, 70, 229), rgb(99, 102, 241))",
        color: "white",
        boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)"
      },
      hover: { 
        background: "linear-gradient(90deg, rgb(67, 56, 202), rgb(79, 70, 229))",
        boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.1)",
        y: -2
      },
      tap: { 
        y: 1,
        boxShadow: "0 2px 4px -1px rgba(79, 70, 229, 0.2)",
        background: "linear-gradient(90deg, rgb(55, 48, 163), rgb(67, 56, 202))"
      },
      disabled: {
        background: "rgb(203, 213, 225)",
        color: "rgb(148, 163, 184)",
        boxShadow: "none",
        y: 0
      }
    },
    secondary: {
      rest: { 
        background: "rgb(255, 255, 255)",
        color: "rgb(79, 70, 229)",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: "1px solid rgb(226, 232, 240)"
      },
      hover: { 
        background: "rgb(248, 250, 252)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        y: -2
      },
      tap: { 
        y: 1,
        background: "rgb(241, 245, 249)",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
      },
      disabled: {
        background: "rgb(248, 250, 252)",
        color: "rgb(203, 213, 225)",
        border: "1px solid rgb(226, 232, 240)",
        boxShadow: "none",
        y: 0
      }
    },
    outline: {
      rest: { 
        background: "transparent",
        color: "rgb(79, 70, 229)",
        border: "2px solid rgb(79, 70, 229)",
      },
      hover: { 
        background: "rgba(79, 70, 229, 0.05)",
        y: -2
      },
      tap: { 
        y: 1,
        background: "rgba(79, 70, 229, 0.1)",
      },
      disabled: {
        background: "transparent",
        color: "rgb(203, 213, 225)",
        border: "2px solid rgb(203, 213, 225)",
        y: 0
      }
    },
    text: {
      rest: { 
        background: "transparent",
        color: "rgb(79, 70, 229)",
      },
      hover: { 
        background: "rgba(79, 70, 229, 0.05)",
        y: -1
      },
      tap: { 
        y: 1,
        background: "rgba(79, 70, 229, 0.1)",
      },
      disabled: {
        background: "transparent",
        color: "rgb(203, 213, 225)",
        y: 0
      }
    }
  };

  // Button sizes
  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-6 py-3 rounded-xl'
  };

  // Handle ripple effect
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRippleX(x);
    setRippleY(y);
    setIsRippling(true);
    
    setTimeout(() => {
      setIsRippling(false);
    }, 600);
    
    // Execute onClick if provided
    if (onClick && !disabled) {
      onClick(e);
    }
  };

  return (
    <motion.button
      className={`relative font-medium ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handleRipple}
      disabled={disabled}
      initial="rest"
      animate={disabled ? "disabled" : "rest"}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      transition={{ duration: 0.2 }}
      variants={variants[variant]}
      {...props}
    >
      {children}
      
      {/* Ripple effect */}
      {isRippling && (
        <span 
          className="absolute rounded-full bg-white bg-opacity-30"
          style={{
            left: rippleX,
            top: rippleY,
            width: 300,
            height: 300,
            marginLeft: -150,
            marginTop: -150,
            transform: 'scale(0)',
            animation: 'ripple 0.8s linear'
          }}
        />
      )}
    </motion.button>
  );
}

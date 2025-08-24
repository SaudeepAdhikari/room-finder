import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';


/**
 * Animation Utilities for Room Finder
 * 
 * This file contains reusable animation configurations, hooks, and components
 * for consistent animations throughout the application.
 */

// ===== Animation Variants =====

/**
 * Fade In Up animation - for elements entering from below
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: 30,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

/**
 * Fade In animation - simple fade in/out
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

/**
 * Scale In animation - grows from smaller size
 */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

/**
 * Stagger children animations
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

/**
 * Hover animation for cards
 */
export const cardHover = {
  rest: { 
    scale: 1, 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  },
  hover: { 
    scale: 1.03, 
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }
  },
  tap: { 
    scale: 0.98,
    transition: { 
      duration: 0.1, 
      ease: "easeIn" 
    }
  }
};

/**
 * Button press animation
 */
export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

/**
 * Floating animation for decorative elements
 */
export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// ===== Custom Hooks =====

/**
 * useScrollReveal hook - reveals element when scrolled into view
 */
export function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
}

/**
 * useTilt hook - adds tilt effect to elements
 */
export function useTilt(tiltOptions = {}) {
  const {
    max = 10,
    perspective = 1000,
    scale = 1.05,
    speed = 500,
    easing = "cubic-bezier(.03,.98,.52,.99)"
  } = tiltOptions;

  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let updateCall = null;
    let ticking = false;
    let positions = { x: 0, y: 0 };

    const getValues = (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = ((x - centerX) / centerX) * max;
      const tiltY = -((y - centerY) / centerY) * max;
      
      return { tiltX, tiltY };
    };

    const reset = () => {
      cancelAnimationFrame(updateCall);
      updateCall = requestAnimationFrame(() => {
        element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    };

    const updateTransform = (event) => {
      if (ticking) return;
      
      window.requestAnimationFrame(() => {
        if (!event) return;
        
        const values = getValues(event);
        
        element.style.transition = `transform ${speed}ms ${easing}`;
        element.style.transform = `perspective(${perspective}px) rotateX(${values.tiltY}deg) rotateY(${values.tiltX}deg) scale3d(${scale}, ${scale}, ${scale})`;
        
        ticking = false;
      });
      
      ticking = true;
    };

    const handleMouseEnter = (event) => {
      updateTransform(event);
      element.style.transition = "";
    };

    const handleMouseMove = (event) => {
      positions.x = event.clientX;
      positions.y = event.clientY;
      updateTransform(event);
    };

    const handleMouseLeave = () => {
      reset();
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(updateCall);
    };
  }, [max, perspective, scale, speed, easing]);

  return ref;
}

// ===== Animation Components =====

/**
 * ScrollReveal - animated component that reveals on scroll
 */
export const ScrollReveal = ({ 
  children, 
  variant = fadeInUp, 
  delay = 0,
  threshold = 0.1,
  className = "", 
  ...props 
}) => {
  const [ref, isVisible] = useScrollReveal(threshold);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="exit"
      variants={variant}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * TiltCard - card with tilt effect on hover
 */
export const TiltCard = ({ children, className = "", ...props }) => {
  const tiltRef = useTilt();
  
  return (
    <div
      ref={tiltRef}
      className={`tilt-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * AnimatedButton - button with press animation
 */
export const AnimatedButton = ({ 
  children, 
  className = "", 
  onClick, 
  ...props 
}) => {
  return (
    <motion.button
      className={`animated-button ${className}`}
      whileHover="hover"
      whileTap="tap"
      variants={buttonPress}
      onClick={onClick}
      {...props}
    >
      <div className="ripple-container">
        {children}
      </div>
    </motion.button>
  );
};

/**
 * FloatingElement - element with gentle floating animation
 */
export const FloatingElement = ({ 
  children, 
  delay = 0,
  duration = 3,
  distance = 10,
  className = "", 
  ...props 
}) => {
  const floatVariant = {
    animate: {
      y: [0, -distance, 0],
      transition: {
        delay,
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  return (
    <motion.div
      variants={floatVariant}
      animate="animate"
      className={`floating-element ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

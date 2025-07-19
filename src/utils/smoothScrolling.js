// Critical scroll performance optimization

export const initSmoothScrolling = () => {
  // Disable animations during scroll for better performance
  let scrollTimer = null;
  let isScrolling = false;

  const disableAnimations = () => {
    if (!isScrolling) {
      isScrolling = true;
      document.body.classList.add('disable-hover-on-scroll');
      
      // Disable will-change properties during scroll
      const animatedElements = document.querySelectorAll('.smooth-animation, .gpu-layer');
      animatedElements.forEach(el => {
        el.style.willChange = 'auto';
      });
    }
    
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScrolling = false;
      document.body.classList.remove('disable-hover-on-scroll');
      
      // Re-enable will-change after scroll ends
      const animatedElements = document.querySelectorAll('.smooth-animation, .gpu-layer');
      animatedElements.forEach(el => {
        el.style.willChange = 'transform';
      });
    }, 150);
  };

  // Use passive listeners for better performance
  window.addEventListener('scroll', disableAnimations, { passive: true });
  window.addEventListener('wheel', disableAnimations, { passive: true });
  window.addEventListener('touchmove', disableAnimations, { passive: true });

  // Optimize for different devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    // Disable complex animations on mobile
    document.documentElement.style.setProperty('--animation-scale', '0.5');
    document.documentElement.style.setProperty('--animation-duration', '0.15s');
  } else {
    document.documentElement.style.setProperty('--animation-scale', '1');
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
  }

  // Add CSS for scroll optimization
  const style = document.createElement('style');
  style.textContent = `
    .scroll-smooth {
      scroll-behavior: smooth;
    }
    
    .disable-hover-on-scroll * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    /* Optimize backdrop filters during scroll */
    .disable-hover-on-scroll .backdrop-blur {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
  `;
  document.head.appendChild(style);

  return () => {
    window.removeEventListener('scroll', disableAnimations);
    window.removeEventListener('wheel', disableAnimations);
    window.removeEventListener('touchmove', disableAnimations);
    clearTimeout(scrollTimer);
  };
};

const addSmoothScrollingPolyfill = () => {
  // Simple smooth scrolling polyfill
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        smoothScrollTo(target.offsetTop, 800);
      }
    });
  });
};

const smoothScrollTo = (targetPosition, duration) => {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
};

// Easing function for smooth animation
const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

// Add intersection observer for performance optimization
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }

  // Fallback for older browsers
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {}
  };
};

// Debounce function for scroll events
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for frequent events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

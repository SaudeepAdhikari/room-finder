// Scroll Fix Utility - Programmatic fixes for animation layer scroll conflicts

export const scrollFix = {
  // Initialize scroll fixes on page load
  init() {
    this.ensureBodyScroll();
    this.fixAnimationLayers();
    this.addScrollListeners();
    this.detectScrollBlocking();
  },

  // Ensure body element can scroll
  ensureBodyScroll() {
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.overflowX = 'hidden';
    
    // Force scroll container setup
    const root = document.getElementById('root');
    if (root) {
      root.style.overflowY = 'auto';
      root.style.overflowX = 'hidden';
      root.style.minHeight = '100vh';
    }
  },

  // Fix animation layers that block scroll
  fixAnimationLayers() {
    // Find elements with potential scroll blocking
    const problemElements = document.querySelectorAll([
      '.card-glass-bg',
      '.card-border-glow',
      '.background-elements',
      '.decoration-elements',
      '[class*="bg-element"]',
      '[class*="decoration"]',
      '.animation-layer'
    ].join(','));

    problemElements.forEach(el => {
      el.style.pointerEvents = 'none';
      el.style.zIndex = '-1';
    });

    // Fix cards with overflow hidden
    const cards = document.querySelectorAll('.card, [class*="card"]');
    cards.forEach(card => {
      if (card.style.overflow === 'hidden') {
        card.style.overflow = 'visible';
      }
    });
  },

  // Add scroll event listeners to detect issues
  addScrollListeners() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.checkScrollPerformance();
      }, 100);
    }, { passive: true });

    // Check for blocked scroll attempts
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    window.addEventListener('wheel', (e) => {
      setTimeout(() => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollTop === lastScrollTop && Math.abs(e.deltaY) > 10) {
          console.warn('Scroll blocking detected, applying fixes...');
          this.emergencyScrollFix();
        }
        lastScrollTop = currentScrollTop;
      }, 50);
    }, { passive: true });
  },

  // Check scroll performance and apply fixes
  checkScrollPerformance() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollHeight <= clientHeight) {
      // Page should be scrollable but isn't
      this.emergencyScrollFix();
    }
  },

  // Detect elements that might be blocking scroll
  detectScrollBlocking() {
    const body = document.body;
    const html = document.documentElement;
    
    // Check for problematic CSS
    const bodyStyles = getComputedStyle(body);
    const htmlStyles = getComputedStyle(html);
    
    if (bodyStyles.overflow === 'hidden' || htmlStyles.overflow === 'hidden') {
      console.warn('Scroll blocking CSS detected');
      this.ensureBodyScroll();
    }

    // Check for elements with high z-index that might interfere
    const highZIndexElements = document.querySelectorAll('*');
    highZIndexElements.forEach(el => {
      const styles = getComputedStyle(el);
      const zIndex = parseInt(styles.zIndex);
      
      if (zIndex > 9999 && styles.position === 'fixed') {
        // High z-index fixed elements might block scroll
        el.style.pointerEvents = 'none';
        setTimeout(() => {
          el.style.pointerEvents = 'auto';
        }, 100);
      }
    });
  },

  // Emergency scroll fix when scroll is completely blocked
  emergencyScrollFix() {
    console.log('Applying emergency scroll fix...');
    
    // Force scroll restoration
    document.body.classList.remove('no-scroll');
    document.body.classList.add('force-scroll');
    
    // Remove problematic styles
    const problematicElements = document.querySelectorAll('[style*="overflow: hidden"]');
    problematicElements.forEach(el => {
      if (el.tagName === 'BODY' || el.tagName === 'HTML') {
        el.style.overflow = 'auto';
      }
    });

    // Reset body and html
    this.ensureBodyScroll();
    
    // Force reflow
    document.body.offsetHeight;
    
    setTimeout(() => {
      this.fixAnimationLayers();
    }, 100);
  },

  // Fix specific scroll issues for different page types
  fixPageSpecific() {
    const currentPath = window.location.pathname;
    
    switch (currentPath) {
      case '/':
      case '/home':
        this.fixHomePage();
        break;
      case '/ui':
        this.fixUIShowcase();
        break;
      case '/colors':
        this.fixColorShowcase();
        break;
      default:
        this.fixGenericPage();
    }
  },

  // Fix home page specific scroll issues
  fixHomePage() {
    const heroSection = document.querySelector('.hero-section, .hero-background');
    if (heroSection) {
      heroSection.style.overflow = 'hidden'; // Keep for background
      
      // Ensure content after hero is scrollable
      const nextElement = heroSection.nextElementSibling;
      if (nextElement) {
        nextElement.style.position = 'relative';
        nextElement.style.zIndex = '1';
      }
    }
  },

  // Fix UI showcase scroll issues
  fixUIShowcase() {
    const showcase = document.querySelector('.ui-showcase');
    if (showcase) {
      showcase.style.overflowY = 'auto';
      showcase.style.overflowX = 'hidden';
      showcase.style.scrollBehavior = 'smooth';
    }
  },

  // Fix color showcase scroll issues
  fixColorShowcase() {
    const colorShowcase = document.querySelector('.color-showcase');
    if (colorShowcase) {
      colorShowcase.style.overflowY = 'auto';
      colorShowcase.style.overflowX = 'hidden';
    }
  },

  // Fix generic page scroll issues
  fixGenericPage() {
    const mainContent = document.querySelector('main, .main-content, .app-container');
    if (mainContent) {
      mainContent.style.overflowY = 'auto';
      mainContent.style.overflowX = 'hidden';
      mainContent.style.position = 'relative';
      mainContent.style.zIndex = '1';
    }
  },

  // Smooth scroll to element
  scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  },

  // Check if scroll is working
  testScroll() {
    const originalScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    window.scrollBy(0, 1);
    
    setTimeout(() => {
      const newScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (newScrollTop === originalScrollTop) {
        console.error('Scroll is blocked!');
        this.emergencyScrollFix();
      } else {
        console.log('Scroll is working');
        window.scrollTo(0, originalScrollTop); // Restore position
      }
    }, 100);
  },

  // Monitor scroll health
  monitorScrollHealth() {
    setInterval(() => {
      this.detectScrollBlocking();
    }, 5000); // Check every 5 seconds
  }
};

// Auto-initialize on DOM load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      scrollFix.init();
      scrollFix.fixPageSpecific();
    });
  } else {
    scrollFix.init();
    scrollFix.fixPageSpecific();
  }

  // Re-apply fixes on route changes
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      scrollFix.fixPageSpecific();
    }, 100);
  });
}

export default scrollFix;

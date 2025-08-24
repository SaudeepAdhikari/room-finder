// Background Stability Fix - Prevents scroll from affecting gradient animation

const backgroundFix = {
  init() {
    this.preventScrollInterference();
    this.enforceStableAnimation();
    this.monitorBackgroundChanges();
    this.addKeyboardShortcuts();
  },

  preventScrollInterference() {
    // Prevent scroll events from affecting background animation
    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('scrolling');
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('scrolling');
      }, 100);
    }, { passive: true });

    // Add CSS to maintain animation during scroll
    const style = document.createElement('style');
    style.textContent = `
      .scrolling {
        animation-play-state: running !important;
      }
      
      html, body, #root, .App {
        animation-play-state: running !important;
        background-attachment: fixed !important;
      }
    `;
    document.head.appendChild(style);
  },

  enforceStableAnimation() {
    // Force stable animation properties
    const elements = [document.documentElement, document.body];
    const root = document.getElementById('root');
    const app = document.querySelector('.App');
    
    if (root) elements.push(root);
    if (app) elements.push(app);

    elements.forEach(el => {
      if (el) {
        el.style.setProperty('animation-play-state', 'running', 'important');
        el.style.setProperty('animation-timing-function', 'linear', 'important');
        el.style.setProperty('animation-duration', '12s', 'important');
        el.style.setProperty('background-attachment', 'fixed', 'important');
      }
    });
  },

  monitorBackgroundChanges() {
    // Monitor for unexpected background changes
    let lastBackgroundState = '';
    
    const checkBackground = () => {
      const body = document.body;
      const currentBackground = getComputedStyle(body).background;
      
      if (lastBackgroundState && lastBackgroundState !== currentBackground) {
        console.warn('⚠️ Background change detected during scroll - fixing...');
        this.enforceStableAnimation();
      }
      
      lastBackgroundState = currentBackground;
    };

    // Check every 500ms
    setInterval(checkBackground, 500);

    // Also check on scroll events
    let scrollCheckTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollCheckTimeout);
      scrollCheckTimeout = setTimeout(checkBackground, 100);
    }, { passive: true });
  },

  addKeyboardShortcuts() {
    // Add keyboard shortcut for emergency background fix
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        this.emergencyFix();
      }
    });
    
    // Global background fix function for browser console
    window.backgroundFix = this;
  },

  // Emergency fix function
  emergencyFix() {
    const criticalCSS = `
      html, body, #root, .App {
        background: linear-gradient(135deg,
          #667eea 0%,
          #764ba2 25%,
          #f093fb 50%,
          #f5576c 75%,
          #4facfe 100%) !important;
        background-size: 400% 400% !important;
        animation: gradient-shift-emergency 12s linear infinite !important;
        animation-play-state: running !important;
      }
      
      @keyframes gradient-shift-emergency {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    
    const emergencyStyle = document.createElement('style');
    emergencyStyle.id = 'background-emergency-fix';
    emergencyStyle.textContent = criticalCSS;
    
    // Remove existing emergency fix if present
    const existing = document.getElementById('background-emergency-fix');
    if (existing) existing.remove();
    
    document.head.appendChild(emergencyStyle);
  }
};

export default backgroundFix;

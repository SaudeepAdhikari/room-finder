/**
 * Scroll Animation Observer
 * 
 * This utility adds scroll-based animations to elements with specific classes.
 * It uses the IntersectionObserver API to detect when elements enter the viewport.
 */

// Initialize scroll animations once DOM is ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

function initScrollAnimations() {
  // Configure options for the intersection observer
  const options = {
    root: null, // Use the viewport
    rootMargin: '0px',
    threshold: 0.15 // Trigger when at least 15% of the element is visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the element is in the viewport
      if (entry.isIntersecting) {
        // Add the 'revealed' class
        entry.target.classList.add('revealed');
        
        // Stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Get all elements with animation classes
  const animatedElements = document.querySelectorAll(
    '.reveal-fade-up, .reveal-fade-in, .reveal-scale'
  );

  // Observe each element
  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Set up ripple effect for buttons with ripple class
  setupRippleEffect();
}

// Add ripple effect to buttons
function setupRippleEffect() {
  const buttons = document.querySelectorAll('.btn-ripple');
  
  buttons.forEach(button => {
    button.addEventListener('click', createRipple);
  });
}

// Create ripple effect
function createRipple(event) {
  const button = event.currentTarget;
  
  // Create a ripple element
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  // Get the button dimensions
  const rect = button.getBoundingClientRect();
  
  // Calculate ripple size and position
  const size = Math.max(rect.width, rect.height) * 2;
  const x = event.clientX - rect.left - (size / 2);
  const y = event.clientY - rect.top - (size / 2);
  
  // Position the ripple
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  // Add ripple to button
  button.appendChild(ripple);
  
  // Remove ripple after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Export the initialization function so it can be called manually if needed
export default initScrollAnimations;

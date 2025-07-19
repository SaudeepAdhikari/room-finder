import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './utils/animations.css';
import App from './App';
import initScrollAnimations from './utils/scrollAnimations';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize scroll animations after page load
document.addEventListener('DOMContentLoaded', initScrollAnimations);




import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/index.css';
import './utils/animations.css';
import App from './App';
import { } from './utils/animations';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Scroll animations are initialized in scrollAnimations.js

// --- DEBUG HELPERS: temporarily unregister service workers and log navigation calls
// This helps rule out service-worker-caused reload loops or unexpected redirects.
try {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(regs => regs.forEach(r => {
        console.info('Debug: unregistering service worker', r);
        r.unregister().then(ok => console.info('Debug: SW unregistered?', ok));
      }))
      .catch(e => console.error('Debug: failed to get service worker registrations', e));
  }
} catch (e) {
  console.error('Debug: service worker unregister failed', e);
}






import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import './App.css';
import './styles/design-system.css';
import './styles/design-system-base.css';
import Footer from './components/ui/Footer';
import Header from './components/Header';
import { PAGES } from './pages.js';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import './components/Navbar.css';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Blog from './pages/Blog';
import Help from './pages/Help';
import Safety from './pages/Safety';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Refunds from './pages/Refunds';
import Sitemap from './pages/Sitemap';
// Admin pages are removed from the client bundle; admin runs as a standalone app

// Admin pages are served as a standalone app. Redirect to the standalone admin
function StandaloneAdminRedirect({ to }) {
  React.useEffect(() => {
    // Force a full page navigation to the standalone admin so it loads outside the client bundle
    window.location.href = to;
  }, [to]);
  return null;
}

function AnimatedPage({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Admin provider wrapper is intentionally omitted; admin runs as a standalone app

// Main site layout with all providers including ThemeProvider
function MainLayout({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
  {/* Admin routes are handled by the standalone admin app. Force full reloads */}
  <Route path="/admin/*" element={<StandaloneAdminRedirect to="/admin" />} />
  <Route path="/admindashboard" element={<StandaloneAdminRedirect to="/admin" />} />
  <Route path="/adminlogin" element={<StandaloneAdminRedirect to="/admin/adminlogin" />} />
        {/* Main site layout for all other routes with ThemeProvider */}
        <Route path="*" element={
          <MainLayout>
            {/* Remove inner div, just render navbar, main, footer directly */}
            <Header />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100vw', minHeight: '100vh', background: 'var(--background)' }}>
              <Routes>
                <Route path="/" element={<AnimatedPage><PAGES.home /></AnimatedPage>} />
                {/* <Route path="/search" element={<AnimatedPage><PAGES.search /></AnimatedPage>} /> */}
                {/* <Route path="/explore" element={<AnimatedPage><PAGES.search /></AnimatedPage>} /> */}
                <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
                <Route path="/careers" element={<AnimatedPage><Careers /></AnimatedPage>} />
                <Route path="/press" element={<AnimatedPage><Press /></AnimatedPage>} />
                <Route path="/blog" element={<AnimatedPage><Blog /></AnimatedPage>} />
                <Route path="/help" element={<AnimatedPage><Help /></AnimatedPage>} />
                <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
                <Route path="/safety" element={<AnimatedPage><Safety /></AnimatedPage>} />
                <Route path="/faq" element={<AnimatedPage><FAQ /></AnimatedPage>} />
                <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
                <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
                <Route path="/cookies" element={<AnimatedPage><Cookies /></AnimatedPage>} />
                <Route path="/refunds" element={<AnimatedPage><Refunds /></AnimatedPage>} />
                <Route path="/sitemap" element={<AnimatedPage><Sitemap /></AnimatedPage>} />
                <Route path="/profile" element={<AnimatedPage><PAGES.profile /></AnimatedPage>} />
                <Route path="/listings" element={<AnimatedPage><PAGES.alllistings /></AnimatedPage>} />
                <Route path="/listings/:id" element={<AnimatedPage><PAGES.detail /></AnimatedPage>} />
                <Route path="/post" element={<AnimatedPage><PAGES.post /></AnimatedPage>} />
                <Route path="/post-room" element={<AnimatedPage><PAGES.post /></AnimatedPage>} />
                <Route path="/auth" element={<AnimatedPage><PAGES.auth /></AnimatedPage>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;




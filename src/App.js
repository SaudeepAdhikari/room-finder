import React from 'react';
import './App.css';
import './styles/design-system.css';
import './styles/design-system-base.css';
import Footer from './components/ui/Footer';
import MaintenanceMode from './components/MaintenanceMode';
import { PAGES } from './pages.js';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import { AdminSettingsProvider } from './context/AdminSettingsContext';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminUserProvider, useAdminUser } from './admin/AdminUserContext';
import UniversalNavbar from './components/UniversalNavbar';
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

function AdminRoute({ children }) {
  const { admin, loading } = useAdminUser();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (!admin) return <Navigate to="/adminlogin" replace />;
  return children;
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

// Admin layout without ThemeProvider
function AdminLayout({ children }) {
  return (
    <AdminUserProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AdminUserProvider>
  );
}

// Main site layout with all providers including ThemeProvider
function MainLayout({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <AdminSettingsProvider>
            {children}
          </AdminSettingsProvider>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin dashboard route: no Header/Footer, no ThemeProvider */}
        <Route path="/admindashboard" element={
          <AdminLayout>
            <AdminRoute>
              <PAGES.admindashboard />
            </AdminRoute>
          </AdminLayout>
        } />
        <Route path="/adminlogin" element={
          <AdminLayout>
            <AnimatedPage>
              <PAGES.adminlogin />
            </AnimatedPage>
          </AdminLayout>
        } />
        {/* Main site layout for all other routes with ThemeProvider */}
        <Route path="*" element={
          <MainLayout>
            {/* Remove inner div, just render navbar, main, footer directly */}
            <UniversalNavbar />
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
                <Route path="/post" element={<AnimatedPage><PAGES.post /></AnimatedPage>} />
                <Route path="/post-room" element={<AnimatedPage><PAGES.post /></AnimatedPage>} />
                <Route path="/auth" element={<AnimatedPage><PAGES.auth /></AnimatedPage>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <MaintenanceMode />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;




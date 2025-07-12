import React from 'react';
import './App.css';
import './theme.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MaintenanceMode from './components/MaintenanceMode';
import { PAGES } from './pages';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import { AdminSettingsProvider } from './context/AdminSettingsContext';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminUserProvider, useAdminUser } from './admin/AdminUserContext';

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
            <div style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--background)',
            }}>
              <Header />
              <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Routes>
                  <Route path="/" element={<AnimatedPage><PAGES.home /></AnimatedPage>} />
                  <Route path="/search" element={<AnimatedPage><PAGES.search /></AnimatedPage>} />
                  <Route path="/post" element={<AnimatedPage><PAGES.post /></AnimatedPage>} />
                  <Route path="/auth" element={<AnimatedPage><PAGES.auth /></AnimatedPage>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <MaintenanceMode />
            </div>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;

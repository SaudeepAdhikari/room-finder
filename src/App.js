import React, { useState } from 'react';
import './App.css';
import './theme.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { PAGES } from './pages';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';

function AdminDashboardWrapper(props) {
  const { user, loading } = useUser();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (!user || !user.isAdmin) return null; // Optionally, redirect to home here
  const PageComp = PAGES['admindashboard'];
  return <PageComp {...props} />;
}

function App() {
  const [page, setPage] = useState('home');
  const PageComp = PAGES[page] || PAGES.home;

  const isAdminDashboard = page === 'admindashboard';

  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--background)',
          }}>
            {isAdminDashboard ? (
              <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    style={{ width: '100%' }}
                  >
                    <AdminDashboardWrapper onNavigate={setPage} />
                  </motion.div>
                </AnimatePresence>
              </main>
            ) : (
              <>
                <Header onNavigate={setPage} activePage={page} />
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      style={{ width: '100%' }}
                    >
                      {typeof PageComp === 'function' ? <PageComp onNavigate={setPage} /> : <PageComp />}
                    </motion.div>
                  </AnimatePresence>
                </main>
                <Footer onNavigate={setPage} />
              </>
            )}
          </div>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

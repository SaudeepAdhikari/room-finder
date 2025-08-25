import React, { useEffect, useState } from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './admin/AdminAuthContext.js'
import { AdminUserProvider } from './admin/AdminUserContext.js'
import { ToastProvider } from './context/ToastContext.js'

// ✅ Import all admin components from their correct files
import AdminLayout from './admin/AdminLayout'
import AdminDashboardPage from './admin/AdminDashboardPage'
import AdminRoomsPage from './admin/AdminRoomsPage'
import AdminUsersPage from './admin/AdminUsersPage'
import AdminBookingsPage from './admin/AdminBookingsPage'
import AdminReviewsPage from './admin/AdminReviewsPage'
import AdminAnalyticsPage from './admin/AdminAnalyticsPage'
import AdminSettingsPage from './admin/AdminSettingsPage'
import AdminLogin from './admin/AdminLogin'

// 🔴 Error overlay (to catch runtime errors instead of blank screen)
function ErrorOverlay({ error }) {
  if (!error) return null
  return (
    <div style={{
      position: 'fixed',
      inset: 20,
      background: 'rgba(255,255,255,0.98)',
      color: '#a00',
      padding: 20,
      borderRadius: 8,
      zIndex: 9999,
      overflow: 'auto'
    }}>
      <h3 style={{ marginTop: 0 }}>Runtime error</h3>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error)}</pre>
    </div>
  )
}

function App() {
  const [runtimeError, setRuntimeError] = useState(null)

  useEffect(() => {
    const onError = (ev) => {
      const msg = ev?.error ? (ev.error.stack || ev.error.message || String(ev.error)) : ev?.message || 'Unknown error'
      setRuntimeError(msg)
    }
    const onRejection = (ev) => {
      const reason = ev?.reason ? (ev.reason.stack || ev.reason.message || String(ev.reason)) : 'Unhandled rejection'
      setRuntimeError(reason)
    }
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return (
    <AdminAuthProvider>
      <AdminUserProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Redirect root to /admin */}
              <Route path="/" element={<Navigate to="/admin" replace />} />

              {/* Admin layout with nested routes */}
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="rooms" element={<AdminRoomsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Admin login */}
              <Route path="/adminlogin" element={<AdminLogin />} />
            </Routes>
          </Router>

          {/* Error overlay */}
          <ErrorOverlay error={runtimeError} />
        </ToastProvider>
      </AdminUserProvider>
    </AdminAuthProvider>
  )
}

export default App

import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import * as Admin from '../dist'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/*" element={<Admin.AdminLayout />} />
        <Route path="/adminlogin" element={<Admin.AdminLogin />} />
      </Routes>
    </Router>
  )
}

export default App

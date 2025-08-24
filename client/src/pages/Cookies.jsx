import React from 'react';
import { FaCookieBite } from 'react-icons/fa';

import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';

export default function Cookies() {
  return (
    <EnhancedPageLayout icon={<FaCookieBite />} title="Cookie Policy">
      <h2 style={{ color: '#7c3aed', fontSize: '1.2rem', marginTop: 0 }}>How We Use Cookies</h2>
      <p style={{ color: '#444', fontSize: 16 }}>We use cookies to improve your experience, analyze site usage, and personalize content. By using SajiloStay, you agree to our use of cookies.</p>
      <h2 style={{ color: '#7c3aed', fontSize: '1.2rem' }}>Managing Cookies</h2>
      <p style={{ color: '#444', fontSize: 16 }}>You can manage or disable cookies in your browser settings. Some features may not work properly if cookies are disabled.</p>
    </EnhancedPageLayout>
  );
} 
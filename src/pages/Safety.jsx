import React from 'react';
import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';
import { FaShieldAlt, FaExclamationTriangle, FaComments } from 'react-icons/fa';

const tips = [
  { icon: <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: 22 }} />, text: 'Always communicate through SajiloStay.' },
  { icon: <FaShieldAlt style={{ color: '#7c3aed', fontSize: 22 }} />, text: 'Never send money outside the platform.' },
  { icon: <FaComments style={{ color: '#38bdf8', fontSize: 22 }} />, text: 'Report suspicious listings or users.' }
];

export default function Safety() {
  return (
    <EnhancedPageLayout icon={<FaShieldAlt />} title="Safety at SajiloStay">
      <p style={{ marginBottom: 32 }}>
        Your safety is our priority. Please follow these tips to stay safe while using SajiloStay.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {tips.map((tip, i) => (
          <li key={i} style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 8px #7c3aed11', padding: '1.1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 16, fontSize: 16, color: '#312e81' }}>
            {tip.icon} {tip.text}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 40, background: 'linear-gradient(90deg, #7c3aed11 0%, #38bdf811 100%)', borderRadius: 12, padding: '1.5rem 1.2rem', textAlign: 'center', color: '#444', fontSize: 16 }}>
        <b>Have a safety concern?</b> <a href="/contact" style={{ color: '#7c3aed', textDecoration: 'underline' }}>Contact us</a> and our team will help you.
      </div>
    </EnhancedPageLayout>
  );
} 
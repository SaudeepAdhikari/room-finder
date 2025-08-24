import React from 'react';
import { FaLifeRing, FaEnvelope, FaQuestionCircle, FaPhone } from 'react-icons/fa';

import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';

const quickLinks = [
  { label: 'FAQ', icon: <FaQuestionCircle style={{ color: '#7c3aed', fontSize: 20 }} />, href: '/faq' },
  { label: 'Contact Support', icon: <FaEnvelope style={{ color: '#38bdf8', fontSize: 20 }} />, href: '/contact' },
  { label: 'Call Us', icon: <FaPhone style={{ color: '#f59e0b', fontSize: 20 }} />, href: 'tel:+977-9842064469' }
];

export default function Help() {
  return (
    <EnhancedPageLayout icon={<FaLifeRing />} title="Help Center">
      <p style={{ marginBottom: 32 }}>
        Need help? Browse our FAQ, contact our support team, or call us for immediate assistance.
      </p>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
        {quickLinks.map((q, i) => (
          <a key={i} href={q.href} style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 8px #7c3aed11', padding: '1.1rem 1.5rem', color: '#312e81', fontWeight: 600, fontSize: 17, textDecoration: 'none', gap: 12, transition: 'box-shadow 0.18s' }}>
            {q.icon} {q.label}
          </a>
        ))}
      </div>
      <div style={{ background: 'linear-gradient(90deg, #7c3aed11 0%, #38bdf811 100%)', borderRadius: 12, padding: '1.5rem 1.2rem', textAlign: 'center', color: '#444', fontSize: 16 }}>
        <b>Still need help?</b> Email <a href="mailto:support@sajilostay.com" style={{ color: '#7c3aed', textDecoration: 'underline' }}>support@sajilostay.com</a> and our team will get back to you as soon as possible.<br />
        Or call us at <a href="tel:+977-9842064469" style={{ color: '#7c3aed', textDecoration: 'underline' }}>+977-9842064469</a>.
      </div>
    </EnhancedPageLayout>
  );
} 
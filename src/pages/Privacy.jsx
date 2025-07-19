import React from 'react';
import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';
import { FaUserShield } from 'react-icons/fa';

export default function Privacy() {
    return (
        <EnhancedPageLayout icon={<FaUserShield />} title="Privacy Policy">
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem', marginTop: 0 }}>Your Privacy</h2>
            <p style={{ color: '#444', fontSize: 16 }}>We collect only necessary information and never share your data without consent. Your privacy is important to us.</p>
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem' }}>Data Usage</h2>
            <p style={{ color: '#444', fontSize: 16 }}>We use your data to improve your experience and provide our services. You can request data deletion at any time.</p>
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem' }}>Contact</h2>
            <p style={{ color: '#444', fontSize: 16 }}>For privacy questions, email <a href="mailto:privacy@sajilostay.com" style={{ color: '#7c3aed', textDecoration: 'underline' }}>privacy@sajilostay.com</a>.</p>
        </EnhancedPageLayout>
    );
} 
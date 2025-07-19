import React from 'react';
import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';
import { FaUndo } from 'react-icons/fa';

export default function Refunds() {
    return (
        <EnhancedPageLayout icon={<FaUndo />} title="Refund Policy">
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem', marginTop: 0 }}>How to Request a Refund</h2>
            <p style={{ color: '#444', fontSize: 16 }}>If you need a refund, please contact our support team. Refunds are processed according to our terms and conditions.</p>
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem' }}>Processing Time</h2>
            <p style={{ color: '#444', fontSize: 16 }}>Refunds are typically processed within 5-7 business days after approval.</p>
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem' }}>Contact</h2>
            <p style={{ color: '#444', fontSize: 16 }}>For refund questions, email <a href="mailto:support@sajilostay.com" style={{ color: '#7c3aed', textDecoration: 'underline' }}>support@sajilostay.com</a>.</p>
        </EnhancedPageLayout>
    );
} 
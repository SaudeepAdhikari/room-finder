import React from 'react';
import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';
import { FaFileContract } from 'react-icons/fa';

export default function Terms() {
    return (
        <EnhancedPageLayout icon={<FaFileContract />} title="Terms of Service">
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem', marginTop: 0 }}>User Agreement</h2>
            <ul style={{ color: '#444', fontSize: 16, marginBottom: 32 }}>
                <li>Use the platform responsibly</li>
                <li>Respect other users</li>
                <li>Follow all applicable laws</li>
            </ul>
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem' }}>Liability</h2>
            <p style={{ color: '#444', fontSize: 16 }}>SajiloStay is not responsible for user actions or third-party content. Please use the platform safely and report any issues.</p>
            <h2 style={{ color: '#7c3aed', fontSize: '1.2rem' }}>Contact</h2>
            <p style={{ color: '#444', fontSize: 16 }}>For questions about these terms, email <a href="mailto:support@sajilostay.com" style={{ color: '#7c3aed', textDecoration: 'underline' }}>support@sajilostay.com</a>.</p>
        </EnhancedPageLayout>
    );
} 
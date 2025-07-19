import React from 'react';
import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';
import { FaNewspaper, FaDownload, FaEnvelope } from 'react-icons/fa';

const mentions = [
    { outlet: 'The Kathmandu Post', link: '#', quote: 'SajiloStay is changing how Nepal finds rooms.' },
    { outlet: 'Nepali Times', link: '#', quote: 'A trusted platform for students and travelers.' },
    { outlet: 'OnlineKhabar', link: '#', quote: 'Safe, simple, and local room booking.' }
];

export default function Press() {
    return (
        <EnhancedPageLayout icon={<FaNewspaper />} title="Press & Media">
            <p style={{ marginBottom: 32 }}>
                For media inquiries, interviews, or to request our press kit, please contact <a href="mailto:press@sajilostay.com" style={{ color: '#7c3aed', textDecoration: 'underline' }}>press@sajilostay.com</a>.
            </p>
            <div style={{ marginBottom: 40 }}>
                <a href="/press-kit.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.3rem', fontSize: '1rem', textDecoration: 'none', boxShadow: '0 2px 12px #7c3aed22', transition: 'background 0.18s, box-shadow 0.18s' }}><FaDownload style={{ marginRight: 10 }} /> Download Press Kit</a>
            </div>
            <h2 style={{ fontSize: '1.3rem', color: '#7c3aed', fontWeight: 700, marginBottom: 18 }}>Media Mentions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {mentions.map((m, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 8px #7c3aed11', padding: '1.1rem 1.2rem' }}>
                        <div style={{ fontWeight: 700, color: '#312e81', fontSize: 17 }}>{m.outlet}</div>
                        <div style={{ color: '#444', fontStyle: 'italic', margin: '6px 0 0 0' }}>&ldquo;{m.quote}&rdquo;</div>
                        <a href={m.link} style={{ color: '#38bdf8', fontSize: 15, textDecoration: 'underline', marginTop: 4, display: 'inline-block' }}>Read more</a>
                    </div>
                ))}
            </div>
        </EnhancedPageLayout>
    );
} 
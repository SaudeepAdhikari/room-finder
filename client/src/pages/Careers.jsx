import React from 'react';
import { FaBriefcase, FaUsers, FaRocket, FaLaptopCode } from 'react-icons/fa';

import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';

const jobs = [
    {
        title: 'Frontend Developer',
        location: 'Kathmandu, Nepal (Hybrid)',
        type: 'Full-time',
        icon: <FaLaptopCode style={{ color: '#7c3aed', fontSize: 28 }} />,
        description: 'Build beautiful, modern UIs for SajiloStay. React, CSS, and animation skills a plus!'
    },
    {
        title: 'Community Manager',
        location: 'Remote',
        type: 'Full-time',
        icon: <FaUsers style={{ color: '#38bdf8', fontSize: 28 }} />,
        description: 'Engage with our host and guest community, organize events, and support our users.'
    },
    {
        title: 'Growth Marketer',
        location: 'Kathmandu, Nepal',
        type: 'Part-time',
        icon: <FaRocket style={{ color: '#f59e0b', fontSize: 28 }} />,
        description: 'Help us reach more travelers and hosts through creative campaigns and partnerships.'
    }
];

export default function Careers() {
    return (
        <EnhancedPageLayout icon={<FaBriefcase />} title="Careers at SajiloStay">
            <p style={{ marginBottom: 32 }}>
                Join our mission-driven team and help revolutionize how Nepal finds rooms and homes. We value creativity, collaboration, and a passion for making a difference.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {jobs.map((job, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px #7c3aed11', padding: '1.5rem 1.2rem', gap: 20 }}>
                        <div>{job.icon}</div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#312e81' }}>{job.title}</h3>
                            <div style={{ color: '#7c3aed', fontWeight: 500, fontSize: 15, margin: '4px 0 8px 0' }}>{job.location} &bull; {job.type}</div>
                            <div style={{ color: '#444', fontSize: 15 }}>{job.description}</div>
                        </div>
                        <a href="mailto:careers@sajilostay.com?subject=Application: " style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.3rem', fontSize: '1rem', textDecoration: 'none', boxShadow: '0 2px 12px #7c3aed22', transition: 'background 0.18s, box-shadow 0.18s' }}>Apply</a>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 48, textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.3rem', color: '#7c3aed', fontWeight: 700 }}>Don’t see your dream job?</h2>
                <p style={{ color: '#444' }}>We’re always looking for passionate people. Email <a href="mailto:careers@sajilostay.com" style={{ color: '#7c3aed', textDecoration: 'underline' }}>careers@sajilostay.com</a> and tell us how you can make a difference!</p>
            </div>
        </EnhancedPageLayout>
    );
} 
import React from 'react';
import { FaBlog, FaArrowRight } from 'react-icons/fa';

import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';

const posts = [
    {
        title: 'Room Hunting Tips in Nepal',
        img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
        summary: 'Find out how to get the best deals and avoid scams when searching for a room in Nepal.',
        link: '#'
    },
    {
        title: 'Hostel vs Apartment: What’s Best?',
        img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
        summary: 'We compare the pros and cons of hostels and apartments for students and travelers.',
        link: '#'
    },
    {
        title: 'Meet Our Hosts',
        img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
        summary: 'Stories from some of the amazing hosts on SajiloStay.',
        link: '#'
    }
];

export default function Blog() {
    return (
        <EnhancedPageLayout icon={<FaBlog />} title="SajiloStay Blog">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {posts.map((post, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px #7c3aed11', padding: '1.5rem 1.2rem', gap: 20 }}>
                        <img src={post.img} alt={post.title} style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #7c3aed22' }} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: '#312e81' }}>{post.title}</h3>
                            <div style={{ color: '#444', fontSize: 15, margin: '8px 0 10px 0' }}>{post.summary}</div>
                            <a href={post.link} style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', fontSize: 15 }}>Read more <FaArrowRight style={{ marginLeft: 6 }} /></a>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 48, textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.3rem', color: '#7c3aed', fontWeight: 700 }}>Want to contribute?</h2>
                <p style={{ color: '#444' }}>Email <a href="mailto:blog@sajilostay.com" style={{ color: '#7c3aed', textDecoration: 'underline' }}>blog@sajilostay.com</a> to share your story or tips!</p>
            </div>
        </EnhancedPageLayout>
    );
} 
import React from 'react';
import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';
import { FaSitemap, FaChevronRight } from 'react-icons/fa';

const links = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Safety', href: '/safety' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refunds' }
];

export default function Sitemap() {
    return (
        <EnhancedPageLayout icon={<FaSitemap />} title="Sitemap">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {links.map((l, i) => (
                    <li key={i}>
                        <a href={l.href} style={{ display: 'flex', alignItems: 'center', color: '#312e81', fontWeight: 600, fontSize: 17, textDecoration: 'none', background: '#f8fafc', borderRadius: 10, padding: '0.9rem 1.2rem', boxShadow: '0 2px 8px #7c3aed11', transition: 'box-shadow 0.18s' }}>
                            <FaChevronRight style={{ marginRight: 10, color: '#7c3aed' }} /> {l.label}
                        </a>
                    </li>
                ))}
            </ul>
        </EnhancedPageLayout>
    );
} 
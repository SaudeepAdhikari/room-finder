import React, { useState } from 'react';
import EnhancedPageLayout from '../components/ui/EnhancedPageLayout';
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
    {
        q: 'How do I book a room?',
        a: 'Search for your desired location, select a room, and follow the booking instructions.'
    },
    {
        q: 'How do I list my property?',
        a: 'Sign up as a host and use the "Post Your Room" feature to add your property.'
    },
    {
        q: 'Is SajiloStay safe?',
        a: 'Yes! We verify listings and provide secure communication and payment options.'
    }
];

export default function FAQ() {
    const [open, setOpen] = useState(null);
    return (
        <EnhancedPageLayout icon={<FaQuestionCircle />} title="Frequently Asked Questions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {faqs.map((faq, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 8px #7c3aed11', padding: '1.1rem 1.2rem' }}>
                        <button onClick={() => setOpen(open === i ? null : i)} style={{ background: 'none', border: 'none', color: '#312e81', fontWeight: 700, fontSize: 17, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            {faq.q} {open === i ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {open === i && <div style={{ color: '#444', fontSize: 15, marginTop: 8 }}>{faq.a}</div>}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 40, background: 'linear-gradient(90deg, #7c3aed11 0%, #38bdf811 100%)', borderRadius: 12, padding: '1.5rem 1.2rem', textAlign: 'center', color: '#444', fontSize: 16 }}>
                <b>Still have questions?</b> <a href="/help" style={{ color: '#7c3aed', textDecoration: 'underline' }}>Visit our Help Center</a> or <a href="/contact" style={{ color: '#7c3aed', textDecoration: 'underline' }}>Contact us</a>.
            </div>
        </EnhancedPageLayout>
    );
} 
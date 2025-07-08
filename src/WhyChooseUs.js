import React from 'react';

const features = [
  { icon: '✅', title: 'Verified Listings', desc: 'All rooms are checked for authenticity.' },
  { icon: '💬', title: 'Easy Communication', desc: 'Chat directly with property owners.' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Book your room in just a few clicks.' },
  { icon: '⭐', title: 'Trusted by Thousands', desc: 'Thousands of happy users.' },
];

function WhyChooseUs() {
  return (
    <section>
      <h2 className="card-title" style={{ textAlign: 'center', marginBottom: 32 }}>Why Choose Us?</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        {features.map(f => (
          <div key={f.title} className="card" style={{ borderRadius: 16, padding: 24, minWidth: 220, maxWidth: 260, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</div>
            <div style={{ fontSize: 16 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;

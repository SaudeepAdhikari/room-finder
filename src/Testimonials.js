import React from 'react';

const testimonials = [
  { name: 'Sujan', text: 'Found my dream flat in just 2 days. Super easy and reliable!', city: 'Kathmandu' },
  { name: 'Priya', text: 'The best platform for finding roommates. Highly recommended!', city: 'Pokhara' },
  { name: 'Anil', text: 'Great listings and very helpful support team.', city: 'Lalitpur' },
];

function Testimonials() {
  return (
    <section>
      <h2 className="card-title" style={{ textAlign: 'center', marginBottom: 32 }}>What Our Users Say</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        {testimonials.map(t => (
          <div key={t.name} className="card" style={{ borderRadius: 16, padding: 24, minWidth: 220, maxWidth: 320, textAlign: 'center' }}>
            <div style={{ fontStyle: 'italic', fontSize: 16, marginBottom: 12 }}>&quot;{t.text}&quot;</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>{t.name}</div>
            <div style={{ color: 'var(--primary)', fontSize: 15 }}>{t.city}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;

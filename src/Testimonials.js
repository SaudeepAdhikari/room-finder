import React from 'react';

const testimonials = [
  { name: 'Sujan', text: 'Found my dream flat in just 2 days. Super easy and reliable!', city: 'Kathmandu' },
  { name: 'Priya', text: 'The best platform for finding roommates. Highly recommended!', city: 'Pokhara' },
  { name: 'Anil', text: 'Great listings and very helpful support team.', city: 'Lalitpur' },
];

function Testimonials() {
  return (
    <section style={{
      padding: '48px 0',
      background: 'rgba(63,0,153,0.10)',
      backgroundImage: 'linear-gradient(135deg, rgba(63,0,153,0.10) 0%, rgba(0,212,255,0.08) 100%)',
      borderRadius: 32,
      margin: '0 auto',
      maxWidth: 1200,
      boxShadow: '0 4px 32px 0 rgba(120,63,255,0.08)',
      position: 'relative',
    }}>
      <h2 className="card-title" style={{ textAlign: 'center', marginBottom: 40, fontWeight: 900, fontSize: 32, color: '#a855f7', letterSpacing: 0.2 }}>What Our Users Say</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className="card"
            style={{
              borderRadius: 22,
              padding: 32,
              minWidth: 240,
              maxWidth: 340,
              textAlign: 'center',
              background: 'rgba(63,0,153,0.60)',
              backgroundImage: 'linear-gradient(135deg, rgba(63,0,153,0.60) 0%, rgba(0,212,255,0.45) 100%)',
              boxShadow: '0 8px 32px 0 rgba(120,63,255,0.13)',
              border: '2.5px solid rgba(168,85,247,0.13)',
              color: '#fff',
              position: 'relative',
              marginBottom: 16,
              animation: `fadeInUp 0.8s cubic-bezier(.4,1.3,.6,1) ${(i * 0.12).toFixed(2)}s both`,
            }}
          >
            {/* Avatar circle with initial */}
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 2px 8px #a855f7cc',
              border: '2.5px solid #fff',
              letterSpacing: 0.2,
            }}>{t.name[0]}</div>
            <div style={{ fontStyle: 'italic', fontSize: 17, marginBottom: 16, color: '#e0e7ff', fontWeight: 500 }}>&quot;{t.text}&quot;</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 2 }}>{t.name}</div>
            <div style={{ color: '#38bdf8', fontSize: 16, fontWeight: 700 }}>{t.city}</div>
          </div>
        ))}
      </div>
      {/* Animated entrance keyframes */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px) scale(0.98); }
          100% { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

export default Testimonials;

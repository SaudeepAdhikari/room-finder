import React from 'react';

const testimonials = [
  { name: 'Sujan', text: 'Found my dream flat in just 2 days. Super easy and reliable!', city: 'Kathmandu' },
  { name: 'Priya', text: 'The best platform for finding roommates. Highly recommended!', city: 'Pokhara' },
  { name: 'Anil', text: 'Great listings and very helpful support team.', city: 'Lalitpur' },
];

function Testimonials() {
  return (
    <section style={{padding:'40px 0',background:'#fff'}}>
      <h2 style={{textAlign:'center',color:'var(--primary)',marginBottom:32}}>What Our Users Say</h2>
      <div style={{display:'flex',justifyContent:'center',gap:32,flexWrap:'wrap'}}>
        {testimonials.map(t => (
          <div key={t.name} style={{background:'#f6f8fa',borderRadius:16,padding:24,minWidth:220,maxWidth:320,boxShadow:'0 2px 8px #1976d211',textAlign:'center'}}>
            <div style={{fontStyle:'italic',fontSize:16,marginBottom:12}}>&quot;{t.text}&quot;</div>
            <div style={{fontWeight:700,fontSize:18}}>{t.name}</div>
            <div style={{color:'#1976d2',fontSize:15}}>{t.city}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;

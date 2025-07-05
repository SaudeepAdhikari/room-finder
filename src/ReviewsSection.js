import React from 'react';

function ReviewsSection({ reviews }) {
  return (
    <div style={{marginTop:32}}>
      <h3 style={{marginBottom:20}}>Reviews</h3>
      <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
        {reviews.map((r,i) => (
          <div key={i} style={{background:'#f6f8fa',borderRadius:12,padding:18,minWidth:220,maxWidth:320,boxShadow:'0 2px 8px #1976d211'}}>
            <div style={{fontSize:20,color:'#ffb300',marginBottom:8}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
            <div style={{fontStyle:'italic',fontSize:15,marginBottom:10}}>&quot;{r.text}&quot;</div>
            <div style={{fontWeight:700,fontSize:16}}>{r.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsSection;

import React, { useState } from 'react';

function ImageCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx(i => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div style={{position:'relative',width:'100%',height:340,marginBottom:24}}>
      <img src={images[idx]} alt='' style={{width:'100%',height:340,objectFit:'cover',borderRadius:12,boxShadow:'0 2px 8px #1976d211'}} />
      {images.length > 1 && (
        <>
          <button onClick={prev} style={navBtn('left')}>{'<'}</button>
          <button onClick={next} style={navBtn('right')}>{'>'}</button>
        </>
      )}
      <div style={{position:'absolute',bottom:16,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8}}>
        {images.map((_,i)=>(
          <span key={i} style={{width:10,height:10,borderRadius:'50%',background:i===idx?'#1976d2':'#bbb',display:'inline-block'}} />
        ))}
      </div>
    </div>
  );
}

const navBtn = (side) => ({
  position:'absolute',
  top:'50%',
  [side]:16,
  transform:'translateY(-50%)',
  background:'#fff',
  border:'none',
  borderRadius:'50%',
  boxShadow:'0 2px 8px #0002',
  width:36,
  height:36,
  fontSize:20,
  cursor:'pointer',
  opacity:0.8
});

export default ImageCarousel;

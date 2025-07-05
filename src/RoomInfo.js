import React from 'react';

function RoomInfo({ title, price, available, roommatePref }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,gap:24,flexWrap:'wrap'}}>
      <div>
        <div style={{fontWeight:700,fontSize:28,marginBottom:6}}>{title}</div>
        <div style={{color:'#1976d2',fontWeight:600,fontSize:22,marginBottom:4}}>Rs. {price}</div>
        <div style={{fontSize:16,color:available?'#388e3c':'#b71c1c',fontWeight:600}}>{available ? 'Available' : 'Not Available'}</div>
        <div style={{fontSize:15,color:'#555',marginTop:4}}>Preference: {roommatePref}</div>
      </div>
    </div>
  );
}

export default RoomInfo;

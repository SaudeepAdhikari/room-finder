import React from 'react';

function RoomCard({ room }) {
  return (
    <div style={{background:'#fff',borderRadius:16,boxShadow:'0 2px 8px #1976d211',width:310,padding:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
      <img src={room.img} alt={room.title} style={{width:'100%',height:150,objectFit:'cover'}} />
      <div style={{padding:16,flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700,fontSize:20,marginBottom:4}}>{room.title}</div>
          <div style={{color:'#1976d2',fontWeight:600,fontSize:18,marginBottom:8}}>Rs. {room.price}</div>
          <div style={{fontSize:15,marginBottom:8}}>{room.summary}</div>
          <div style={{fontSize:14,color:'#555'}}>{room.location}</div>
        </div>
        <div style={{marginTop:12,display:'flex',gap:8}}>
          <span style={{background:'#e3f2fd',color:'#1976d2',borderRadius:8,padding:'2px 10px',fontSize:13}}>{room.type}</span>
          <span style={{background:'#fce4ec',color:'#c2185b',borderRadius:8,padding:'2px 10px',fontSize:13}}>{room.gender}</span>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;

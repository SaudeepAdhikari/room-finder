import React, { useState } from 'react';

function MenuBar({ onNavigate, activePage, onMenuSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',zIndex:1001}}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{background:'#1976d2',color:'#fff',border:'none',borderRadius:'50%',width:60,height:60,boxShadow:'0 2px 8px #0003',fontSize:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
        aria-label="Open menu"
      >
        ☰
      </button>
      {open && (
        <div style={{position:'absolute',bottom:70,left:'50%',transform:'translateX(-50%)',background:'#fff',boxShadow:'0 2px 12px #0002',borderRadius:12,padding:16,minWidth:220}}>
          <ul style={{listStyle:'none',margin:0,padding:0}}>
            <li><button onClick={()=>{setOpen(false);onNavigate('home')}} style={activePage==='home'?{...menuBtn,background:'#1976d2',color:'#fff'}:menuBtn}>Home</button></li>
            <li><button onClick={()=>{setOpen(false);onNavigate('search')}} style={activePage==='search'?{...menuBtn,background:'#1976d2',color:'#fff'}:menuBtn}>Search</button></li>
            <li><button onClick={()=>{setOpen(false);onNavigate('detail')}} style={activePage==='detail'?{...menuBtn,background:'#1976d2',color:'#fff'}:menuBtn}>Room Detail</button></li>
          </ul>
        </div>
      )}
    </div>
  );
}

const menuBtn = {
  width:'100%',
  background:'none',
  border:'none',
  color:'#1976d2',
  fontSize:18,
  padding:'12px 0',
  textAlign:'left',
  borderRadius:8,
  cursor:'pointer',
  margin:'4px 0',
  fontWeight:'bold'
};

export default MenuBar;

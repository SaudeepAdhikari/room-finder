import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MenuBar({ onNavigate, activePage, onMenuSelect }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',zIndex:1100}}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{background:'var(--primary-gradient)',color:'#fff',border:'none',borderRadius:'50%',width:66,height:66,boxShadow:'var(--shadow)',fontSize:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'box-shadow var(--transition),transform var(--transition)'}}
        aria-label={open ? "Close menu" : "Open menu"}
        onMouseOver={e=>{e.currentTarget.style.boxShadow='var(--shadow-hover)';e.currentTarget.style.transform='scale(1.04)'}}
        onMouseOut={e=>{e.currentTarget.style.boxShadow='var(--shadow)';e.currentTarget.style.transform='none'}}
      >
        <span style={{fontSize:36}}>{open ? '✕' : '☰'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', stiffness: 330, damping: 30 }}
            style={{
              position:'absolute',
              bottom:80,
              left:'50%',
              transform:'translateX(-50%)',
              background:'rgba(255,255,255,0.96)',
              backdropFilter:'blur(8px)',
              boxShadow:'var(--shadow)',
              borderRadius:16,
              padding:24,
              minWidth:230,
              width: '90vw',
              maxWidth: 340,
              zIndex: 1200,
              ...(window.innerWidth < 600 ? {left: '50%', width: '96vw', minWidth: 'unset', right: 0, transform: 'translateX(-50%)'} : {})
            }}
          >
            <ul style={{listStyle:'none',margin:0,padding:0}}>
              <li><button onClick={()=>{setOpen(false);onNavigate('home')}} style={activePage==='home'?{...menuBtn,background:'var(--primary-light)',color:'#fff'}:menuBtn}>Home</button></li>
              <li><button onClick={()=>{setOpen(false);onNavigate('search')}} style={activePage==='search'?{...menuBtn,background:'var(--primary-light)',color:'#fff'}:menuBtn}>Search</button></li>
              <li><button onClick={()=>{setOpen(false);onNavigate('detail')}} style={activePage==='detail'?{...menuBtn,background:'var(--primary-light)',color:'#fff'}:menuBtn}>Room Detail</button></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const menuBtn = {
  width:'100%',
  background:'none',
  border:'none',
  color:'var(--primary-light)',
  fontSize:20,
  padding:'16px 0',
  textAlign:'left',
  borderRadius:10,
  cursor:'pointer',
  margin:'6px 0',
  fontWeight:700,
  transition:'background var(--transition),color var(--transition)'
};

export default MenuBar;

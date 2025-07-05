import React from 'react';

function Header({ onPostProperty, onNavigate, activePage }) {
  const navBtn = (active) => ({
    background: active ? '#1976d2' : 'none',
    color: active ? '#fff' : 'var(--primary)',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontWeight: 600,
    fontSize: 17,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  });
  return (
    <header style={{
      width: '100%',
      background: '#fff',
      color: 'var(--primary)',
      boxShadow: '0 2px 12px #0001',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #e3e8ee'
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 64
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <img src="/logo192.png" alt="RoomFinder logo" style={{height:40, width:40, borderRadius:8, background:'#fff', boxShadow:'0 2px 8px #0001'}} />
          <span style={{fontWeight: 'bold', fontSize: 26, color: 'var(--primary)'}}>RoomFinder</span>
        </div>
        <ul style={{
          display: 'flex',
          gap: 32,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: 17,
          fontWeight: 500,
          color: 'var(--primary)'
        }}>
          <li><button onClick={()=>onNavigate('home')} style={navBtn(activePage==='home')}>Home</button></li>
          <li><button onClick={()=>onNavigate('search')} style={navBtn(activePage==='search')}>All Listings</button></li>
          <li><button onClick={()=>onNavigate('featured')} style={navBtn(activePage==='featured')}>Featured</button></li>
          <li><button onClick={()=>onNavigate('faq')} style={navBtn(activePage==='faq')}>FAQ</button></li>
        </ul>
        <button
          onClick={onPostProperty}
          style={{
            background: 'var(--primary-gradient)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 17,
            padding: '10px 28px',
            boxShadow: '0 2px 8px #1976d233',
            cursor: 'pointer',
            transition: 'background 0.2s',
            marginLeft: 24
          }}
        >
          + Post Your Property
        </button>
      </nav>
    </header>
  );
}

export default Header;

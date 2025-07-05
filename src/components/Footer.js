import React from 'react';

function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#222',
      color: '#fff',
      padding: '24px 0',
      marginTop: 32,
      fontSize: 16,
      textAlign: 'center'
    }}>
      <div style={{maxWidth: 1200, margin: '0 auto', padding: '0 24px'}}>
        <div style={{marginBottom: 12}}>
          &copy; {new Date().getFullYear()} RoomFinder. All rights reserved.
        </div>
        <div>
          <a href="#" style={{color: '#90caf9', textDecoration: 'none', margin: '0 12px'}}>Privacy Policy</a>
          <a href="#" style={{color: '#90caf9', textDecoration: 'none', margin: '0 12px'}}>Terms of Service</a>
          <a href="#" style={{color: '#90caf9', textDecoration: 'none', margin: '0 12px'}}>Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import React, { useState } from 'react';
import './App.css';
import './theme.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuBar from './components/MenuBar';
import { PAGES } from './pages';

function App() {
  const [page, setPage] = useState('home');
  const PageComp = PAGES[page] || PAGES.home;
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Header onNavigate={setPage} activePage={page} />
      <MenuBar onNavigate={setPage} activePage={page} />
      <main style={{flex:1}}>
        <PageComp />
      </main>
      <Footer />
    </div>
  );
}

export default App;

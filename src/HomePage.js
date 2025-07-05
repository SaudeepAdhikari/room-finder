import React, { useState } from 'react';
import HeroSearch from './HeroSearch';
import PopularCities from './PopularCities';
import FeaturedProperties from './FeaturedProperties';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import RoomList from './RoomList';
import AddRoomForm from './AddRoomForm';

function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleHeroSearch = ({ location, price, date }) => {
    setSearch(location);
    // Optionally, handle price and date as filters in future
  };
  const handleCitySelect = city => setSearch(city);
  const handleRoomAdded = () => {
    setShowAddForm(false);
    setRefresh(r => !r);
  };

  return (
    <div>
      <HeroSearch onSearch={handleHeroSearch} />
      <PopularCities onCitySelect={handleCitySelect} />
      <FeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
      <section style={{padding:'32px 0', background:'#f9f9f9'}}>
        <h2 style={{textAlign:'center'}}>All Listings</h2>
        {showAddForm && (
          <div style={{maxWidth:600, margin:'32px auto', background:'#fff', borderRadius:8, boxShadow:'0 2px 8px #0001', padding:24}}>
            <AddRoomForm onRoomAdded={handleRoomAdded} />
            <button onClick={()=>setShowAddForm(false)} style={{marginTop:8, color:'#1976d2', background:'none', border:'none', cursor:'pointer'}}>Cancel</button>
          </div>
        )}
        <RoomList key={refresh} search={search} category={category} />
      </section>
    </div>
  );
}

export default HomePage;

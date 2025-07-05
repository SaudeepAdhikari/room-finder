import React from 'react';

function FiltersSidebar({ filters, setFilters }) {
  return (
    <aside style={{background:'#fff',borderRadius:16,boxShadow:'0 2px 8px #1976d211',padding:24,minWidth:220,maxWidth:260}}>
      <h3 style={{color:'var(--primary)',marginBottom:16}}>Filters</h3>
      <div style={{marginBottom:16}}>
        <label>Rent Range</label><br/>
        <input type="number" placeholder="Min" value={filters.rentMin} onChange={e=>setFilters(f=>({...f,rentMin:e.target.value}))} style={{width:90,marginRight:8}} />
        <input type="number" placeholder="Max" value={filters.rentMax} onChange={e=>setFilters(f=>({...f,rentMax:e.target.value}))} style={{width:90}} />
      </div>
      <div style={{marginBottom:16}}>
        <label>Location</label><br/>
        <input type="text" placeholder="City or Area" value={filters.location} onChange={e=>setFilters(f=>({...f,location:e.target.value}))} style={{width:'100%'}} />
      </div>
      <div style={{marginBottom:16}}>
        <label>Room Type</label><br/>
        <select value={filters.roomType} onChange={e=>setFilters(f=>({...f,roomType:e.target.value}))} style={{width:'100%'}}>
          <option value="">Any</option>
          <option value="Private">Private</option>
          <option value="Shared">Shared</option>
        </select>
      </div>
      <div style={{marginBottom:0}}>
        <label>Gender Preference</label><br/>
        <select value={filters.gender} onChange={e=>setFilters(f=>({...f,gender:e.target.value}))} style={{width:'100%'}}>
          <option value="">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </aside>
  );
}

export default FiltersSidebar;

import React, { useState } from 'react';

const StepAvailabilityCalendar = ({ data, updateData, next, back }) => {
  const [calendar, setCalendar] = useState(data.availabilityCalendar || []);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');

  const addRange = () => {
    if (!start || !end) {
      setError('Both start and end dates are required.');
      return;
    }
    if (start > end) {
      setError('Start date cannot be after end date.');
      return;
    }
    setCalendar([...calendar, { start, end }]);
    setStart('');
    setEnd('');
    setError('');
  };

  const removeRange = (idx) => {
    setCalendar(calendar.filter((_, i) => i !== idx));
  };

  const handleNext = () => {
    updateData('availabilityCalendar', calendar);
    next();
  };

  return (
    <div style={{maxWidth:500,margin:'0 auto',display:'flex',flexDirection:'column',gap:18}}>
      <h2 style={{marginBottom:8}}>Availability Calendar</h2>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <input type="date" value={start} onChange={e=>setStart(e.target.value)} style={{padding:8,borderRadius:6,border:'1px solid #ccc'}} />
        <span>to</span>
        <input type="date" value={end} onChange={e=>setEnd(e.target.value)} style={{padding:8,borderRadius:6,border:'1px solid #ccc'}} />
        <button onClick={addRange} style={{padding:'8px 16px',background:'var(--primary-gradient)',color:'#fff',border:'none',borderRadius:8,fontWeight:600}}>Add</button>
      </div>
      {error && <span style={{color:'red',fontSize:13}}>{error}</span>}
      <ul style={{marginTop:12}}>
        {calendar.map((range, idx) => (
          <li key={idx} style={{marginBottom:6}}>
            {range.start} to {range.end}
            <button onClick={()=>removeRange(idx)} style={{marginLeft:12,color:'#d32f2f',background:'none',border:'none',cursor:'pointer'}}>Remove</button>
          </li>
        ))}
      </ul>
      <div style={{display:'flex',gap:10,marginTop:20}}>
        <button onClick={back} style={{padding:'10px 0',background:'#eee',color:'#444',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer',flex:1}}>Back</button>
        <button onClick={handleNext} style={{padding:'10px 0',background:'var(--primary-gradient)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer',flex:2}}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StepAvailabilityCalendar;

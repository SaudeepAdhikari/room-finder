import React, { useState } from 'react';

const preferenceOptions = [
  'No preference',
  'Students only',
  'Females only',
  'Males only',
  'Working professionals',
  'Non-smokers',
  'Vegetarians only',
];

const StepRoommatePreference = ({ data, updateData, next, back }) => {
  const [preference, setPreference] = useState(data.roommatePreference || 'No preference');

  const handleNext = () => {
    updateData('roommatePreference', preference);
    next();
  };

  return (
    <div style={{maxWidth:500,margin:'0 auto',display:'flex',flexDirection:'column',gap:18}}>
      <h2 style={{marginBottom:8}}>Roommate Preference</h2>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {preferenceOptions.map(opt => (
          <label key={opt} style={{display:'flex',alignItems:'center',gap:8,fontWeight:500}}>
            <input
              type="radio"
              name="roommatePreference"
              value={opt}
              checked={preference === opt}
              onChange={() => setPreference(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      <div style={{display:'flex',gap:10,marginTop:20}}>
        <button onClick={back} style={{padding:'10px 0',background:'#eee',color:'#444',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer',flex:1}}>Back</button>
        <button onClick={handleNext} style={{padding:'10px 0',background:'var(--primary-gradient)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer',flex:2}}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StepRoommatePreference;

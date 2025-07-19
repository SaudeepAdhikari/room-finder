import React, { useRef, useState } from 'react';

const StepRentDocuments = ({ data, updateData, next, back }) => {
  const fileInputRef = useRef();
  const [docs, setDocs] = useState(data.rentDocuments || []);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocs(files);
    setError('');
  };

  const handleNext = () => {
    updateData('rentDocuments', docs);
    next();
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h2 style={{ marginBottom: 8 }}>Upload Rent Documents <span style={{ fontWeight: 400, fontSize: 15 }}>(optional)</span></h2>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Accepted: PDF, images. You can skip this step.</div>
      <ul>
        {docs.map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
      {error && <span style={{ color: 'red', fontSize: 13 }}>{error}</span>}
    </div>
  );
};

export default StepRentDocuments;

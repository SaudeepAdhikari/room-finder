import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MAX_IMAGES = 6;

const StepImages = ({ data, updateData, next, back }) => {
  const fileInputRef = useRef();
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validate = (images) => {
    if (!images || images.length === 0) return 'At least 1 image is required.';
    if (images.length > MAX_IMAGES) return `Maximum ${MAX_IMAGES} images allowed.`;
    return '';
  };

  // Upload a single file to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setError('');
    try {
      const res = await fetch('/api/rooms/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.imageUrl;
    } catch (e) {
      setError('Image upload failed.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle new files (from drop or file input)
  const handleFiles = async (files) => {
    const validFiles = files.slice(0, MAX_IMAGES - (data.images?.length || 0));
    const validationError = validate([...(data.images || []), ...validFiles]);
    setError(validationError);
    if (validationError) return;
    setUploading(true);
    let uploaded = data.images ? [...data.images] : [];
    for (let i = 0; i < validFiles.length; i++) {
      setUploadProgress(Math.round(((i + 1) / validFiles.length) * 100));
      const url = await uploadImage(validFiles[i]);
      if (url) uploaded.push(url);
    }
    setUploadProgress(0);
    setUploading(false);
    updateData('images', uploaded);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleNext = () => {
    const validationError = validate(data.images);
    setError(validationError);
    if (!validationError) next();
  };

  const handleRemove = (idx) => {
    const newImages = data.images.filter((_, i) => i !== idx);
    updateData('images', newImages);
  };

  return (
    <motion.div
      className="step-images"
      style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ marginBottom: 8 }}>Upload Images</h2>
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: dragActive ? '2px solid #1976d2' : '2px dashed #aaa',
          padding: 32,
          marginBottom: 10,
          borderRadius: 10,
          background: dragActive ? '#e3f0fd' : '#fafbfc',
          textAlign: 'center',
          color: '#666',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'border .2s, background .2s'
        }}
        onClick={() => fileInputRef.current.click()}
      >
        Drag & drop images here or <span style={{ color: '#1976d2' }}>Browse</span>
        {uploading && (
          <div style={{ marginTop: 10 }}>
            <span style={{ color: '#1976d2' }}>Uploading... {uploadProgress}%</span>
          </div>
        )}
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="preview-images" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
        {data.images && data.images.map((url, idx) => (
          <div key={idx} style={{ position: 'relative', border: '1px solid #eee', borderRadius: 8, padding: 4, background: '#fff' }}>
            <img
              src={url}
              alt="preview"
              style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 6 }}
            />
            <button onClick={() => handleRemove(idx)} style={{ position: 'absolute', top: 2, right: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, color: '#d32f2f', boxShadow: '0 1px 4px #0002' }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: '#888' }}>Max {MAX_IMAGES} images. First image will be the cover.</div>
      {error && <span style={{ color: 'red', fontSize: 13 }}>{error}</span>}
    </motion.div>
  );
};

export default StepImages;

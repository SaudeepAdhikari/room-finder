import React, { useState } from 'react';
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

export default function Upload360Form({ onUpload }) {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [roomId, setRoomId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Reset states
            setError('');
            setSuccess(false);
            setImage(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!image) {
            setError('Please select an image');
            return;
        }
        
        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }
        
        setUploading(true);
        
        // Check if environment variables are available
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            setError('Upload configuration is missing. Please contact support.');
            setUploading(false);
            return;
        }

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            
            const imageUrl = res.data.secure_url;
            
            // Save metadata
            const meta = { 
                roomId: roomId || 'default', 
                title, 
                imageUrl, 
                uploadedAt: new Date().toISOString() 
            };
            
            onUpload(meta); // Pass to parent
            
            // Reset form
            setImage(null);
            setTitle('');
            setRoomId('');
            setSuccess(true);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <h2 style={{ marginBottom: 16, color: '#4f46e5' }}>Upload 360° Room Image</h2>
            
            {error && (
                <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '15px' }}>
                    {error}
                </div>
            )}
            
            {success && (
                <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '15px' }}>
                    Upload successful!
                </div>
            )}
            
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Room ID (optional)</label>
                <input 
                    type="text" 
                    placeholder="Enter room identifier" 
                    value={roomId} 
                    onChange={e => setRoomId(e.target.value)} 
                    style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px' 
                    }} 
                />
            </div>
            
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Title*</label>
                <input 
                    type="text" 
                    placeholder="Enter a descriptive title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                    style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px' 
                    }} 
                />
            </div>
            
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>360° Image*</label>
                <div style={{ 
                    border: '2px dashed #d1d5db',
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s ease'
                }}>
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        id="file360Input"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file360Input" style={{ cursor: 'pointer', display: 'block' }}>
                        {image ? image.name : 'Click to select or drop an image here'}
                    </label>
                </div>
            </div>
            
            <button 
                type="submit" 
                disabled={uploading} 
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    background: uploading ? '#a78bfa' : '#7c3aed', 
                    color: '#fff', 
                    fontWeight: '600',
                    border: 'none',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                }}
            >
                {uploading ? 'Uploading...' : 'Upload 360° Image'}
            </button>
        </form>
    );
} 
import React, { useState } from 'react';
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

export default function Upload360Form({ onUpload }) {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [roomId, setRoomId] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return alert('Please select an image');
        setUploading(true);

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
            // Save metadata (simulate Firestore)
            const meta = { roomId, title, imageUrl, uploadedAt: new Date().toISOString() };
            onUpload(meta); // Pass to parent or save in state
            setImage(null);
            setTitle('');
            setRoomId('');
            alert('Upload successful!');
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 16 }}>
            <h2>Upload 360° Room Image</h2>
            <input type="text" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
            <input type="file" accept="image/*" onChange={handleFileChange} required style={{ marginBottom: 12 }} />
            <button type="submit" disabled={uploading} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#7c3aed', color: '#fff', fontWeight: 700 }}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
} 
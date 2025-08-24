import React, { useState } from 'react';
import { addRoom } from './api';

function AddRoomForm({ onRoomAdded }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    amenities: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const room = {
        ...form,
        price: Number(form.price),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean)
      };
      await addRoom(room);
      setForm({ title: '', description: '', location: '', price: '', amenities: '', imageUrl: '' });
      if (onRoomAdded) onRoomAdded();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32, border: '1px solid #eee', padding: 24, borderRadius: 8 }}>
      <h2>Add New Room</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
      <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
      <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
      <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>Add Room</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}

export default AddRoomForm;

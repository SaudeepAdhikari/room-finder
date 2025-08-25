import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSync, FaSearch, FaToggleOn, FaToggleOff, FaImage } from 'react-icons/fa/index.esm.js';
import './RoomManagement.css';
import { fetchAllRoomsAdminEnhanced, addRoomAdmin, updateRoomAdmin, deleteRoomAdmin } from '../api.js';

const initialForm = {
    title: '',
    description: '',
    location: '',
    price: '',
    amenities: '',
    imageUrl: '',
    status: 'active',
};

function RoomManagement({ searchFilter }) {
    const [rooms, setRooms] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [imgUploading, setImgUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    useEffect(() => {
        let data = [...rooms];
        
        // Apply text search filter
        if (search) {
            data = data.filter(r =>
                r.title.toLowerCase().includes(search.toLowerCase()) ||
                r.location.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Apply search filter from universal search if present
        if (searchFilter) {
            data = data.filter(r => r._id === searchFilter);
        }
        
        data.sort((a, b) => {
            if (sortDir === 'asc') return (a[sort] > b[sort] ? 1 : -1);
            return a[sort] < b[sort] ? 1 : -1;
        });
        setFiltered(data);
    }, [rooms, search, sort, sortDir, searchFilter]);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const data = await fetchAllRoomsAdminEnhanced();
            setRooms(data);
        } catch (e) {
            setError('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this room?')) return;
        await deleteRoomAdmin(id);
        setRooms(rooms => rooms.filter(r => r._id !== id));
    };

    const handleEdit = room => {
        setForm({ ...room, amenities: (room.amenities || []).join(', ') });
        setEditId(room._id);
        setShowForm(true);
    };

    const handleStatusToggle = async room => {
        const updated = { ...room, status: room.status === 'active' ? 'inactive' : 'active' };
        await updateRoomAdmin(room._id, updated);
        setRooms(rooms => rooms.map(r => r._id === room._id ? updated : r));
    };

    const handleFormChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleImageUpload = async e => {
        const file = e.target.files[0];
        if (!file) return;
        setImgUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'YOUR_CLOUDINARY_PRESET'); // Replace with your Cloudinary preset
        const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload', {
            method: 'POST',
            body: data,
        });
        const json = await res.json();
        setForm(f => ({ ...f, imageUrl: json.secure_url }));
        setImgUploading(false);
    };

    const handleFormSubmit = async e => {
        e.preventDefault();
        setError('');
        const payload = {
            ...form,
            price: Number(form.price),
            amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
        };
        try {
            if (editId) {
                const updated = await updateRoomAdmin(editId, payload);
                setRooms(rooms => rooms.map(r => r._id === editId ? updated : r));
            } else {
                const created = await addRoomAdmin(payload);
                setRooms(rooms => [created, ...rooms]);
            }
            setShowForm(false);
            setForm(initialForm);
            setEditId(null);
        } catch (e) {
            setError('Failed to save room');
        }
    };

    return (
        <div className="room-mgmt-root">
            <div className="room-mgmt-header">
                <h2>Room Management</h2>
                <button className="room-mgmt-add" onClick={() => { setShowForm(true); setForm(initialForm); setEditId(null); }}><FaPlus /> Add Room</button>
            </div>
            <div className="room-mgmt-controls">
                <input className="room-mgmt-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or location..." />
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="createdAt">Newest</option>
                    <option value="price">Price</option>
                    <option value="title">Title</option>
                </select>
                <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}><FaSync /></button>
            </div>
            {loading ? (
                <div className="room-mgmt-loading" role="status">Loading...</div>
            ) : error ? (
                <div className="room-mgmt-error-panel">
                    <div>Failed to load rooms.</div>
                    <div style={{ marginTop: 8 }}>
                        <button onClick={loadRooms}><FaSync /> Retry</button>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="room-mgmt-no-data">No rooms found.</div>
            ) : (
                <div className="room-mgmt-table-wrap">
                    <table className="room-mgmt-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(room => (
                                <tr key={room._id}>
                                    <td>{room.imageUrl && <img src={room.imageUrl} alt="room" className="room-mgmt-thumb" />}</td>
                                    <td>{room.title}</td>
                                    <td>{room.location}</td>
                                    <td>{room.price}</td>
                                    <td>
                                        <button className="room-mgmt-status" onClick={() => handleStatusToggle(room)}>
                                            {room.status === 'active' ? <FaToggleOn color="#22c55e" /> : <FaToggleOff color="#ef4444" />}
                                        </button>
                                    </td>
                                    <td>
                                        <button className="room-mgmt-edit" onClick={() => handleEdit(room)}><FaEdit /></button>
                                        <button className="room-mgmt-delete" onClick={() => handleDelete(room._id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {showForm && (
                <div className="room-mgmt-modal-bg">
                    <form className="room-mgmt-modal" onSubmit={handleFormSubmit}>
                        <h3>{editId ? 'Edit Room' : 'Add Room'}</h3>
                        <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" required />
                        <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" />
                        <input name="location" value={form.location} onChange={handleFormChange} placeholder="Location" required />
                        <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" required />
                        <input name="amenities" value={form.amenities} onChange={handleFormChange} placeholder="Amenities (comma separated)" />
                        <div className="room-mgmt-img-upload">
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                            {imgUploading ? <span>Uploading...</span> : form.imageUrl && <img src={form.imageUrl} alt="preview" className="room-mgmt-thumb" />}
                        </div>
                        <select name="status" value={form.status} onChange={handleFormChange}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <div className="room-mgmt-modal-actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                        {error && <div className="room-mgmt-error">{error}</div>}
                    </form>
                </div>
            )}
        </div>
    );
}

export default RoomManagement; 
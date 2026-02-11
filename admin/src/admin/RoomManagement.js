import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSync, FaSearch, FaImage } from 'react-icons/fa/index.esm.js';
import './RoomManagement.css';
import { fetchAllRoomsAdminEnhanced, addRoomAdmin, updateRoomAdmin, deleteRoomAdmin, approveRoomAdminEnhanced, rejectRoomAdminEnhanced } from '../api.js';
import { fetchRoomByIdAdmin } from '../api.js';

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
        setForm({ ...room, amenities: (room.amenities || []).join(', '), imageUrl: room.imageUrl || (room.images && room.images[0]) || '' });
        setEditId(room._id);
        setShowForm(true);
    };

    const getThumb = room => room.imageUrl || (room.images && room.images.length ? room.images[0] : null);

    const [processingStatusId, setProcessingStatusId] = useState(null);
    const [detailRoom, setDetailRoom] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailImageIndex, setDetailImageIndex] = useState(0);

    const handleStatusChange = async (room, value) => {
        // Only handle approve/reject actions from the dropdown for pending rooms
        if (room.status !== 'pending') return;
        setProcessingStatusId(room._id);
        try {
            if (value === 'approve') {
                const updated = await approveRoomAdminEnhanced(room._id);
                setRooms(rs => rs.map(r => r._id === room._id ? updated : r));
            } else if (value === 'reject') {
                const updated = await rejectRoomAdminEnhanced(room._id);
                setRooms(rs => rs.map(r => r._id === room._id ? updated : r));
            }
        } catch (e) {
            setError('Failed to update room status');
        } finally {
            setProcessingStatusId(null);
        }
    };

    const openDetails = async (roomId) => {
        setDetailLoading(true);
        setShowDetailModal(true);
        setDetailRoom(null);
        setDetailImageIndex(0);
        try {
            const data = await fetchRoomByIdAdmin(roomId);
            setDetailRoom(data);
        } catch (e) {
            setError('Failed to load room details');
        } finally {
            setDetailLoading(false);
        }
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
                <select className="room-mgmt-select" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="createdAt">Newest</option>
                    <option value="price">Price</option>
                    <option value="title">Title</option>
                </select>
                <button className="room-mgmt-icon-btn" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} title="Toggle sort direction"><FaSync /></button>
                <button className="room-mgmt-refresh" onClick={loadRooms} title="Refresh rooms"><FaSync /> Refresh</button>
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
                                    <td>{getThumb(room) && <img src={getThumb(room)} alt="room" className="room-mgmt-thumb" />}</td>
                                    <td>{room.title}</td>
                                    <td>{room.location}</td>
                                    <td>{room.price}</td>
                                    <td>
                                        {room.status === 'pending' ? (
                                            <div>
                                                <select className="room-mgmt-status-select" disabled={processingStatusId === room._id} defaultValue="pending" onChange={e => handleStatusChange(room, e.target.value)}>
                                                    <option value="pending">Pending</option>
                                                    <option value="approve">Approve</option>
                                                    <option value="reject">Reject</option>
                                                </select>
                                                {processingStatusId === room._id && <span style={{ marginLeft: 8 }}>Processing...</span>}
                                            </div>
                                        ) : (
                                            <span style={{ fontWeight: 600, color: room.status === 'approved' || room.status === 'active' ? '#16a34a' : '#ef4444' }}>{room.status}</span>
                                        )}
                                    </td>
                                    <td>
                                        <button className="room-mgmt-edit" onClick={() => handleEdit(room)}><FaEdit /></button>
                                        <button className="room-mgmt-delete" onClick={() => handleDelete(room._id)}><FaTrash /></button>
                                        <button className="room-mgmt-details" onClick={() => openDetails(room._id)} style={{ marginLeft: 8 }}>Details</button>
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
            {showDetailModal && (
                <div className="room-mgmt-modal-bg">
                    <div className="room-mgmt-modal" style={{ maxWidth: 800 }}>
                        <h3>Room Details</h3>
                        {detailLoading ? (
                            <div>Loading...</div>
                        ) : detailRoom ? (
                            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div style={{ minWidth: 320 }}>
                                        {detailRoom.images && detailRoom.images.length > 0 ? (
                                            <div style={{ position: 'relative' }}>
                                                <img src={detailRoom.images[detailImageIndex]} alt={`detail-${detailImageIndex}`} style={{ width: 320, height: 240, objectFit: 'cover', borderRadius: 8 }} />
                                                {detailRoom.images.length > 1 && (
                                                    <div style={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)' }}>
                                                        <button onClick={() => setDetailImageIndex(i => (i - 1 + detailRoom.images.length) % detailRoom.images.length)} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}>◀</button>
                                                    </div>
                                                )}
                                                {detailRoom.images.length > 1 && (
                                                    <div style={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)' }}>
                                                        <button onClick={() => setDetailImageIndex(i => (i + 1) % detailRoom.images.length)} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}>▶</button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                        {detailRoom.images && detailRoom.images.length > 1 && (
                                            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                                {detailRoom.images.map((img, idx) => (
                                                    <button key={idx} onClick={() => setDetailImageIndex(idx)} style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}>
                                                        <img src={img} alt={`thumb-${idx}`} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, border: idx === detailImageIndex ? '2px solid #1976d2' : '1px solid #eee' }} />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 18 }}>{detailRoom.title}</div>
                                        <div style={{ color: '#666' }}>{detailRoom.location}</div>
                                        <div style={{ marginTop: 8 }}>{detailRoom.description}</div>
                                    </div>
                                </div>
                                <table style={{ width: '100%', marginTop: 12 }}>
                                    <tbody>
                                        <tr><td style={{ fontWeight: 600, padding: 6 }}>Price</td><td style={{ padding: 6 }}>{detailRoom.price}</td></tr>

                                        <tr><td style={{ fontWeight: 600, padding: 6 }}>Available From</td><td style={{ padding: 6 }}>{detailRoom.availableFrom || '-'}</td></tr>
                                        <tr><td style={{ fontWeight: 600, padding: 6 }}>Max Occupants</td><td style={{ padding: 6 }}>{detailRoom.maxOccupants || '-'}</td></tr>
                                        <tr><td style={{ fontWeight: 600, padding: 6 }}>Min Stay (months)</td><td style={{ padding: 6 }}>{detailRoom.minStayDuration || '-'}</td></tr>
                                        <tr><td style={{ fontWeight: 600, padding: 6 }}>Contact</td><td style={{ padding: 6 }}>{(detailRoom.contactInfo && `${detailRoom.contactInfo.name} / ${detailRoom.contactInfo.phone} / ${detailRoom.contactInfo.email}`) || 'N/A'}</td></tr>
                                        <tr><td style={{ fontWeight: 600, padding: 6 }}>Amenities</td><td style={{ padding: 6 }}>{(detailRoom.amenities && detailRoom.amenities.join(', ')) || '-'}</td></tr>
                                    </tbody>
                                </table>
                                <div className="room-mgmt-modal-actions" style={{ marginTop: 12 }}>
                                    <button onClick={() => setShowDetailModal(false)}>Close</button>
                                </div>
                            </div>
                        ) : (
                            <div>No details available.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoomManagement; 
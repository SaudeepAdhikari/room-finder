import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaEdit, FaShoppingCart, FaHeart, FaStar, FaHistory, FaPhone, FaHome, FaChevronDown, FaChevronUp, FaCalendarAlt, FaUser, FaCheckCircle, FaTimesCircle, FaClock, FaCamera, FaTimes } from 'react-icons/fa';

import './Profile.css';
import { useUser } from '../context/UserContext';
import { fetchMyRooms, fetchMyBookings, cancelBooking, fetchRoomById, updateRoom, fetchTransactionByBooking, fetchMyTransactions } from '../api';
import { fetchBookingsForMyRooms, updateBookingStatus } from '../api';

export default function Profile() {
  const { user, setUser, updateProfile } = useUser();
  // Modal edit state
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', oldPassword: '', password: '', confirmPassword: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [listingsOpen, setListingsOpen] = useState(false);
  // ... (rest of states)
  const [myListings, setMyListings] = useState([]);
  const [myListingsCount, setMyListingsCount] = useState(0);
  // Edit room modal state
  const [editingRoom, setEditingRoom] = useState(null);
  const [editRoomForm, setEditRoomForm] = useState({ title: '', description: '', location: '', price: '', amenities: '' });
  const [editRoomLoading, setEditRoomLoading] = useState(false);
  const [editRoomError, setEditRoomError] = useState('');
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState('');
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsForMyRoomsCount, setBookingsForMyRoomsCount] = useState(0);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [myBookingsList, setMyBookingsList] = useState([]);
  const [myBookingsCount, setMyBookingsCount] = useState(0);
  const [myBookingsLoading, setMyBookingsLoading] = useState(false);
  const [myBookingsError, setMyBookingsError] = useState('');
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [myPayments, setMyPayments] = useState([]);
  const [myPaymentsCount, setMyPaymentsCount] = useState(0);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');

  // Fetch counts on mount / when user changes
  useEffect(() => {
    let mounted = true;
    async function fetchCounts() {
      try {
        const rooms = await fetchMyRooms();
        if (!mounted) return;
        setMyListingsCount(Array.isArray(rooms) ? rooms.length : 0);
      } catch (e) {}
      try {
        const bookings = await fetchMyBookings();
        if (!mounted) return;
        const activeBookings = (bookings || []).filter(b => b.status !== 'cancelled');
        setMyBookingsCount(activeBookings.length);
      } catch (e) {}
      try {
        const bookingsFor = await fetchBookingsForMyRooms();
        if (!mounted) return;
        setBookingsForMyRoomsCount(Array.isArray(bookingsFor) ? bookingsFor.length : 0);
      } catch (e) {}
      try {
        const txns = await fetchMyTransactions();
        if (!mounted) return;
        const landlordTxns = (txns || []).filter(t => t.landlord?._id === user?._id || String(t.landlord) === String(user?._id));
        setMyPaymentsCount(landlordTxns.length);
      } catch (e) {}
    }
    fetchCounts();
    return () => { mounted = false; };
  }, [user]);

  // Fetch user's listings
  useEffect(() => {
    if (listingsOpen && myListings.length === 0) {
      setListingsLoading(true);
      fetchMyRooms().then(setMyListings).catch(err => setListingsError(err.message)).finally(() => setListingsLoading(false));
    }
  }, [listingsOpen]);

  // Fetch bookings for user's rooms
  useEffect(() => {
    if (bookingsOpen && myBookings.length === 0) {
      setBookingsLoading(true);
      fetchBookingsForMyRooms().then(setMyBookings).catch(err => setBookingsError(err.message)).finally(() => setBookingsLoading(false));
    }
  }, [bookingsOpen]);

  // Fetch my bookings (as tenant)
  useEffect(() => {
    if (myBookingsOpen && myBookingsList.length === 0) {
      setMyBookingsLoading(true);
      fetchMyBookings().then(b => setMyBookingsList((b || []).filter(bk => bk.status !== 'cancelled'))).catch(err => setMyBookingsError(err.message)).finally(() => setMyBookingsLoading(false));
    }
  }, [myBookingsOpen]);

  // Fetch payments
  useEffect(() => {
    if (paymentsOpen && myPayments.length === 0) {
      setPaymentsLoading(true);
      fetchMyTransactions().then(t => {
        const landlordTxns = (t || []).filter(tx => tx.landlord?._id === user?._id || String(tx.landlord) === String(user?._id));
        setMyPayments(landlordTxns);
      }).catch(err => setPaymentsError(err.message)).finally(() => setPaymentsLoading(false));
    }
  }, [paymentsOpen, user?._id]);

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      const updated = await fetchBookingsForMyRooms();
      setMyBookings(updated);
    } catch (err) { setBookingsError(err.message); }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setMyBookingsList(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) { setMyBookingsError(err.message); }
  };

  const openEditRoom = async (room) => {
    setEditingRoom(room);
    try {
      const fresh = await fetchRoomById(room._id);
      setEditRoomForm({
        title: fresh.title || '',
        description: fresh.description || '',
        location: fresh.location || '',
        price: fresh.price || '',
        amenities: fresh.amenities?.join(', ') || '',
      });
    } catch (err) {}
  };

  const handleEditRoomChange = (e) => setEditRoomForm({ ...editRoomForm, [e.target.name]: e.target.value });

  const submitRoomEdit = async (e) => {
    e.preventDefault();
    setEditRoomLoading(true);
    try {
      const payload = { ...editRoomForm, amenities: editRoomForm.amenities.split(',').map(a => a.trim()) };
      const updated = await updateRoom(editingRoom._id, payload);
      setMyListings(prev => prev.map(r => r._id === updated._id ? updated : r));
      setEditingRoom(null);
    } catch (err) { setEditRoomError(err.message); } finally { setEditRoomLoading(false); }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed': return { color: '#22c55e', icon: <FaCheckCircle />, bg: '#dcfce7' };
      case 'cancelled': return { color: '#ef4444', icon: <FaTimesCircle />, bg: '#fee2e2' };
      case 'completed': return { color: '#6C3FC5', icon: <FaCheckCircle />, bg: '#f5f3ff' };
      default: return { color: '#f59e0b', icon: <FaClock />, bg: '#fef3c7' };
    }
  };

  const handleViewTransaction = async (bookingId) => {
    try {
      const transaction = await fetchTransactionByBooking(bookingId);
      if (transaction?.transactionId) window.location.href = `/transaction/${transaction.transactionId}`;
    } catch (err) { alert('Transaction failed to load.'); }
  };

  const openEditProfile = () => {
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      oldPassword: '',
      password: '',
      confirmPassword: '',
      avatar: user.avatar || ''
    });
    setAvatarPreview(user.avatar || null);
    setAvatarFile(null);
    setEditOpen(true);
  };

  if (!user) return <div className="profile-dashboard-root"><div style={{ margin: 'auto' }}>Loading...</div></div>;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      if (form.oldPassword) formData.append('currentPassword', form.oldPassword);
      if (form.password) formData.append('newPassword', form.password);
      if (avatarFile) formData.append('avatar', avatarFile);

      const data = await updateProfile(formData);
      setEditOpen(false);
      setSuccess('Profile updated!');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="profile-dashboard-root">
      <div className="profile-dashboard-main">
        <h2 className="profile-heading" style={{ color: '#6C3FC5' }}>Profile</h2>
        <div className="profile-welcome">Welcome back, <span>{user.firstName} {user.lastName}</span></div>

        {/* My Listings */}
        <div className="profile-listings-section">
          <button onClick={() => setListingsOpen(!listingsOpen)} className="accordion-card-btn">
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaHome style={{ color: '#6C3FC5', fontSize: 22 }} />
              My Listings
              <span className="accordion-count-pill">{myListingsCount}</span>
            </span>
            {listingsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {listingsOpen && (
            <div style={{ marginTop: '1rem', background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #f1f0f7' }}>
              {listingsLoading ? <p>Loading lists...</p> : myListings.map(room => (
                <div key={room._id} style={{ display: 'flex', gap: 16, padding: '1rem', borderBottom: '1px solid #f1f0f7' }}>
                  <img src={room.images?.[0] || room.imageUrl || ''} alt="" style={{ width: 100, height: 75, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#1A1A2E' }}>{room.title}</div>
                    <div style={{ color: '#6C3FC5', fontWeight: 700 }}>NPR {room.price?.toLocaleString()}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => openEditRoom(room)} style={{ fontSize: 11, background: '#f5f3ff', border: 'none', color: '#6C3FC5', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>Edit</button>
                      <a href={`/listings/${room._id}`} style={{ fontSize: 11, background: '#6C3FC5', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>View</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Bookings (Tenant) */}
        <div className="profile-mybookings-section">
          <button onClick={() => setMyBookingsOpen(!myBookingsOpen)} className="accordion-card-btn">
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaCalendarAlt style={{ color: '#6C3FC5', fontSize: 20 }} />
              My Bookings
              <span className="accordion-count-pill">{myBookingsCount}</span>
            </span>
            {myBookingsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {myBookingsOpen && (
            <div style={{ marginTop: '1rem', background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #f1f0f7' }}>
              {myBookingsLoading ? <p>Loading...</p> : myBookingsList.map(b => (
                <div key={b._id} style={{ display: 'flex', gap: 16, padding: '1rem', borderBottom: '1px solid #f1f0f7' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#1A1A2E' }}>{b.room?.title}</div>
                    <div style={{ fontSize: 13, color: '#4A4A6A' }}>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</div>
                    <div style={{ fontWeight: 800, color: '#6C3FC5' }}>NPR {b.totalAmount?.toLocaleString()}</div>
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <a href={`/listings/${b.room?._id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ width: '100%', fontSize: 11, background: '#6C3FC5', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>View Details</button>
                      </a>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleViewTransaction(b._id)} style={{ flex: 1, fontSize: 11, background: '#f5f3ff', padding: '5px 12px', borderRadius: 6, fontWeight: 700, color: '#6C3FC5', border: '1px solid #ddd', cursor: 'pointer' }}>Transaction</button>
                        {b.status === 'pending' && <button onClick={() => handleCancelBooking(b._id)} style={{ flex: 1, fontSize: 11, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings for Rooms (Landlord) */}
        <div className="profile-bookings-section">
          <button onClick={() => setBookingsOpen(!bookingsOpen)} className="accordion-card-btn">
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaHistory style={{ color: '#6C3FC5', fontSize: 20 }} />
              Bookings for My Rooms
              <span className="accordion-count-pill">{bookingsForMyRoomsCount}</span>
            </span>
            {bookingsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {bookingsOpen && (
            <div style={{ marginTop: '1rem', background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #f1f0f7' }}>
              {bookingsLoading ? <p>Loading...</p> : myBookings.map(bk => {
                const statusInfo = getStatusInfo(bk.status);
                return (
                  <div key={bk._id} style={{ padding: '1rem', borderBottom: '1px solid #f1f0f7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, color: '#1A1A2E' }}>{bk.room?.title}</span>
                      <span style={{ fontSize: 11, color: statusInfo.color, background: statusInfo.bg, padding: '2px 8px', borderRadius: 12, fontWeight: 800 }}>{bk.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#4A4A6A', marginTop: 4 }}>Tenant: {bk.tenant?.firstName} {bk.tenant?.lastName}</div>
                    {bk.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button onClick={() => handleBookingStatusUpdate(bk._id, 'confirmed')} style={{ background: '#6C3FC5', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Confirm</button>
                        <button onClick={() => handleBookingStatusUpdate(bk._id, 'cancelled')} style={{ background: '#f3f4f6', color: '#ef4444', border: 'none', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Reject</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payments Section */}
        <div className="profile-payments-section">
          <button onClick={() => setPaymentsOpen(!paymentsOpen)} className="accordion-card-btn">
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaStar style={{ color: '#6C3FC5', fontSize: 20 }} />
              Payments
              <span className="accordion-count-pill">{myPaymentsCount}</span>
            </span>
            {paymentsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {paymentsOpen && (
            <div style={{ marginTop: '1rem', background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #f1f0f7' }}>
              {paymentsLoading ? (
                <p>Loading payments...</p>
              ) : myPayments.length > 0 ? (
                myPayments.map(p => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f1f0f7' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1A1A2E' }}>{p.room?.title || 'Unknown Room'}</div>
                      <div style={{ fontSize: 12, color: '#4A4A6A' }}>From: {p.tenant?.firstName} {p.tenant?.lastName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#10b981' }}>NPR {p.amount?.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: '#8b8b9e' }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#8b8b9e', padding: '1rem' }}>No payments available</p>
              )}
            </div>
          )}
        </div>
      </div>

      <aside className="profile-dashboard-sidebar">
        <div className="profile-user-card">
          <div className="profile-avatar">
            {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <FaUserCircle />}
          </div>
          <div className="profile-user-info">
            <div className="profile-user-name">{user.firstName} {user.lastName}</div>
            <div className="profile-user-email">{user.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#8b8b9e', fontSize: 14, fontWeight: 700, marginTop: 8 }}>
              <FaPhone style={{ color: '#6C3FC5' }} /> {user.phone || '-'}
            </div>
          </div>
          <button className="profile-edit-btn" onClick={openEditProfile}><FaEdit /> Edit Profile</button>
        </div>

        <div className="profile-stats">
          <div className="profile-stat"><span className="stat-icon">👁️</span><span>Browsed</span><span className="stat-badge">{user.stats?.browsed || 0}</span></div>
          <div className="profile-stat"><span className="stat-icon">🛒</span><span>Orders</span><span className="stat-badge">{user.stats?.orders || 0}</span></div>
          <div className="profile-stat"><span className="stat-icon">❤️</span><span>Loved</span><span className="stat-badge">{user.stats?.loved || 0}</span></div>
          <div className="profile-stat"><span className="stat-icon">⭐</span><span>Reviewed</span><span className="stat-badge">{user.stats?.reviewed || 0}</span></div>
        </div>

        <div className="profile-progress-section">
          <div className="profile-progress-label">Your Rank</div>
          <div className="profile-progress-bar"><div className="profile-progress-fill" style={{ width: (user.rank || 0) + '%' }}></div></div>
          <div className="profile-progress-percent">{user.rank || 0}%</div>
        </div>
      </aside>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="profile-modal-overlay" onClick={() => setEditOpen(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#6C3FC5', marginBottom: '1.5rem' }}>Edit Profile</h3>
            <form className="profile-edit-form" onSubmit={handleSubmit}>
              <div className="profile-edit-avatar-container">
                <div className="profile-edit-avatar-preview" onClick={() => fileInputRef.current.click()}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <FaUserCircle className="fallback-avatar" />
                  )}
                  <div className="avatar-edit-overlay">
                    <FaCamera />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>

              <div className="profile-edit-grid">
                <label>First Name <input name="firstName" value={form.firstName} onChange={handleChange} required /></label>
                <label>Last Name <input name="lastName" value={form.lastName} onChange={handleChange} required /></label>
              </div>
              <label>Email <input name="email" value={form.email} onChange={handleChange} required /></label>
              <label>Phone <input name="phone" value={form.phone} onChange={handleChange} required /></label>
             <div style={{ margin: '1.5rem 0 1rem 0', paddingTop: '1rem', borderTop: '1px solid #f1f0f7' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#6C3FC5' }}>Change Password</h4>
                <label>Current Password <input type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} placeholder="Required for password change" /></label>
                <label>New Password <input type="password" name="password" value={form.password} onChange={handleChange} /></label>
                <label>Confirm New Password <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} /></label>
              </div>

              {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}

              <div className="profile-edit-actions">
                <button type="button" onClick={() => setEditOpen(false)}>Cancel</button>
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingRoom && (
        <div className="profile-modal-overlay" onClick={() => setEditingRoom(null)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#6C3FC5', marginBottom: '1.5rem' }}>Edit Listing</h3>
            <form className="profile-edit-form" onSubmit={submitRoomEdit}>
              <label>Title <input name="title" value={editRoomForm.title} onChange={handleEditRoomChange} required /></label>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
              <textarea name="description" value={editRoomForm.description} onChange={handleEditRoomChange} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e1e1e1', borderRadius: 10, marginBottom: '1.25rem', fontFamily: 'inherit', color: 'var(--ss-near-black)', minHeight: '100px' }} required />
              <label>Location <input name="location" value={editRoomForm.location} onChange={handleEditRoomChange} required /></label>
              <label>Price (NPR) <input type="number" name="price" value={editRoomForm.price} onChange={handleEditRoomChange} required /></label>
              <label>Amenities (comma separated) <input name="amenities" value={editRoomForm.amenities} onChange={handleEditRoomChange} /></label>

              {editRoomError && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600 }}>{editRoomError}</div>}

              <div className="profile-edit-actions">
                <button type="button" onClick={() => setEditingRoom(null)}>Cancel</button>
                <button type="submit" disabled={editRoomLoading}>{editRoomLoading ? 'Updating...' : 'Update Listing'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
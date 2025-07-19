import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FaUserCircle, FaEdit, FaCamera } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { fetchMyRooms } from '../api';
import { fetchBookingsForMyRooms, updateBookingStatus } from '../api';
import { FaHome, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaCalendarAlt, FaUser, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function Profile() {
  const { user, setUser } = useUser();
  // Modal edit state
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', oldPassword: '', password: '', confirmPassword: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rawAvatar, setRawAvatar] = useState(null);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState('');
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  // Fetch user details for editing when modal opens
  useEffect(() => {
    let isMounted = true;
    async function fetchUserDetails() {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        if (isMounted) {
          setForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            oldPassword: '',
            password: '',
            confirmPassword: '',
            avatar: data.avatar || ''
          });
          setAvatarFile(null);
        }
      } catch (err) {
        if (isMounted) setError('Failed to fetch user data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (editOpen) {
      fetchUserDetails();
    }
    return () => { isMounted = false; };
  }, [editOpen]);

  // Fetch user's listings when section is opened
  useEffect(() => {
    if (listingsOpen && myListings.length === 0) {
      setListingsLoading(true);
      setListingsError('');
      fetchMyRooms()
        .then(setMyListings)
        .catch(err => setListingsError(err.message))
        .finally(() => setListingsLoading(false));
    }
  }, [listingsOpen]);

  // Fetch bookings for user's rooms when section is opened
  useEffect(() => {
    if (bookingsOpen && myBookings.length === 0) {
      setBookingsLoading(true);
      setBookingsError('');
      console.log('Fetching bookings for my rooms...');
      fetchBookingsForMyRooms()
        .then(bookings => {
          console.log('Bookings fetched successfully:', bookings);
          setMyBookings(bookings);
        })
        .catch(err => {
          console.error('Error fetching bookings:', err);
          setBookingsError(err.message);
        })
        .finally(() => setBookingsLoading(false));
    }
  }, [bookingsOpen]);

  // Handle booking status update
  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Refresh bookings
      const updatedBookings = await fetchBookingsForMyRooms();
      setMyBookings(updatedBookings);
    } catch (err) {
      setBookingsError(err.message);
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: '#22c55e', icon: <FaCheckCircle />, bg: '#dcfce7' };
      case 'cancelled':
        return { color: '#ef4444', icon: <FaTimesCircle />, bg: '#fee2e2' };
      case 'completed':
        return { color: '#3b82f6', icon: <FaCheckCircle />, bg: '#dbeafe' };
      default:
        return { color: '#f59e0b', icon: <FaClock />, bg: '#fef3c7' };
    }
  };

  if (!user) return <div className="profile-dashboard-root"><div>Loading...</div></div>;

  // Handle avatar file change
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setRawAvatar(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  // Handle crop complete
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Handle crop save
  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(rawAvatar, croppedAreaPixels);
      setAvatarFile(new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' }));
      setForm(f => ({ ...f, avatar: URL.createObjectURL(croppedBlob) }));
      setCropModalOpen(false);
      setRawAvatar(null);
    } catch (err) {
      setError('Failed to crop image.');
    }
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setCropModalOpen(false);
    setRawAvatar(null);
  };

  // Handle form field change
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (form.password && !form.oldPassword) {
      setError('Please enter your current password to change your password.');
      setLoading(false);
      return;
    }
    try {
      let avatarUrl = form.avatar;
      // If a new avatar file is selected, upload it to backend
      if (avatarFile) {
        const avatarForm = new FormData();
        avatarForm.append('avatar', avatarFile);
        const avatarRes = await fetch('/api/auth/me/avatar', {
          method: 'POST',
          body: avatarForm,
          credentials: 'include'
        });
        const avatarData = await avatarRes.json();
        if (!avatarRes.ok) throw new Error(avatarData.error || 'Avatar upload failed');
        avatarUrl = avatarData.avatar;
      }
      // Send profile update to backend
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          currentPassword: form.oldPassword || undefined,
          newPassword: form.password || undefined,
          avatar: avatarUrl
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profile update failed');
      setSuccess('Profile updated!');
      setEditOpen(false);
      setLoading(false);
      setUser(data); // Update user context so sidebar updates immediately
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  return (
    <div className="profile-dashboard-root">
      <div className="profile-dashboard-main">
        <h2 className="profile-heading">PROFILE</h2>
        <div className="profile-welcome">Welcome back, <span>{user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.name || 'User'}</span>!</div>
        <div className="profile-review-box">
          <div className="review-box-header">
            <span>Your Review</span>
          </div>
          <div className="review-box-content">
            <p>"Great platform! Found my perfect room in Kathmandu. Highly recommended."</p>
            <div className="review-box-rating">
              {[1, 2, 3, 4, 5].map(i => <span key={i} className="star">★</span>)}
            </div>
          </div>
        </div>
        {/* My Listings Section */}
        <div className="profile-listings-section" style={{ marginTop: '2rem' }}>
          <button
            onClick={() => setListingsOpen(!listingsOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '1rem 1.5rem',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px #7c3aed22'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaHome />
              My Listings ({myListings.length})
            </span>
            {listingsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {listingsOpen && (
            <div style={{
              marginTop: '1rem',
              background: '#fff',
              borderRadius: 12,
              padding: '1.5rem',
              boxShadow: '0 2px 8px #0001'
            }}>
              {listingsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                  <p>Loading your listings...</p>
                </div>
              ) : listingsError ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                  <p>{listingsError}</p>
                </div>
              ) : myListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No listings yet</h3>
                  <p>You haven't posted any rooms yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myListings.map(room => (
                    <div key={room._id} style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '1rem',
                      background: '#f8fafc'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{room.title}</h4>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: 4,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: room.status === 'approved' ? '#22c55e' : room.status === 'rejected' ? '#ef4444' : '#f59e0b',
                          background: room.status === 'approved' ? '#dcfce7' : room.status === 'rejected' ? '#fee2e2' : '#fef3c7'
                        }}>
                          {room.status}
                        </span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{room.location}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#7c3aed' }}>NPR {room.price?.toLocaleString()}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {new Date(room.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* My Bookings Section */}
        <div className="profile-bookings-section" style={{ marginTop: '2rem' }}>
          <button
            onClick={() => setBookingsOpen(!bookingsOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, #38bdf8 0%, #7c3aed 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '1rem 1.5rem',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px #38bdf822'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaCalendarAlt />
              Bookings for My Rooms ({myBookings.length})
            </span>
            {bookingsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {bookingsOpen && (
            <div style={{
              marginTop: '1rem',
              background: '#fff',
              borderRadius: 12,
              padding: '1.5rem',
              boxShadow: '0 2px 8px #0001'
            }}>
              {bookingsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                  <p>Loading bookings...</p>
                </div>
              ) : bookingsError ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                  <p>{bookingsError}</p>
                </div>
              ) : myBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No bookings yet</h3>
                  <p>No one has booked your rooms yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myBookings.map(booking => {
                    const statusInfo = getStatusInfo(booking.status);
                    return (
                      <div key={booking._id} style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: '1rem',
                        background: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{booking.room?.title}</h4>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: statusInfo.color,
                            background: statusInfo.bg,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            {statusInfo.icon} {booking.status}
                          </span>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.25rem' }}>
                            <FaUser style={{ color: '#7c3aed', fontSize: 14 }} />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                              {booking.tenant?.firstName} {booking.tenant?.lastName} ({booking.tenant?.email})
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.25rem' }}>
                            <FaCalendarAlt style={{ color: '#7c3aed', fontSize: 14 }} />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            Total: NPR {booking.totalAmount?.toLocaleString()}
                          </div>
                        </div>

                        {booking.message && (
                          <div style={{
                            background: '#f1f5f9',
                            padding: '0.5rem',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginBottom: '0.75rem'
                          }}>
                            "{booking.message}"
                          </div>
                        )}

                        {booking.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                              style={{
                                background: '#22c55e',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                              style={{
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <aside className="profile-dashboard-sidebar">
        <div className="profile-user-card">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || (user.firstName ? user.firstName + ' ' + user.lastName : 'User')} />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div className="profile-user-info">
            <div className="profile-user-name">
              {user.firstName || form.firstName ? `${user.firstName || form.firstName} ${user.lastName || form.lastName}`.trim() : user.name || '-'}
            </div>
            <div className="profile-user-email">{user.email || form.email || '-'}</div>
            <div className="profile-user-phone" style={{ marginTop: 6, fontWeight: 600, color: '#312e81', fontSize: 17, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaPhone style={{ color: '#7c3aed', fontSize: 16 }} />
              <span style={{ fontWeight: 700, marginRight: 4 }}>Phone:</span> {user.phone || form.phone || '-'}
            </div>
          </div>
        </div>
        {/* Edit Profile Button below the card */}
        <button
          className="profile-edit-btn"
          style={{ margin: '1.2rem 0 0 0', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={() => setEditOpen(true)}
          aria-label="Edit profile"
        >
          <FaEdit /> Edit Profile
        </button>
        <div className="profile-stats">
          <div className="profile-stat"><span>Browsed</span><span className="stat-badge stat-browsed">{user.stats?.browsed ?? 0}</span></div>
          <div className="profile-stat"><span>Orders</span><span className="stat-badge stat-orders">{user.stats?.orders ?? 0}</span></div>
          <div className="profile-stat"><span>Loved</span><span className="stat-badge stat-loved">{user.stats?.loved ?? 0}</span></div>
          <div className="profile-stat"><span>Reviewed</span><span className="stat-badge stat-reviewed">{user.stats?.reviewed ?? 0}</span></div>
        </div>
        <div className="profile-progress-section">
          <div className="profile-progress-label">Your Rank</div>
          <div className="profile-progress-bar"><div className="profile-progress-fill" style={{ width: (user.rank ?? 0) + '%' }}></div></div>
          <div className="profile-progress-percent">{user.rank ?? 0}%</div>
          <div className="profile-progress-label">Your Wanted Level</div>
          <div className="profile-progress-bar wanted"><div className="profile-progress-fill" style={{ width: (user.wanted ?? 0) + '%' }}></div></div>
          <div className="profile-progress-percent">{user.wanted ?? 0}%</div>
        </div>
      </aside>
      {/* Edit Profile Modal - Centered */}
      {editOpen && (
        <div className="profile-modal-overlay" style={{ alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.18)' }} onClick={() => setEditOpen(false)}>
          <div
            className="profile-modal"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 420,
              width: '100%',
              padding: 0,
              margin: '0 auto',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 18,
              background: '#fff',
              boxShadow: '0 8px 32px #0002'
            }}
          >
            <div style={{ padding: '2.5rem 2rem 0 2rem', flex: '0 0 auto' }}>
              <h3 style={{ fontWeight: 900, fontSize: '1.5rem', background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', marginBottom: 24 }}>Edit Profile</h3>
              {error && <div className="profile-edit-error">{error}</div>}
              {success && <div className="profile-edit-success">{success}</div>}
            </div>
            <form className="profile-edit-form" onSubmit={handleSubmit} style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 120px)', padding: '0 2rem', flex: '1 1 auto' }}>
              <div className="profile-edit-avatar-section" style={{ justifyContent: 'center', marginBottom: 24 }}>
                <label htmlFor="avatar-upload" className="profile-edit-avatar-preview" title="Change avatar" style={{ width: 96, height: 96, fontSize: 48 }}>
                  {form.avatar ? (
                    <img src={form.avatar} alt="Avatar preview" style={{ width: 96, height: 96, borderRadius: '50%' }} />
                  ) : (
                    <FaUserCircle style={{ fontSize: 64 }} />
                  )}
                  <span className="profile-edit-avatar-upload" style={{ bottom: 6, right: 6, fontSize: 18, background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)', color: '#fff' }}><FaCamera /></span>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <label style={{ fontWeight: 700, color: '#7c3aed' }}>First Name
                <input name="firstName" value={form.firstName} onChange={handleChange} required style={{ fontWeight: 600, fontSize: 17 }} />
              </label>
              <label style={{ fontWeight: 700, color: '#7c3aed' }}>Last Name
                <input name="lastName" value={form.lastName} onChange={handleChange} required style={{ fontWeight: 600, fontSize: 17 }} />
              </label>
              <label style={{ fontWeight: 700, color: '#7c3aed' }}>Email
                <input name="email" value={form.email} onChange={handleChange} required type="email" style={{ fontWeight: 600, fontSize: 17 }} />
              </label>
              <label style={{ fontWeight: 700, color: '#7c3aed' }}>Phone
                <input name="phone" value={form.phone} onChange={handleChange} required type="text" style={{ fontWeight: 600, fontSize: 17 }} />
              </label>
              <label style={{ fontWeight: 700, color: '#7c3aed' }}>Old Password
                <div style={{ position: 'relative' }}>
                  <input
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    type={showPassword.old ? 'text' : 'password'}
                    placeholder="Current password (required to change password)"
                    style={{ fontWeight: 600, fontSize: 17, width: '100%', paddingRight: 36 }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword.old ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(s => ({ ...s, old: !s.old }))}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#a78bfa',
                      fontSize: 18,
                      cursor: 'pointer',
                      padding: 0
                    }}
                    tabIndex={-1}
                  >
                    {showPassword.old ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label style={{ fontWeight: 700, color: '#7c3aed' }}>Password
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword.new ? 'text' : 'password'}
                    placeholder="New password (leave blank to keep)"
                    style={{ fontWeight: 600, fontSize: 17, width: '100%', paddingRight: 36 }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword.new ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(s => ({ ...s, new: !s.new }))}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#a78bfa',
                      fontSize: 18,
                      cursor: 'pointer',
                      padding: 0
                    }}
                    tabIndex={-1}
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label style={{ fontWeight: 700, color: '#7c3aed' }}>Confirm New Password
                <div style={{ position: 'relative' }}>
                  <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showPassword.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    style={{ fontWeight: 600, fontSize: 17, width: '100%', paddingRight: 36 }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword.confirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(s => ({ ...s, confirm: !s.confirm }))}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#a78bfa',
                      fontSize: 18,
                      cursor: 'pointer',
                      padding: 0
                    }}
                    tabIndex={-1}
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
            </form>
            <div className="profile-edit-actions" style={{ justifyContent: 'center', margin: '18px 0 24px 0', padding: '0 2rem', flex: '0 0 auto', background: '#fff' }}>
              <button type="button" onClick={() => setEditOpen(false)} style={{ background: '#ede9fe', color: '#7c3aed', fontWeight: 700, borderRadius: 8, padding: '0.7rem 1.5rem', fontSize: 16 }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)', color: '#fff', fontWeight: 800, borderRadius: 8, padding: '0.7rem 1.5rem', fontSize: 16, boxShadow: '0 2px 8px #a78bfa22' }}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Avatar crop modal */}
      {cropModalOpen && (
        <div className="profile-modal-overlay" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="profile-modal" style={{ maxWidth: 400, padding: 0, background: '#fff' }}>
            <div style={{ position: 'relative', width: 320, height: 320, background: '#222', margin: '2rem auto' }}>
              <Cropper
                image={rawAvatar}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <button onClick={handleCropCancel} style={{ background: '#ede9fe', color: '#7c3aed', fontWeight: 700, borderRadius: 8, padding: '0.7rem 1.5rem', fontSize: 16 }}>Cancel</button>
              <button onClick={handleCropSave} style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)', color: '#fff', fontWeight: 800, borderRadius: 8, padding: '0.7rem 1.5rem', fontSize: 16, boxShadow: '0 2px 8px #a78bfa22' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
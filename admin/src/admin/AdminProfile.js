import React, { useEffect, useState, useRef } from 'react';
import { FaCamera, FaUserEdit, FaLock, FaSave, FaSignOutAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa/index.esm.js';
import { useAdminUser } from './AdminUserContext.js';
import { fetchAdminProfile, updateAdminProfile } from '../api.js';
import './AdminProfile.css';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

function AdminProfile() {
    const { admin, logout } = useAdminUser();
    const [form, setForm] = useState({
        avatar: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editing, setEditing] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [imgUploading, setImgUploading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await fetchAdminProfile();
                setForm({
                    avatar: data.avatar || '',
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                });
            } catch (e) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleEdit = () => {
        setEditing(true);
        setSuccess('');
        setError('');
    };

    const handleSave = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.firstName || !form.lastName || !form.email) {
            setError('First name, last name, and email are required.');
            return;
        }
        if (showPasswordFields) {
            if (!oldPassword || !newPassword || !confirmPassword) {
                setError('All password fields are required.');
                return;
            }
            if (newPassword.length < 6) {
                setError('New password must be at least 6 characters.');
                return;
            }
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        }
        try {
            const updated = await updateAdminProfile({
                avatar: form.avatar,
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                ...(showPasswordFields ? { currentPassword: oldPassword, newPassword } : {}),
            });

            // If backend returned the updated object, refresh the form to reflect DB
            if (updated && typeof updated === 'object') {
                setForm(f => ({ ...f, avatar: updated.avatar || f.avatar, firstName: updated.firstName || f.firstName, lastName: updated.lastName || f.lastName, email: updated.email || f.email, phone: updated.phone || f.phone }));
            }

            setEditing(false);
            setShowPasswordFields(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccess('Profile updated!');
        } catch (e) {
            console.error('AdminProfile.handleSave - update error:', e);
            // Show the backend error if available
            setError((e && e.message) ? e.message : 'Failed to update profile');
        }
    };

    const handleLogout = async () => {
        await logout();
        // Redirect to admin login without popup
        window.location.href = '/adminlogin';
    };

    const handleAvatarUpload = async e => {
        const file = e.target.files[0];
        if (!file) return;
        setImgUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: data,
        });
        const json = await res.json();
        setForm(f => ({ ...f, avatar: json.secure_url }));
        setImgUploading(false);
    };

    if (loading) return <div className="admin-profile-root"><div className="admin-profile-loading">Loading...</div></div>;

    return (
        <div className="admin-profile-root animation-fade-in">
            <div className="page-header-actions">
                <div>
                    <h2 className="admin-page-title">Admin Profile</h2>
                    <p className="admin-page-subtitle">Manage your personal information and security settings.</p>
                </div>
            </div>

            <div className="profile-container-inner">
                <div className="premium-card profile-main-card">
                    <form className="admin-profile-form-saas" onSubmit={handleSave} autoComplete="off">
                        <div className="profile-hero-section">
                            <div className="avatar-upload-container">
                                <img
                                    src={form.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.firstName + ' ' + form.lastName) + '&background=2563eb&color=fff'}
                                    alt="Admin Avatar"
                                    className="profile-avatar-large"
                                />
                                {editing && (
                                    <button
                                        type="button"
                                        className="avatar-edit-overlay"
                                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    >
                                        <FaCamera />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarUpload}
                                    disabled={imgUploading}
                                />
                            </div>
                            <div className="profile-identity">
                                <h3>{form.firstName} {form.lastName}</h3>
                                <p>{form.email}</p>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="form-group-premium">
                                <label className="label-premium">First Name</label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                    readOnly={!editing}
                                    className={`input-premium ${!editing ? 'readonly' : ''}`}
                                />
                            </div>
                            <div className="form-group-premium">
                                <label className="label-premium">Last Name</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    readOnly={!editing}
                                    className={`input-premium ${!editing ? 'readonly' : ''}`}
                                />
                            </div>
                            <div className="form-group-premium">
                                <label className="label-premium">Email Address</label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    type="email"
                                    readOnly={!editing}
                                    className={`input-premium ${!editing ? 'readonly' : ''}`}
                                />
                            </div>
                            <div className="form-group-premium">
                                <label className="label-premium">Phone Number</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    readOnly={!editing}
                                    className={`input-premium ${!editing ? 'readonly' : ''}`}
                                />
                            </div>

                            {editing && showPasswordFields && (
                                <>
                                    <div className="form-group-premium full-width">
                                        <div className="password-divider">Security Update</div>
                                    </div>
                                    <div className="form-group-premium">
                                        <label className="label-premium">Current Password</label>
                                        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="input-premium" />
                                    </div>
                                    <div className="form-group-premium">
                                        <label className="label-premium">New Password</label>
                                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="input-premium" />
                                    </div>
                                    <div className="form-group-premium">
                                        <label className="label-premium">Confirm New Password</label>
                                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="input-premium" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="profile-actions-saas">
                            {!editing ? (
                                <button type="button" className="btn-premium" onClick={handleEdit}>
                                    <FaUserEdit /> Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button type="button" className="btn-premium-outline" onClick={() => { setEditing(false); setShowPasswordFields(false); setError(''); setSuccess(''); }}>
                                        Cancel
                                    </button>
                                    {!showPasswordFields && (
                                        <button type="button" className="btn-premium-outline" onClick={() => setShowPasswordFields(true)}>
                                            <FaLock /> Change Password
                                        </button>
                                    )}
                                    <button type="submit" className="btn-premium">
                                        <FaSave /> Save Changes
                                    </button>
                                </>
                            )}
                            <button type="button" className="btn-premium delete" style={{ marginLeft: 'auto' }} onClick={handleLogout}>
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </div>

                        {imgUploading && <div className="status-message loading"><div className="spinner-small"></div> Uploading avatar...</div>}
                        {error && <div className="status-message error"><FaExclamationCircle /> {error}</div>}
                        {success && <div className="status-message success"><FaCheckCircle /> {success}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
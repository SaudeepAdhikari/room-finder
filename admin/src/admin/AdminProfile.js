import React, { useEffect, useState, useRef } from 'react';

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
            await updateAdminProfile({
                avatar: form.avatar,
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                ...(showPasswordFields ? { currentPassword: oldPassword, newPassword } : {}),
            });
            setEditing(false);
            setShowPasswordFields(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccess('Profile updated!');
        } catch (e) {
            setError('Failed to update profile');
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.reload();
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
        <div className="admin-profile-root">
            <form className="admin-profile-form-modern" onSubmit={handleSave} autoComplete="off">
                <div className="admin-profile-avatar-modern-wrap">
                    <img
                        src={form.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.firstName + ' ' + form.lastName)}
                        alt="Admin Avatar"
                        className="admin-profile-avatar-modern"
                    />
                    {editing && (
                        <button
                            type="button"
                            className="admin-profile-avatar-upload-btn"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            tabIndex={-1}
                        >
                            <span role="img" aria-label="Upload">📷</span>
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
                {!editing ? (
                    <>
                        <div className="admin-profile-view-row-modern"><b>First Name:</b> {form.firstName}</div>
                        <div className="admin-profile-view-row-modern"><b>Last Name:</b> {form.lastName}</div>
                        <div className="admin-profile-view-row-modern"><b>Email:</b> {form.email}</div>
                        <div className="admin-profile-view-row-modern"><b>Phone:</b> {form.phone}</div>
                        <div className="admin-profile-actions-modern">
                            <button type="button" className="admin-profile-cancel-btn" onClick={handleLogout}>Logout</button>
                            <button type="button" className="admin-profile-save-btn" onClick={handleEdit}>Edit Profile</button>
                        </div>
                    </>
                ) : (
                    <>
                        <label className="admin-profile-label-modern">
                            First Name
                            <input name="firstName" value={form.firstName} onChange={handleChange} required className="admin-profile-input-modern" />
                        </label>
                        <label className="admin-profile-label-modern">
                            Last Name
                            <input name="lastName" value={form.lastName} onChange={handleChange} required className="admin-profile-input-modern" />
                        </label>
                        <label className="admin-profile-label-modern">
                            Email
                            <input name="email" value={form.email} onChange={handleChange} required type="email" className="admin-profile-input-modern" />
                        </label>
                        <label className="admin-profile-label-modern">
                            Phone
                            <input name="phone" value={form.phone} onChange={handleChange} className="admin-profile-input-modern" />
                        </label>
                        {showPasswordFields ? (
                            <>
                                <label className="admin-profile-label-modern">
                                    Old Password
                                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="admin-profile-input-modern" />
                                </label>
                                <label className="admin-profile-label-modern">
                                    New Password
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="admin-profile-input-modern" />
                                </label>
                                <label className="admin-profile-label-modern">
                                    Confirm Password
                                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="admin-profile-input-modern" />
                                </label>
                            </>
                        ) : (
                            <button type="button" className="admin-profile-save-btn" style={{ marginBottom: 12 }} onClick={() => setShowPasswordFields(true)}>Change Password</button>
                        )}
                        <div className="admin-profile-actions-modern">
                            <button type="button" className="admin-profile-cancel-btn" onClick={() => { setEditing(false); setShowPasswordFields(false); setError(''); setSuccess(''); }}>Cancel</button>
                            <button type="submit" className="admin-profile-save-btn">Save Changes</button>
                        </div>
                    </>
                )}
                {imgUploading && <div className="admin-profile-uploading-modern">Uploading avatar...</div>}
                {error && <div className="admin-profile-error-modern">{error}</div>}
                {success && <div className="admin-profile-success-modern">{success}</div>}
            </form>
        </div>
    );
}

export default AdminProfile; 
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import Cropper from 'react-easy-crop';

const CameraIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
);
const RemoveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></svg>
);

function getCroppedImg(imageSrc, crop, zoom, aspect, rotation = 0) {
    // Returns a Promise that resolves with a Blob of the cropped image
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = image.naturalWidth / image.width;
            const cropX = crop.x * scale;
            const cropY = crop.y * scale;
            const cropWidth = crop.width * scale;
            const cropHeight = crop.height * scale;
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            const ctx = canvas.getContext('2d');
            // Apply rotation
            if (rotation) {
                ctx.save();
                ctx.translate(cropWidth / 2, cropHeight / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.drawImage(
                    image,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    -cropWidth / 2,
                    -cropHeight / 2,
                    cropWidth,
                    cropHeight
                );
                ctx.restore();
            } else {
                ctx.drawImage(
                    image,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    cropWidth,
                    cropHeight
                );
            }
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg', 0.95);
        };
        image.onerror = () => reject(new Error('Failed to load image'));
    });
}

function ProfileModal({ user, onClose, onSave }) {
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [avatarChanged, setAvatarChanged] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();
    const fileInputRef = useRef();

    // Cropping state
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImage, setCropImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
            showToast('Only JPG, PNG, or WEBP images are allowed.', 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            showToast('Image size should be less than 2MB.', 'error');
            return;
        }
        // Remove dimension validation, allow any size
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            setCropImage(img.src);
            setCropModalOpen(true);
        };
        img.onerror = () => showToast('Failed to load image.', 'error');
    };

    const handleCropComplete = async (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        // Generate live preview
        if (cropImage) {
            try {
                const blob = await getCroppedImg(cropImage, croppedAreaPixels, zoom, 1, rotation);
                setPreviewUrl(URL.createObjectURL(blob));
            } catch {
                setPreviewUrl(null);
            }
        }
    };

    const handleCropConfirm = async () => {
        setUploading(true);
        try {
            const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels, zoom, 1, rotation);
            // Remove cropped dimension validation
            const formData = new FormData();
            formData.append('avatar', croppedBlob, 'avatar.jpg');
            const res = await fetch('/api/auth/me/avatar', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
                throw new Error(errorData.error || 'Upload failed');
            }
            const data = await res.json();
            setAvatar(data.avatar);
            setAvatarChanged(true);
            showToast('Avatar updated!', 'success');
            setCropModalOpen(false);
            setPreviewUrl(null);
        } catch (err) {
            showToast(err.message || 'Failed to upload avatar', 'error');
        } finally {
            setUploading(false);
            setTimeout(() => setAvatarChanged(false), 800);
        }
    };

    const handleAvatarDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInputRef.current.files = e.dataTransfer.files;
            handleAvatarChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const handleAvatarDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };
    const handleAvatarDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleRemoveAvatar = () => {
        setAvatar('');
        showToast('Avatar removed. Save to apply.', 'info');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await onSave({ email, phone, currentPassword, newPassword, avatar });
            showToast('Profile updated successfully!', 'success');
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update profile');
            showToast(err.message || 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.35)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(12px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                        padding: 36,
                        minWidth: 340,
                        maxWidth: '90vw',
                        position: 'relative',
                        border: '1.5px solid var(--gray-200)',
                        color: 'var(--text-primary)',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: 'none',
                            border: 'none',
                            fontSize: 22,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            zIndex: 10,
                        }}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <h2 style={{ marginBottom: 18, fontWeight: 700, fontSize: 24, letterSpacing: -0.5 }}>Profile Info</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
                        <div
                            onDrop={handleAvatarDrop}
                            onDragOver={handleAvatarDragOver}
                            onDragLeave={handleAvatarDragLeave}
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: '50%',
                                border: dragOver ? '2.5px solid var(--primary)' : '2.5px solid var(--primary)',
                                background: dragOver ? 'rgba(0, 153, 255, 0.08)' : 'rgba(255,255,255,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                boxShadow: 'var(--shadow-xs)',
                                transition: 'border 0.2s, background 0.2s',
                            }}
                            title="Click or drag to upload avatar"
                            onClick={() => !uploading && fileInputRef.current.click()}
                            onMouseEnter={() => setDragOver(true)}
                            onMouseLeave={() => setDragOver(false)}
                        >
                            <motion.div
                                key={avatar}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                                        <circle cx="16" cy="16" r="16" fill="#e0e7ef" />
                                        <circle cx="16" cy="13" r="6" fill="#b6c2d1" />
                                        <ellipse cx="16" cy="24" rx="8" ry="5" fill="#b6c2d1" />
                                    </svg>
                                )}
                            </motion.div>
                            {!uploading && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    background: 'rgba(0,0,0,0.55)',
                                    borderRadius: '50%',
                                    padding: 4,
                                    display: dragOver ? 'flex' : 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'opacity 0.2s',
                                }}>
                                    <CameraIcon />
                                </div>
                            )}
                            {uploading && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'rgba(255,255,255,0.7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 600, color: 'var(--primary)', fontSize: 14
                                }}>
                                    <motion.div
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        style={{ width: 28, height: 28 }}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#0af" strokeWidth="5" strokeDasharray="31.4 31.4" /></svg>
                                    </motion.div>
                                </div>
                            )}
                            {avatar && !uploading && (
                                <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); handleRemoveAvatar(); }}
                                    style={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        background: 'rgba(255,255,255,0.8)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        padding: 2,
                                        cursor: 'pointer',
                                        boxShadow: 'var(--shadow-xs)',
                                        zIndex: 2,
                                    }}
                                    title="Remove avatar"
                                >
                                    <RemoveIcon />
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                            disabled={uploading}
                        />
                        <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                            <div>Click or drag to upload avatar</div>
                            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>JPG, PNG, WEBP. Max 2MB. Crop to square after upload.</div>
                        </div>
                    </div>
                    {/* Cropping Modal */}
                    <AnimatePresence>
                        {cropModalOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    background: 'rgba(0,0,0,0.5)',
                                    zIndex: 3000,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => setCropModalOpen(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    style={{
                                        background: 'white',
                                        borderRadius: 16,
                                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                                        padding: 24,
                                        minWidth: 320,
                                        maxWidth: '90vw',
                                        position: 'relative',
                                        color: 'var(--text-primary)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Crop Avatar</h3>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
                                        <div style={{ position: 'relative', width: 256, height: 256, background: '#eee', borderRadius: 12, overflow: 'hidden' }}>
                                            <Cropper
                                                image={cropImage}
                                                crop={crop}
                                                zoom={zoom}
                                                rotation={rotation}
                                                aspect={1}
                                                cropShape="round"
                                                showGrid={false}
                                                onCropChange={setCrop}
                                                onZoomChange={setZoom}
                                                onRotationChange={setRotation}
                                                onCropComplete={handleCropComplete}
                                            />
                                        </div>
                                        {previewUrl && (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Preview</span>
                                                <img src={previewUrl} alt="Preview" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ width: 256, margin: '18px auto 0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <label style={{ fontWeight: 500, fontSize: 14 }}>Zoom</label>
                                        <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} />
                                        <label style={{ fontWeight: 500, fontSize: 14 }}>Rotate</label>
                                        <input type="range" min={0} max={360} step={1} value={rotation} onChange={e => setRotation(Number(e.target.value))} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18 }}>
                                        <button type="button" onClick={() => setCropModalOpen(false)} style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: 'var(--gray-200)', color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>Cancel</button>
                                        <button type="button" onClick={handleCropConfirm} style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: 15 }}>Crop & Upload</button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--gray-200)', background: 'rgba(255,255,255,0.98)', fontSize: 16, marginTop: 2 }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--gray-200)', background: 'rgba(255,255,255,0.98)', fontSize: 16, marginTop: 2 }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Account Created</label>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>{user.createdAt ? new Date(user.createdAt).toLocaleString() : ''}</div>
                        </div>
                        <hr style={{ margin: '28px 0', border: 'none', borderTop: '1.5px solid var(--gray-100)' }} />
                        <h3 style={{ marginBottom: 10, fontWeight: 700, fontSize: 18 }}>Change Password</h3>
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--gray-200)', background: 'rgba(255,255,255,0.98)', fontSize: 16, marginTop: 2 }}
                                autoComplete="current-password"
                            />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--gray-200)', background: 'rgba(255,255,255,0.98)', fontSize: 16, marginTop: 2 }}
                                autoComplete="new-password"
                            />
                        </div>
                        {error && <div style={{ color: 'var(--danger)', marginBottom: 14, fontWeight: 500 }}>{error}</div>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 8 }}>
                            <button type="button" onClick={onClose} style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: 'var(--gray-200)', color: 'var(--text-primary)', fontWeight: 600, fontSize: 16, boxShadow: 'var(--shadow-xs)', transition: 'background 0.2s' }}>Cancel</button>
                            <button type="submit" disabled={saving} style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: 'var(--primary-gradient)', color: 'white', fontWeight: 700, fontSize: 16, boxShadow: 'var(--shadow-xs)', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>{saving ? 'Saving...' : 'Save'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ProfileModal; 
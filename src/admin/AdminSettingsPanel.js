import React, { useState, useEffect } from 'react';
import { getAdminSettings, updateAdminSettings } from '../api';
import { useToast } from '../context/ToastContext';

function AdminSettingsPanel() {
    const { showToast } = useToast();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await getAdminSettings();
            setSettings(data);
        } catch (err) {
            setError(err.message);
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateAdminSettings(settings);
            showToast('Settings saved successfully!', 'success');
        } catch (err) {
            showToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = (field) => {
        setSettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 18, color: '#666' }}>Loading settings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
                <div style={{ fontSize: 18 }}>Error: {error}</div>
                <button
                    onClick={loadSettings}
                    style={{
                        marginTop: 16,
                        padding: '8px 16px',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                    Site Settings
                </h1>
                <p style={{ color: '#64748b', fontSize: 16 }}>
                    Control what users can see and do on the frontend
                </p>
            </div>

            <div style={{ display: 'grid', gap: 32 }}>
                {/* Site-wide Settings */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
                        🚧 Site-wide Settings
                    </h2>

                    <div style={{ display: 'grid', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>Maintenance Mode</div>
                                <div style={{ fontSize: 14, color: '#64748b' }}>
                                    Temporarily disable the site for all users
                                </div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: 60, height: 34 }}>
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={() => handleToggle('maintenanceMode')}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: settings.maintenanceMode ? '#2563eb' : '#ccc',
                                    transition: '.4s',
                                    borderRadius: 34,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: settings.maintenanceMode ? 'flex-end' : 'flex-start',
                                    padding: '4px'
                                }}>
                                    <span style={{
                                        width: 26,
                                        height: 26,
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        transition: '.4s'
                                    }} />
                                </span>
                            </label>
                        </div>

                        {settings.maintenanceMode && (
                            <div style={{ marginTop: 16 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Maintenance Message
                                </label>
                                <textarea
                                    value={settings.maintenanceMessage}
                                    onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: 12,
                                        border: '1px solid #d1d5db',
                                        borderRadius: 6,
                                        fontSize: 14,
                                        minHeight: 80
                                    }}
                                    placeholder="Message to show users during maintenance"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Feature Toggles */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
                        ⚙️ Feature Toggles
                    </h2>

                    <div style={{ display: 'grid', gap: 16 }}>
                        {[
                            { key: 'allowNewRegistrations', label: 'Allow New User Registrations', desc: 'Let new users create accounts' },
                            { key: 'allowRoomPosting', label: 'Allow Room Posting', desc: 'Let users post new rooms' },
                            { key: 'allowReviews', label: 'Allow Reviews', desc: 'Let users leave reviews' },
                            { key: 'allowContactHost', label: 'Allow Contact Host', desc: 'Let users contact room hosts' }
                        ].map(({ key, label, desc }) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontSize: 14, color: '#64748b' }}>{desc}</div>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: 60, height: 34 }}>
                                    <input
                                        type="checkbox"
                                        checked={settings[key]}
                                        onChange={() => handleToggle(key)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: settings[key] ? '#10b981' : '#ccc',
                                        transition: '.4s',
                                        borderRadius: 34,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: settings[key] ? 'flex-end' : 'flex-start',
                                        padding: '4px'
                                    }}>
                                        <span style={{
                                            width: 26,
                                            height: 26,
                                            backgroundColor: '#fff',
                                            borderRadius: '50%',
                                            transition: '.4s'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display Controls */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
                        🎨 Display Controls
                    </h2>

                    <div style={{ display: 'grid', gap: 16 }}>
                        {[
                            { key: 'showFeaturedProperties', label: 'Show Featured Properties', desc: 'Display featured properties section' },
                            { key: 'showPopularCities', label: 'Show Popular Cities', desc: 'Display popular cities section' },
                            { key: 'showTestimonials', label: 'Show Testimonials', desc: 'Display testimonials section' },
                            { key: 'showWhyChooseUs', label: 'Show Why Choose Us', desc: 'Display why choose us section' },
                            { key: 'showMapView', label: 'Show Map View', desc: 'Allow users to view rooms on map' }
                        ].map(({ key, label, desc }) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontSize: 14, color: '#64748b' }}>{desc}</div>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: 60, height: 34 }}>
                                    <input
                                        type="checkbox"
                                        checked={settings[key]}
                                        onChange={() => handleToggle(key)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: settings[key] ? '#10b981' : '#ccc',
                                        transition: '.4s',
                                        borderRadius: 34,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: settings[key] ? 'flex-end' : 'flex-start',
                                        padding: '4px'
                                    }}>
                                        <span style={{
                                            width: 26,
                                            height: 26,
                                            backgroundColor: '#fff',
                                            borderRadius: '50%',
                                            transition: '.4s'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Moderation */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
                        🛡️ Content Moderation
                    </h2>

                    <div style={{ display: 'grid', gap: 16 }}>
                        {[
                            { key: 'autoApproveRooms', label: 'Auto-approve Rooms', desc: 'Automatically approve new room postings' },
                            { key: 'requireRoomApproval', label: 'Require Room Approval', desc: 'Manually review all room postings' }
                        ].map(({ key, label, desc }) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontSize: 14, color: '#64748b' }}>{desc}</div>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: 60, height: 34 }}>
                                    <input
                                        type="checkbox"
                                        checked={settings[key]}
                                        onChange={() => handleToggle(key)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: settings[key] ? '#f59e0b' : '#ccc',
                                        transition: '.4s',
                                        borderRadius: 34,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: settings[key] ? 'flex-end' : 'flex-start',
                                        padding: '4px'
                                    }}>
                                        <span style={{
                                            width: 26,
                                            height: 26,
                                            backgroundColor: '#fff',
                                            borderRadius: '50%',
                                            transition: '.4s'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Max Images Per Room
                                </label>
                                <input
                                    type="number"
                                    value={settings.maxImagesPerRoom}
                                    onChange={(e) => handleInputChange('maxImagesPerRoom', parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: 12,
                                        border: '1px solid #d1d5db',
                                        borderRadius: 6,
                                        fontSize: 14
                                    }}
                                    min="1"
                                    max="20"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                    Max Price
                                </label>
                                <input
                                    type="number"
                                    value={settings.maxPrice}
                                    onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: 12,
                                        border: '1px solid #d1d5db',
                                        borderRadius: 6,
                                        fontSize: 14
                                    }}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Restrictions */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
                        👥 User Restrictions
                    </h2>

                    <div style={{ display: 'grid', gap: 16 }}>
                        {[
                            { key: 'allowGuestBrowsing', label: 'Allow Guest Browsing', desc: 'Let non-logged users browse rooms' },
                            { key: 'requireLoginForContact', label: 'Require Login for Contact', desc: 'Force users to login before contacting hosts' }
                        ].map(({ key, label, desc }) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontSize: 14, color: '#64748b' }}>{desc}</div>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: 60, height: 34 }}>
                                    <input
                                        type="checkbox"
                                        checked={settings[key]}
                                        onChange={() => handleToggle(key)}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: settings[key] ? '#10b981' : '#ccc',
                                        transition: '.4s',
                                        borderRadius: 34,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: settings[key] ? 'flex-end' : 'flex-start',
                                        padding: '4px'
                                    }}>
                                        <span style={{
                                            width: 26,
                                            height: 26,
                                            backgroundColor: '#fff',
                                            borderRadius: '50%',
                                            transition: '.4s'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Messages */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
                        💬 Custom Messages
                    </h2>

                    <div style={{ display: 'grid', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Welcome Message
                            </label>
                            <input
                                type="text"
                                value={settings.welcomeMessage}
                                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    border: '1px solid #d1d5db',
                                    borderRadius: 6,
                                    fontSize: 14
                                }}
                                placeholder="Welcome message for users"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Footer Message
                            </label>
                            <input
                                type="text"
                                value={settings.footerMessage}
                                onChange={(e) => handleInputChange('footerMessage', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    border: '1px solid #d1d5db',
                                    borderRadius: 6,
                                    fontSize: 14
                                }}
                                placeholder="Footer message"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div style={{
                position: 'sticky',
                bottom: 0,
                background: '#fff',
                padding: '20px 0',
                borderTop: '1px solid #e2e8f0',
                marginTop: 32
            }}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        background: saving ? '#9ca3af' : '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 24px',
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
}

export default AdminSettingsPanel; 
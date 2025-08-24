"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _api = require("../api");
var _ToastContext = require("../context/ToastContext");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function AdminSettingsPanel() {
  const {
    showToast
  } = (0, _ToastContext.useToast)();
  const [settings, setSettings] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(true);
  const [saving, setSaving] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await (0, _api.getAdminSettings)();
      setSettings(data);
    } catch (err) {
      console.error('Error loading admin settings:', err);
      setError(err.message || 'Failed to load settings');
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add retry functionality
  const handleRetry = () => {
    loadSettings();
  };
  const handleSave = async () => {
    try {
      setSaving(true);
      await (0, _api.updateAdminSettings)(settings);
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };
  const handleToggle = field => {
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
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: 40,
        textAlign: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: 18,
        color: '#666'
      }
    }, "Loading settings..."));
  }
  if (error) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: 40,
        textAlign: 'center',
        color: '#ef4444'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: 18
      }
    }, "Error: ", error), /*#__PURE__*/_react.default.createElement("button", {
      onClick: loadSettings,
      style: {
        marginTop: 16,
        padding: '8px 16px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer'
      }
    }, "Retry"));
  }
  if (loading) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: '32px 40px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontSize: 18,
        color: '#64748b',
        marginBottom: 20
      }
    }, "Loading settings..."), /*#__PURE__*/_react.default.createElement("div", {
      className: "spinner",
      style: {
        margin: '0 auto'
      }
    }));
  }
  if (error) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: '32px 40px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: '20px',
        backgroundColor: '#fee2e2',
        borderRadius: '8px',
        marginBottom: '20px',
        color: '#b91c1c',
        fontSize: '16px'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        fontWeight: 'bold',
        marginBottom: '10px'
      }
    }, "Error: ", error), /*#__PURE__*/_react.default.createElement("p", null, "There was a problem loading the admin settings.")), /*#__PURE__*/_react.default.createElement("button", {
      onClick: handleRetry,
      style: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      }
    }, "Retry Loading Settings"));
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '32px 40px',
      maxWidth: 1200
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      fontSize: 32,
      fontWeight: 700,
      color: '#1e293b',
      marginBottom: 8
    }
  }, "Site Settings"), /*#__PURE__*/_react.default.createElement("p", {
    style: {
      color: '#64748b',
      fontSize: 16
    }
  }, "Control what users can see and do on the frontend")), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gap: 32
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 20,
      color: '#1e293b'
    }
  }, "\uD83D\uDEA7 Site-wide Settings"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, "Maintenance Mode"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontSize: 14,
      color: '#64748b'
    }
  }, "Temporarily disable the site for all users")), /*#__PURE__*/_react.default.createElement("label", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: 60,
      height: 34
    }
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "checkbox",
    checked: settings.maintenanceMode,
    onChange: () => handleToggle('maintenanceMode'),
    style: {
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
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
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
      borderRadius: '50%',
      transition: '.4s'
    }
  })))), settings.maintenanceMode && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/_react.default.createElement("label", {
    style: {
      display: 'block',
      marginBottom: 8,
      fontWeight: 500
    }
  }, "Maintenance Message"), /*#__PURE__*/_react.default.createElement("textarea", {
    value: settings.maintenanceMessage,
    onChange: e => handleInputChange('maintenanceMessage', e.target.value),
    style: {
      width: '100%',
      padding: 12,
      border: '1px solid #d1d5db',
      borderRadius: 6,
      fontSize: 14,
      minHeight: 80
    },
    placeholder: "Message to show users during maintenance"
  })))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 20,
      color: '#1e293b'
    }
  }, "\u2699\uFE0F Feature Toggles"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, [{
    key: 'allowNewRegistrations',
    label: 'Allow New User Registrations',
    desc: 'Let new users create accounts'
  }, {
    key: 'allowRoomPosting',
    label: 'Allow Room Posting',
    desc: 'Let users post new rooms'
  }, {
    key: 'allowReviews',
    label: 'Allow Reviews',
    desc: 'Let users leave reviews'
  }, {
    key: 'allowContactHost',
    label: 'Allow Contact Host',
    desc: 'Let users contact room hosts'
  }].map(({
    key,
    label,
    desc
  }) => /*#__PURE__*/_react.default.createElement("div", {
    key: key,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, label), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontSize: 14,
      color: '#64748b'
    }
  }, desc)), /*#__PURE__*/_react.default.createElement("label", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: 60,
      height: 34
    }
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "checkbox",
    checked: settings[key],
    onChange: () => handleToggle(key),
    style: {
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
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
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
      borderRadius: '50%',
      transition: '.4s'
    }
  }))))))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 20,
      color: '#1e293b'
    }
  }, "\uD83C\uDFA8 Display Controls"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, [{
    key: 'showFeaturedProperties',
    label: 'Show Featured Properties',
    desc: 'Display featured properties section'
  }, {
    key: 'showPopularCities',
    label: 'Show Popular Cities',
    desc: 'Display popular cities section'
  }, {
    key: 'showTestimonials',
    label: 'Show Testimonials',
    desc: 'Display testimonials section'
  }, {
    key: 'showWhyChooseUs',
    label: 'Show Why Choose Us',
    desc: 'Display why choose us section'
  }, {
    key: 'showMapView',
    label: 'Show Map View',
    desc: 'Allow users to view rooms on map'
  }].map(({
    key,
    label,
    desc
  }) => /*#__PURE__*/_react.default.createElement("div", {
    key: key,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, label), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontSize: 14,
      color: '#64748b'
    }
  }, desc)), /*#__PURE__*/_react.default.createElement("label", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: 60,
      height: 34
    }
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "checkbox",
    checked: settings[key],
    onChange: () => handleToggle(key),
    style: {
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
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
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
      borderRadius: '50%',
      transition: '.4s'
    }
  }))))))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 20,
      color: '#1e293b'
    }
  }, "\uD83D\uDEE1\uFE0F Content Moderation"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, [{
    key: 'autoApproveRooms',
    label: 'Auto-approve Rooms',
    desc: 'Automatically approve new room postings'
  }, {
    key: 'requireRoomApproval',
    label: 'Require Room Approval',
    desc: 'Manually review all room postings'
  }].map(({
    key,
    label,
    desc
  }) => /*#__PURE__*/_react.default.createElement("div", {
    key: key,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, label), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontSize: 14,
      color: '#64748b'
    }
  }, desc)), /*#__PURE__*/_react.default.createElement("label", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: 60,
      height: 34
    }
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "checkbox",
    checked: settings[key],
    onChange: () => handleToggle(key),
    style: {
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
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
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
      borderRadius: '50%',
      transition: '.4s'
    }
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", {
    style: {
      display: 'block',
      marginBottom: 8,
      fontWeight: 500
    }
  }, "Max Images Per Room"), /*#__PURE__*/_react.default.createElement("input", {
    type: "number",
    value: settings.maxImagesPerRoom,
    onChange: e => handleInputChange('maxImagesPerRoom', parseInt(e.target.value)),
    style: {
      width: '100%',
      padding: 12,
      border: '1px solid #d1d5db',
      borderRadius: 6,
      fontSize: 14
    },
    min: "1",
    max: "20"
  })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", {
    style: {
      display: 'block',
      marginBottom: 8,
      fontWeight: 500
    }
  }, "Max Price"), /*#__PURE__*/_react.default.createElement("input", {
    type: "number",
    value: settings.maxPrice,
    onChange: e => handleInputChange('maxPrice', parseInt(e.target.value)),
    style: {
      width: '100%',
      padding: 12,
      border: '1px solid #d1d5db',
      borderRadius: 6,
      fontSize: 14
    },
    min: "0"
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 20,
      color: '#1e293b'
    }
  }, "\uD83D\uDC65 User Restrictions"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, [{
    key: 'allowGuestBrowsing',
    label: 'Allow Guest Browsing',
    desc: 'Let non-logged users browse rooms'
  }, {
    key: 'requireLoginForContact',
    label: 'Require Login for Contact',
    desc: 'Force users to login before contacting hosts'
  }].map(({
    key,
    label,
    desc
  }) => /*#__PURE__*/_react.default.createElement("div", {
    key: key,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: 4
    }
  }, label), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontSize: 14,
      color: '#64748b'
    }
  }, desc)), /*#__PURE__*/_react.default.createElement("label", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: 60,
      height: 34
    }
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "checkbox",
    checked: settings[key],
    onChange: () => handleToggle(key),
    style: {
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
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
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
      borderRadius: '50%',
      transition: '.4s'
    }
  }))))))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 20,
      color: '#1e293b'
    }
  }, "\uD83D\uDCAC Custom Messages"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", {
    style: {
      display: 'block',
      marginBottom: 8,
      fontWeight: 500
    }
  }, "Welcome Message"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    value: settings.welcomeMessage,
    onChange: e => handleInputChange('welcomeMessage', e.target.value),
    style: {
      width: '100%',
      padding: 12,
      border: '1px solid #d1d5db',
      borderRadius: 6,
      fontSize: 14
    },
    placeholder: "Welcome message for users"
  })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", {
    style: {
      display: 'block',
      marginBottom: 8,
      fontWeight: 500
    }
  }, "Footer Message"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    value: settings.footerMessage,
    onChange: e => handleInputChange('footerMessage', e.target.value),
    style: {
      width: '100%',
      padding: 12,
      border: '1px solid #d1d5db',
      borderRadius: 6,
      fontSize: 14
    },
    placeholder: "Footer message"
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      background: '#fff',
      padding: '20px 0',
      borderTop: '1px solid #e2e8f0',
      marginTop: 32
    }
  }, /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleSave,
    disabled: saving,
    style: {
      background: saving ? '#9ca3af' : '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      padding: '12px 24px',
      fontSize: 16,
      fontWeight: 600,
      cursor: saving ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s'
    }
  }, saving ? 'Saving...' : 'Save Settings')));
}
var _default = exports.default = AdminSettingsPanel;
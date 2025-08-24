"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _AdminUserContext = require("./AdminUserContext");
var _api = require("../api");
require("./AdminProfile.css");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
function AdminProfile() {
  const {
    admin,
    logout
  } = (0, _AdminUserContext.useAdminUser)();
  const [form, setForm] = (0, _react.useState)({
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [oldPassword, setOldPassword] = (0, _react.useState)('');
  const [newPassword, setNewPassword] = (0, _react.useState)('');
  const [confirmPassword, setConfirmPassword] = (0, _react.useState)('');
  const [editing, setEditing] = (0, _react.useState)(false);
  const [showPasswordFields, setShowPasswordFields] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)('');
  const [success, setSuccess] = (0, _react.useState)('');
  const [loading, setLoading] = (0, _react.useState)(true);
  const [imgUploading, setImgUploading] = (0, _react.useState)(false);
  const fileInputRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await (0, _api.fetchAdminProfile)();
        setForm({
          avatar: data.avatar || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || ''
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
    const {
      name,
      value
    } = e.target;
    setForm(f => ({
      ...f,
      [name]: value
    }));
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
      await (0, _api.updateAdminProfile)({
        avatar: form.avatar,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        ...(showPasswordFields ? {
          currentPassword: oldPassword,
          newPassword
        } : {})
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
      body: data
    });
    const json = await res.json();
    setForm(f => ({
      ...f,
      avatar: json.secure_url
    }));
    setImgUploading(false);
  };
  if (loading) return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-root"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-loading"
  }, "Loading..."));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-root"
  }, /*#__PURE__*/_react.default.createElement("form", {
    className: "admin-profile-form-modern",
    onSubmit: handleSave,
    autoComplete: "off"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-avatar-modern-wrap"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: form.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.firstName + ' ' + form.lastName),
    alt: "Admin Avatar",
    className: "admin-profile-avatar-modern"
  }), editing && /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: "admin-profile-avatar-upload-btn",
    onClick: () => fileInputRef.current && fileInputRef.current.click(),
    tabIndex: -1
  }, /*#__PURE__*/_react.default.createElement("span", {
    role: "img",
    "aria-label": "Upload"
  }, "\uD83D\uDCF7")), /*#__PURE__*/_react.default.createElement("input", {
    type: "file",
    accept: "image/*",
    ref: fileInputRef,
    style: {
      display: 'none'
    },
    onChange: handleAvatarUpload,
    disabled: imgUploading
  })), !editing ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-view-row-modern"
  }, /*#__PURE__*/_react.default.createElement("b", null, "First Name:"), " ", form.firstName), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-view-row-modern"
  }, /*#__PURE__*/_react.default.createElement("b", null, "Last Name:"), " ", form.lastName), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-view-row-modern"
  }, /*#__PURE__*/_react.default.createElement("b", null, "Email:"), " ", form.email), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-view-row-modern"
  }, /*#__PURE__*/_react.default.createElement("b", null, "Phone:"), " ", form.phone), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-actions-modern"
  }, /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: "admin-profile-cancel-btn",
    onClick: handleLogout
  }, "Logout"), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: "admin-profile-save-btn",
    onClick: handleEdit
  }, "Edit Profile"))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("label", {
    className: "admin-profile-label-modern"
  }, "First Name", /*#__PURE__*/_react.default.createElement("input", {
    name: "firstName",
    value: form.firstName,
    onChange: handleChange,
    required: true,
    className: "admin-profile-input-modern"
  })), /*#__PURE__*/_react.default.createElement("label", {
    className: "admin-profile-label-modern"
  }, "Last Name", /*#__PURE__*/_react.default.createElement("input", {
    name: "lastName",
    value: form.lastName,
    onChange: handleChange,
    required: true,
    className: "admin-profile-input-modern"
  })), /*#__PURE__*/_react.default.createElement("label", {
    className: "admin-profile-label-modern"
  }, "Email", /*#__PURE__*/_react.default.createElement("input", {
    name: "email",
    value: form.email,
    onChange: handleChange,
    required: true,
    type: "email",
    className: "admin-profile-input-modern"
  })), /*#__PURE__*/_react.default.createElement("label", {
    className: "admin-profile-label-modern"
  }, "Phone", /*#__PURE__*/_react.default.createElement("input", {
    name: "phone",
    value: form.phone,
    onChange: handleChange,
    className: "admin-profile-input-modern"
  })), showPasswordFields ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("label", {
    className: "admin-profile-label-modern"
  }, "Old Password", /*#__PURE__*/_react.default.createElement("input", {
    type: "password",
    value: oldPassword,
    onChange: e => setOldPassword(e.target.value),
    required: true,
    className: "admin-profile-input-modern"
  })), /*#__PURE__*/_react.default.createElement("label", {
    className: "admin-profile-label-modern"
  }, "New Password", /*#__PURE__*/_react.default.createElement("input", {
    type: "password",
    value: newPassword,
    onChange: e => setNewPassword(e.target.value),
    required: true,
    className: "admin-profile-input-modern"
  })), /*#__PURE__*/_react.default.createElement("label", {
    className: "admin-profile-label-modern"
  }, "Confirm Password", /*#__PURE__*/_react.default.createElement("input", {
    type: "password",
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value),
    required: true,
    className: "admin-profile-input-modern"
  }))) : /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: "admin-profile-save-btn",
    style: {
      marginBottom: 12
    },
    onClick: () => setShowPasswordFields(true)
  }, "Change Password"), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-actions-modern"
  }, /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: "admin-profile-cancel-btn",
    onClick: () => {
      setEditing(false);
      setShowPasswordFields(false);
      setError('');
      setSuccess('');
    }
  }, "Cancel"), /*#__PURE__*/_react.default.createElement("button", {
    type: "submit",
    className: "admin-profile-save-btn"
  }, "Save Changes"))), imgUploading && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-uploading-modern"
  }, "Uploading avatar..."), error && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-error-modern"
  }, error), success && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-profile-success-modern"
  }, success)));
}
var _default = exports.default = AdminProfile;
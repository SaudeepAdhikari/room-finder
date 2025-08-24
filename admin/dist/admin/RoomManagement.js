"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _fa = require("react-icons/fa");
require("./RoomManagement.css");
var _api = require("../api");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const initialForm = {
  title: '',
  description: '',
  location: '',
  price: '',
  amenities: '',
  imageUrl: '',
  status: 'active'
};
function RoomManagement({
  searchFilter
}) {
  const [rooms, setRooms] = (0, _react.useState)([]);
  const [filtered, setFiltered] = (0, _react.useState)([]);
  const [search, setSearch] = (0, _react.useState)('');
  const [sort, setSort] = (0, _react.useState)('createdAt');
  const [sortDir, setSortDir] = (0, _react.useState)('desc');
  const [loading, setLoading] = (0, _react.useState)(true);
  const [showForm, setShowForm] = (0, _react.useState)(false);
  const [form, setForm] = (0, _react.useState)(initialForm);
  const [editId, setEditId] = (0, _react.useState)(null);
  const [imgUploading, setImgUploading] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    loadRooms();
  }, []);
  (0, _react.useEffect)(() => {
    let data = [...rooms];

    // Apply text search filter
    if (search) {
      data = data.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase()));
    }

    // Apply search filter from universal search if present
    if (searchFilter) {
      data = data.filter(r => r._id === searchFilter);
    }
    data.sort((a, b) => {
      if (sortDir === 'asc') return a[sort] > b[sort] ? 1 : -1;
      return a[sort] < b[sort] ? 1 : -1;
    });
    setFiltered(data);
  }, [rooms, search, sort, sortDir, searchFilter]);
  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await (0, _api.fetchAllRoomsAdminEnhanced)();
      setRooms(data);
    } catch (e) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async id => {
    if (!window.confirm('Delete this room?')) return;
    await (0, _api.deleteRoomAdmin)(id);
    setRooms(rooms => rooms.filter(r => r._id !== id));
  };
  const handleEdit = room => {
    setForm({
      ...room,
      amenities: (room.amenities || []).join(', ')
    });
    setEditId(room._id);
    setShowForm(true);
  };
  const handleStatusToggle = async room => {
    const updated = {
      ...room,
      status: room.status === 'active' ? 'inactive' : 'active'
    };
    await (0, _api.updateRoomAdmin)(room._id, updated);
    setRooms(rooms => rooms.map(r => r._id === room._id ? updated : r));
  };
  const handleFormChange = e => {
    const {
      name,
      value
    } = e.target;
    setForm(f => ({
      ...f,
      [name]: value
    }));
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
      body: data
    });
    const json = await res.json();
    setForm(f => ({
      ...f,
      imageUrl: json.secure_url
    }));
    setImgUploading(false);
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean)
    };
    try {
      if (editId) {
        const updated = await (0, _api.updateRoomAdmin)(editId, payload);
        setRooms(rooms => rooms.map(r => r._id === editId ? updated : r));
      } else {
        const created = await (0, _api.addRoomAdmin)(payload);
        setRooms(rooms => [created, ...rooms]);
      }
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
    } catch (e) {
      setError('Failed to save room');
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-root"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-header"
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Room Management"), /*#__PURE__*/_react.default.createElement("button", {
    className: "room-mgmt-add",
    onClick: () => {
      setShowForm(true);
      setForm(initialForm);
      setEditId(null);
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaPlus, null), " Add Room")), /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-controls"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "room-mgmt-search",
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "Search by title or location..."
  }), /*#__PURE__*/_react.default.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "createdAt"
  }, "Newest"), /*#__PURE__*/_react.default.createElement("option", {
    value: "price"
  }, "Price"), /*#__PURE__*/_react.default.createElement("option", {
    value: "title"
  }, "Title")), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => setSortDir(d => d === 'asc' ? 'desc' : 'asc')
  }, /*#__PURE__*/_react.default.createElement(_fa.FaSync, null))), loading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-loading"
  }, "Loading...") : /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-table-wrap"
  }, /*#__PURE__*/_react.default.createElement("table", {
    className: "room-mgmt-table"
  }, /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", null, "Image"), /*#__PURE__*/_react.default.createElement("th", null, "Title"), /*#__PURE__*/_react.default.createElement("th", null, "Location"), /*#__PURE__*/_react.default.createElement("th", null, "Price"), /*#__PURE__*/_react.default.createElement("th", null, "Status"), /*#__PURE__*/_react.default.createElement("th", null, "Actions"))), /*#__PURE__*/_react.default.createElement("tbody", null, filtered.map(room => /*#__PURE__*/_react.default.createElement("tr", {
    key: room._id
  }, /*#__PURE__*/_react.default.createElement("td", null, room.imageUrl && /*#__PURE__*/_react.default.createElement("img", {
    src: room.imageUrl,
    alt: "room",
    className: "room-mgmt-thumb"
  })), /*#__PURE__*/_react.default.createElement("td", null, room.title), /*#__PURE__*/_react.default.createElement("td", null, room.location), /*#__PURE__*/_react.default.createElement("td", null, room.price), /*#__PURE__*/_react.default.createElement("td", null, /*#__PURE__*/_react.default.createElement("button", {
    className: "room-mgmt-status",
    onClick: () => handleStatusToggle(room)
  }, room.status === 'active' ? /*#__PURE__*/_react.default.createElement(_fa.FaToggleOn, {
    color: "#22c55e"
  }) : /*#__PURE__*/_react.default.createElement(_fa.FaToggleOff, {
    color: "#ef4444"
  }))), /*#__PURE__*/_react.default.createElement("td", null, /*#__PURE__*/_react.default.createElement("button", {
    className: "room-mgmt-edit",
    onClick: () => handleEdit(room)
  }, /*#__PURE__*/_react.default.createElement(_fa.FaEdit, null)), /*#__PURE__*/_react.default.createElement("button", {
    className: "room-mgmt-delete",
    onClick: () => handleDelete(room._id)
  }, /*#__PURE__*/_react.default.createElement(_fa.FaTrash, null)))))))), showForm && /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-modal-bg"
  }, /*#__PURE__*/_react.default.createElement("form", {
    className: "room-mgmt-modal",
    onSubmit: handleFormSubmit
  }, /*#__PURE__*/_react.default.createElement("h3", null, editId ? 'Edit Room' : 'Add Room'), /*#__PURE__*/_react.default.createElement("input", {
    name: "title",
    value: form.title,
    onChange: handleFormChange,
    placeholder: "Title",
    required: true
  }), /*#__PURE__*/_react.default.createElement("textarea", {
    name: "description",
    value: form.description,
    onChange: handleFormChange,
    placeholder: "Description"
  }), /*#__PURE__*/_react.default.createElement("input", {
    name: "location",
    value: form.location,
    onChange: handleFormChange,
    placeholder: "Location",
    required: true
  }), /*#__PURE__*/_react.default.createElement("input", {
    name: "price",
    value: form.price,
    onChange: handleFormChange,
    placeholder: "Price",
    type: "number",
    required: true
  }), /*#__PURE__*/_react.default.createElement("input", {
    name: "amenities",
    value: form.amenities,
    onChange: handleFormChange,
    placeholder: "Amenities (comma separated)"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-img-upload"
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: handleImageUpload
  }), imgUploading ? /*#__PURE__*/_react.default.createElement("span", null, "Uploading...") : form.imageUrl && /*#__PURE__*/_react.default.createElement("img", {
    src: form.imageUrl,
    alt: "preview",
    className: "room-mgmt-thumb"
  })), /*#__PURE__*/_react.default.createElement("select", {
    name: "status",
    value: form.status,
    onChange: handleFormChange
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "active"
  }, "Active"), /*#__PURE__*/_react.default.createElement("option", {
    value: "inactive"
  }, "Inactive")), /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-modal-actions"
  }, /*#__PURE__*/_react.default.createElement("button", {
    type: "submit"
  }, "Save"), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    onClick: () => setShowForm(false)
  }, "Cancel")), error && /*#__PURE__*/_react.default.createElement("div", {
    className: "room-mgmt-error"
  }, error))));
}
var _default = exports.default = RoomManagement;
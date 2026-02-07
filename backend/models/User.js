const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed password
    phone: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
    banned: { type: Boolean, default: false }, // Admin can ban users
    avatar: { type: String }, // Cloudinary URL for profile image
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
});

module.exports = mongoose.model('User', UserSchema); 
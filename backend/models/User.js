const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed password
    phone: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String } // Cloudinary URL for profile image
});

module.exports = mongoose.model('User', UserSchema); 
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'room-finder/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        // Remove transformation restriction
        // transformation: [{ width: 256, height: 256, crop: 'thumb', gravity: 'face' }],
    },
});
const uploadAvatar = multer({ storage: avatarStorage });

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, phone, firstName, lastName } = req.body;
        if (!email || !password || !phone) return res.status(400).json({ error: 'Email, password, and phone number are required.' });
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email already registered.' });
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hash, phone, firstName, lastName });
        req.session.userId = user._id;
        res.status(201).json({ email: user.email, phone: user.phone, createdAt: user.createdAt, firstName: user.firstName, lastName: user.lastName });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already registered.' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid data provided.' });
        }
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
        req.session.userId = user._id;
        res.json({ email: user.email, phone: user.phone, createdAt: user.createdAt, isAdmin: user.isAdmin, avatar: user.avatar });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

// Get current user
router.get('/me', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ email: user.email, phone: user.phone, createdAt: user.createdAt, isAdmin: user.isAdmin, avatar: user.avatar });
});

// Avatar upload endpoint
router.post('/me/avatar', uploadAvatar.single('avatar'), async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'Avatar upload failed' });
    }
    // Optionally update user avatar field here
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.avatar = req.file.path;
    await user.save();
    res.json({ avatar: req.file.path });
});

// Update current user's profile or password
router.put('/me', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { email, phone, currentPassword, newPassword, avatar, firstName, lastName } = req.body;
    // Update email/phone/avatar if provided
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    // Change password if requested
    if (newPassword) {
        if (!currentPassword) {
            return res.status(400).json({ error: 'Current password required to change password.' });
        }
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ email: user.email, phone: user.phone, createdAt: user.createdAt, avatar: user.avatar, firstName: user.firstName, lastName: user.lastName });
});

// Admin middleware
function requireAdmin(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    User.findById(req.session.userId).then(user => {
        if (!user || !user.isAdmin) return res.status(403).json({ error: 'Not authorized' });
        next();
    });
}

// Check if current user is admin
router.get('/admin', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ isAdmin: !!user.isAdmin });
});

// List all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user (admin only)
router.put('/users/:id', requireAdmin, async (req, res) => {
    try {
        const { isAdmin, phone } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (isAdmin !== undefined) user.isAdmin = isAdmin;
        if (phone !== undefined) user.phone = phone;
        await user.save();
        res.json({ message: 'User updated', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a user (admin only)
router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.deleteOne();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get total user count and recent user counts (admin only)
router.get('/admin/usercount', requireAdmin, async (req, res) => {
    try {
        const count = await User.countDocuments();
        const now = new Date();
        const recent7 = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } });
        const recent30 = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } });
        res.json({ count, recent7, recent30 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get 5 most recent users (admin only)
router.get('/admin/recentusers', requireAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 }).limit(5);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TEMPORARY: Dev-only route to create an admin user. REMOVE IN PRODUCTION!
router.post('/dev-create-admin', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not allowed in production' });
    }
    const email = 'saudeep@gmail.com';
    const password = 'saudeep123';
    const phone = '9999999999';
    try {
        let user = await User.findOne({ email });
        if (user) {
            user.isAdmin = true;
            user.password = await bcrypt.hash(password, 10);
            await user.save();
            return res.json({ message: 'Admin user updated', email });
        }
        const hash = await bcrypt.hash(password, 10);
        user = await User.create({ email, password: hash, phone, isAdmin: true });
        res.json({ message: 'Admin user created', email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
module.exports.requireAdmin = requireAdmin; 
const bcrypt = require('bcrypt');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { email, password, phone, firstName, lastName } = req.body;
        if (!email || !password || !phone) {
            return res.status(400).json({ error: 'Email, password, and phone number are required.' });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email already registered.' });
        
        const hash = await bcrypt.hash(password, 10);
        const userData = { 
            email, 
            password: hash, 
            phone, 
            firstName: firstName || '', 
            lastName: lastName || '' 
        };
        
        if (req.file && req.file.path) {
            userData.avatar = req.file.path;
        }

        const user = await User.create(userData);
        req.session.userId = user._id;
        
        res.status(201).json({ 
            email: user.email, 
            phone: user.phone, 
            createdAt: user.createdAt, 
            firstName: user.firstName, 
            lastName: user.lastName,
            avatar: user.avatar
        });
    } catch (err) {
        console.error('Registration error:', err && err.message ? err.message : err);
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already registered.' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid data provided.' });
        }
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
        req.session.userId = user._id;
        res.json({
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (err) {
        console.error('Login error:', err && err.message ? err.message : err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.clearCookie('user_sid');
        res.clearCookie('admin_sid');
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
};

const getCurrentUser = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

    if (req.session.cookie && req.session.cookie.expires) {
        const now = new Date();
        const expires = new Date(req.session.cookie.expires);
        if (now > expires) {
            req.session.destroy((err) => {
                if (err) console.error('Error destroying expired session:', err);
            });
            return res.status(401).json({ error: 'Session expired. Please login again.' });
        }
    }

    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName
    });
};

const getWishlist = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const user = await User.findById(req.session.userId).populate('wishlist');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user.wishlist || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

const toggleWishlistItem = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const roomId = req.params.roomId;
        let isFavorited = false;

        const index = user.wishlist.indexOf(roomId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
            isFavorited = false;
        } else {
            user.wishlist.push(roomId);
            isFavorited = true;
        }

        await user.save();
        res.json({ message: isFavorited ? 'Added to wishlist' : 'Removed from wishlist', isFavorited });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update wishlist' });
    }
};

const uploadAvatar = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'Avatar upload failed' });
    }
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.avatar = req.file.path;
    await user.save();
    res.json({ avatar: req.file.path });
};

const updateProfile = async (req, res) => {
    try {
        if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { email, phone, currentPassword, newPassword, firstName, lastName } = req.body;

        if (email !== undefined && email !== user.email) {
            const exists = await User.findOne({ email });
            if (exists && String(exists._id) !== String(user._id)) {
                return res.status(409).json({ error: 'Email is already in use by another account.' });
            }
            user.email = email;
        }

        if (phone !== undefined) user.phone = phone;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;

        if (req.file && req.file.path) {
            user.avatar = req.file.path;
        }

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
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile. Please try again.' });
    }
};

const checkAdmin = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ isAdmin: !!user.isAdmin });
};

const listUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUserStatus = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.deleteOne();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAdminUserStats = async (req, res) => {
    try {
        const count = await User.countDocuments();
        const now = new Date();
        const recent7 = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } });
        const recent30 = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } });
        res.json({ count, recent7, recent30 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRecentUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 }).limit(5);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const devCreateAdmin = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not allowed in production' });
    }
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const phone = process.env.ADMIN_PHONE || '9999999999';
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
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    getWishlist,
    toggleWishlistItem,
    uploadAvatar,
    updateProfile,
    checkAdmin,
    listUsers,
    updateUserStatus,
    deleteUser,
    getAdminUserStats,
    getRecentUsers,
    devCreateAdmin
};

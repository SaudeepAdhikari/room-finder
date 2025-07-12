const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const AdminSettings = require('../models/AdminSettings');
const bcrypt = require('bcrypt');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Admin login attempt for:', email);

        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            console.log('Invalid admin credentials for:', email);
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        req.session.adminId = admin._id;
        console.log('Admin session created for:', admin._id);

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session creation failed' });
            }
            console.log('Admin session saved successfully');
            res.json({ _id: admin._id, email: admin.email, isAdmin: true });
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Admin logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('admin_sid');
        res.json({ message: 'Logged out' });
    });
});

// Middleware to protect admin routes
function requireAdminAuth(req, res, next) {
    console.log('Admin session:', req.session);
    if (req.session && req.session.adminId) return next();
    res.status(401).json({ error: 'Admin not authenticated' });
}

// Example protected admin route
router.get('/me', requireAdminAuth, async (req, res) => {
    const admin = await User.findById(req.session.adminId);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ _id: admin._id, email: admin.email, isAdmin: true });
});

// Debug endpoint to check session
router.get('/debug-session', (req, res) => {
    console.log('Debug session - Full session:', req.session);
    console.log('Debug session - Session ID:', req.sessionID);
    console.log('Debug session - AdminId:', req.session?.adminId);
    res.json({
        sessionExists: !!req.session,
        sessionId: req.sessionID,
        adminId: req.session?.adminId,
        sessionKeys: req.session ? Object.keys(req.session) : []
    });
});

// Get admin settings
router.get('/settings', requireAdminAuth, async (req, res) => {
    try {
        console.log('Admin settings request - Session:', req.session);
        console.log('Admin settings request - AdminId:', req.session.adminId);

        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = new AdminSettings();
            await settings.save();
        }
        console.log('Settings fetched successfully');
        res.json(settings);
    } catch (error) {
        console.error('Settings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update admin settings
router.put('/settings', requireAdminAuth, async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = new AdminSettings();
        }

        // Update settings with request body
        Object.assign(settings, req.body);
        settings.updatedBy = req.session.adminId;
        settings.updatedAt = new Date();

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Get all users with admin controls
router.get('/users', requireAdminAuth, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Ban/Unban user
router.put('/users/:userId/ban', requireAdminAuth, async (req, res) => {
    try {
        const { banned } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { banned },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Get all rooms with admin controls
router.get('/rooms', requireAdminAuth, async (req, res) => {
    try {
        const rooms = await Room.find({}).populate('user', 'email');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Approve room
router.put('/rooms/:roomId/approve', requireAdminAuth, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.roomId,
            { status: 'approved' },
            { new: true }
        ).populate('user', 'email');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve room' });
    }
});

// Reject room
router.put('/rooms/:roomId/reject', requireAdminAuth, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.roomId,
            { status: 'rejected' },
            { new: true }
        ).populate('user', 'email');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject room' });
    }
});

// Delete room
router.delete('/rooms/:roomId', requireAdminAuth, async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
});

// Get dashboard statistics
router.get('/stats', requireAdminAuth, async (req, res) => {
    try {
        const [
            totalUsers,
            totalRooms,
            pendingRooms,
            approvedRooms,
            rejectedRooms,
            bannedUsers
        ] = await Promise.all([
            User.countDocuments(),
            Room.countDocuments(),
            Room.countDocuments({ status: 'pending' }),
            Room.countDocuments({ status: 'approved' }),
            Room.countDocuments({ status: 'rejected' }),
            User.countDocuments({ banned: true })
        ]);

        res.json({
            totalUsers,
            totalRooms,
            pendingRooms,
            approvedRooms,
            rejectedRooms,
            bannedUsers
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router; 
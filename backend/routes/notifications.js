const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Auth middleware
function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

// Get all notifications for the logged-in user
router.get('/', requireAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.session.userId
        })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        res.json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Get unread count
router.get('/unread-count', requireAuth, async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.session.userId,
            isRead: false
        });

        res.json({ count });
    } catch (err) {
        console.error('Error fetching unread count:', err);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});

// Mark a specific notification as read
router.put('/:id/read', requireAuth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Check if user owns this notification
        if (String(notification.recipient) !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// Mark all notifications as read
router.put('/mark-all-read', requireAuth, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.session.userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
});

// Delete a notification
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Check if user owns this notification
        if (String(notification.recipient) !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await notification.deleteOne();

        res.json({ message: 'Notification deleted' });
    } catch (err) {
        console.error('Error deleting notification:', err);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

module.exports = router;

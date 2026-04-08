const User = require('../models/User');

/**
 * Middleware to require authentication (User session)
 */
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated. Please login as a user.' });
    }
    next();
};

/**
 * Middleware to require Admin authentication (Admin session or User with isAdmin flag)
 */
const requireAdmin = async (req, res, next) => {
    try {
        // Check for admin session first (used by admin dashboard)
        if (req.session && req.session.adminId) {
            return next();
        }

        // Fallback: check if the user session belongs to an admin
        if (req.session && req.session.userId) {
            const user = await User.findById(req.session.userId);
            if (user && user.isAdmin) {
                return next();
            }
        }

        return res.status(403).json({ error: 'Not authorized. Admin access required.' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    requireAuth,
    requireAdmin
};

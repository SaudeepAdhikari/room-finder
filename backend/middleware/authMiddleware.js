const User = require('../models/User');

function requireAdmin(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    User.findById(req.session.userId).then(user => {
        if (!user || !user.isAdmin) return res.status(403).json({ error: 'Not authorized' });
        next();
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
}

function requireAdminAuth(req, res, next) {
    if (!req.session) {
        return res.status(401).json({ error: 'Admin not authenticated - No session' });
    }
    if (!req.session.adminId) {
        return res.status(401).json({ error: 'Admin not authenticated - Not logged in' });
    }
    next();
}

module.exports = {
    requireAdmin,
    requireAdminAuth
};

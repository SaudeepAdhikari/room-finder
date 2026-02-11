const express = require('express');
const router = express.Router();
const esewaController = require('../controllers/esewaController');

// Auth middleware
function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

router.post('/initiate', requireAuth, esewaController.initiatePayment);
router.post('/verify', esewaController.verifyPayment);

module.exports = router;

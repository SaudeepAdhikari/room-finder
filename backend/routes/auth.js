const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAdmin } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

// Auth endpoints
router.post('/register', uploadAvatar.single('avatar'), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// User Profile endpoints
router.get('/me', authController.getCurrentUser);
router.post('/me/avatar', uploadAvatar.single('avatar'), authController.uploadAvatar);
router.put('/me', uploadAvatar.single('avatar'), authController.updateProfile);

// Wishlist endpoints
router.get('/wishlist', authController.getWishlist);
router.post('/wishlist/:roomId', authController.toggleWishlistItem);

// Admin-specific endpoints (accessible via /api/auth namespace)
router.get('/admin', authController.checkAdmin);
router.get('/users', requireAdmin, authController.listUsers);
router.put('/users/:id', requireAdmin, authController.updateUserStatus);
router.delete('/users/:id', requireAdmin, authController.deleteUser);
router.get('/admin/usercount', requireAdmin, authController.getAdminUserStats);
router.get('/admin/recentusers', requireAdmin, authController.getRecentUsers);

// Dev only
router.post('/dev-create-admin', authController.devCreateAdmin);

module.exports = router;
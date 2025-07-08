const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// Cloudinary & Multer setup
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { requireAdmin } = require('./auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'room-finder',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    let filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new room
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, location, price, amenities, imageUrl } = req.body;
    const newRoom = new Room({
      title,
      description,
      location,
      price,
      amenities,
      imageUrl,
      user: req.session.userId
    });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get rooms owned by the current user
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const rooms = await Room.find({ user: req.session.userId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a room (only if owner)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (String(room.user) !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const { title, description, location, price, amenities, imageUrl } = req.body;
    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    if (location !== undefined) room.location = location;
    if (price !== undefined) room.price = price;
    if (amenities !== undefined) room.amenities = amenities;
    if (imageUrl !== undefined) room.imageUrl = imageUrl;
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a room (only if owner)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (String(room.user) !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Image upload endpoint
router.post('/upload-image', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Image upload failed' });
  }
  res.json({ imageUrl: req.file.path });
});

// List all rooms (admin only)
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const rooms = await Room.find({}).populate('user', 'email phone');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update any room (admin only)
router.put('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const { title, description, location, price, amenities, imageUrl } = req.body;
    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    if (location !== undefined) room.location = location;
    if (price !== undefined) room.price = price;
    if (amenities !== undefined) room.amenities = amenities;
    if (imageUrl !== undefined) room.imageUrl = imageUrl;
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete any room (admin only)
router.delete('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

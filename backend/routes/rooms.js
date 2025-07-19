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
  console.log('requireAuth - Session:', req.session);
  console.log('requireAuth - Session ID:', req.sessionID);
  console.log('requireAuth - User ID:', req.session?.userId);

  if (!req.session || !req.session.userId) {
    console.log('User not authenticated, rejecting');
    return res.status(401).json({ error: 'Not authenticated' });
  }
  console.log('User authenticated, proceeding');
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
    console.log('Room creation request - Body:', req.body);
    console.log('Room creation request - User ID:', req.session.userId);

    const { title, description, location, price, amenities, imageUrl, images, roommatePreference, availabilityCalendar, rentDocuments, room360s } = req.body;
    const newRoom = new Room({
      title,
      description,
      location,
      price,
      amenities,
      imageUrl,
      images,
      roommatePreference,
      availabilityCalendar,
      rentDocuments,
      room360s: room360s || [],
      user: req.session.userId
    });

    console.log('Room object to save:', newRoom);
    await newRoom.save();
    console.log('Room saved in DB:', await Room.findById(newRoom._id));
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Room creation error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Add a new room with images
router.post('/upload', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Room creation with images - Body:', req.body);
    console.log('Room creation with images - Files:', req.files);
    console.log('Room creation with images - User ID:', req.session.userId);

    // Parse the room data from the JSON string
    const roomData = JSON.parse(req.body.roomData);

    // Get image URLs from Cloudinary upload
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    
    // Create new room with image URLs
    const newRoom = new Room({
      ...roomData,
      images: imageUrls,
      room360s: roomData.room360s || [],
      user: req.session.userId,
      // Ensure status is set to pending for admin approval
      status: 'pending'
    });

    console.log('Room object to save:', newRoom);
    await newRoom.save();
    console.log('Room saved in DB with images:', await Room.findById(newRoom._id));
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Room creation with images error:', err);
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

// Approve a room (admin only)
router.put('/admin/:id/approve', requireAdmin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    room.status = 'approved';
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reject a room (admin only)
router.put('/admin/:id/reject', requireAdmin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    room.status = 'rejected';
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get total room count and pending/approved/rejected/recent room counts (admin only)
router.get('/admin/roomcount', requireAdmin, async (req, res) => {
  try {
    const total = await Room.countDocuments();
    const pending = await Room.countDocuments({ status: 'pending' });
    const approved = await Room.countDocuments({ status: 'approved' });
    const rejected = await Room.countDocuments({ status: 'rejected' });
    const now = new Date();
    const recent7 = await Room.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } });
    const recent30 = await Room.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } });
    res.json({ total, pending, approved, rejected, recent7, recent30 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get 5 most recent rooms (admin only)
router.get('/admin/recentrooms', requireAdmin, async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'email');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

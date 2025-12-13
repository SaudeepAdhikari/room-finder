const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
// AdminSettings removed
const router = express.Router();

// Debug logging helper: set DEBUG_ROOMS=true in the environment to enable
const debugRooms = String(process.env.DEBUG_ROOMS || '').toLowerCase() === 'true';
function debugLog(...args) { if (debugRooms) console.log(...args); }

// Helper to redact sensitive fields from room objects before logging
function redactRoomData(src) {
  if (!src || typeof src !== 'object') return src;
  try {
    const copy = Array.isArray(src) ? src.map(s => redactRoomData(s)) : { ...src };
    // Redact contactInfo if present
    if (copy.contactInfo && typeof copy.contactInfo === 'object') {
      copy.contactInfo = {
        name: copy.contactInfo.name ? '[REDACTED_NAME]' : undefined,
        phone: copy.contactInfo.phone ? '[REDACTED_PHONE]' : undefined,
        email: copy.contactInfo.email ? '[REDACTED_EMAIL]' : undefined
      };
    }
    // Redact obvious sensitive scalar fields
    if (copy.securityDeposit) copy.securityDeposit = '[REDACTED]';
    // Avoid logging long text fields fully; keep lengths only
    if (copy.description && typeof copy.description === 'string') copy.description = `<${copy.description.length} chars>`;
    return copy;
  } catch (e) {
    return '[REDACTED]';
  }
}

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
    const { location, minPrice, maxPrice, search, status } = req.query;
    console.log('GET /rooms query:', req.query);

    let filter = {};

    // Status filter (default to all if not provided, but usually 'approved' from frontend)
    if (status) {
      filter.status = status;
    }

    // By default, do not show rooms that are already booked. If client explicitly
    // passes includeBooked=true, include them. We detect booked rooms by
    // checking confirmed bookings at request time so existing confirmed bookings
    // (created before the isBooked flag existed) are also excluded.
    const includeBooked = String(req.query.includeBooked || '').toLowerCase() === 'true';
    if (!includeBooked) {
      try {
        const bookedRoomIds = await Booking.find({ status: 'confirmed' }).distinct('room');
        if (bookedRoomIds && bookedRoomIds.length > 0) filter._id = { $nin: bookedRoomIds };
      } catch (e) {
        console.warn('Could not compute booked rooms, falling back to isBooked flag:', e && e.message);
        filter.isBooked = { $ne: true };
      }
    }

    // Handle broad search (title, location, city, address)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { city: searchRegex },
        { address: searchRegex }
        // { 'contactInfo.name': searchRegex } // Removed to prevent unexpected matches by host name
      ];
    }
    // Fallback to specific location filter if no broad search provided
    else if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    console.log('GET /rooms final filter:', JSON.stringify(filter, null, 2)); // Debug log
    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single room by id (include uploader and approved reviews)
// Restrict :id to 24-hex ObjectId format so routes like /mine do not get captured here
router.get('/:id([0-9a-fA-F]{24})', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('user', 'firstName lastName email phone avatar');
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Attach approved reviews for the room (if Review model available)
    let reviews = [];
    try {
      const Review = require('../models/Review');
      reviews = await Review.find({ room: room._id, status: 'approved' }).populate('user', 'firstName lastName email avatar').sort({ createdAt: -1 });
    } catch (e) {
      // If Review model or query fails, continue without reviews
      console.warn('Could not load reviews for room detail:', e && e.message);
    }

    const out = room.toObject();
    out.reviews = reviews;
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new room
router.post('/', requireAuth, async (req, res) => {
  try {
    // Respect admin settings for room posting
    // AdminSettings removed: no global gating or price limits enforced here


    // Debug: log session and incoming body keys. Do NOT print sensitive values.
    debugLog('[rooms] POST / - session.userId =', req.session && req.session.userId);
    try {
      const keys = Object.keys(req.body || {});
      debugLog('[rooms] POST / - body keys =', keys);
      // Print a redacted summary of the body (no contact info, phones, emails, deposits)
      const safe = redactRoomData(req.body);
      debugLog('[rooms] POST / - body (redacted) =', JSON.stringify(safe));
    } catch (err) {
      debugLog('[rooms] POST / - failed to read body', err && err.message);
    }
    // Accept either a single 'location' string or separate address/city/state fields.
    // Ignore any provided zipCode (many users don't know it).
    const { title, description, location, address, city, state, price, amenities, imageUrl, images, roommatePreference, availabilityCalendar, room360s,
      roomType, roomSize, maxOccupants, availableFrom, securityDeposit, contactInfo, minStayDuration } = req.body;

    // If location not provided, try to construct it from address/city/state
    const finalLocation = location || ((address || city || state) ? `${address || ''}${address && (city || state) ? ', ' : ''}${city || ''}${city && state ? ', ' : ''}${state || ''}`.trim().replace(/(^,|,$)/g, '') : '');

    const newRoom = new Room({
      title,
      description,
      location: finalLocation,
      address,
      city,
      state,
      price,
      amenities,
      imageUrl,
      images,
      roommatePreference,
      availabilityCalendar,
      room360s: room360s || [],
      roomType,
      roomSize,
      maxOccupants,
      availableFrom,
      minStayDuration,
      securityDeposit,
      contactInfo,
      user: req.session.userId
    });
    // Apply moderation / approval settings
    // AdminSettings removed: keep default moderation behavior (pending)

    await newRoom.save();

    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Room creation error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Add a new room with images
router.post('/upload', requireAuth, upload.array('images', 10), async (req, res) => {
  try {



    // Debug: log session, file count and body keys to help troubleshoot (redacted)
    debugLog('[rooms] POST /upload - session.userId =', req.session && req.session.userId);
    try { debugLog('[rooms] POST /upload - files count =', req.files ? req.files.length : 0); } catch (e) { /* ignore */ }
    try { debugLog('[rooms] POST /upload - body keys =', Object.keys(req.body || {})); } catch (e) { /* ignore */ }
    // Parse the room data from the JSON string
    const roomData = JSON.parse(req.body.roomData);
    // Log a redacted version of the parsed roomData (avoid sensitive fields)
    try { debugLog('[rooms] POST /upload - parsed roomData (redacted) =', JSON.stringify(redactRoomData(roomData))); } catch (e) { debugLog('[rooms] POST /upload - could not stringify roomData', e && e.message); }

    // Normalize location: if not present, try to build from address/city/state; ignore zipCode
    if (!roomData.location) {
      const { address, city, state } = roomData;
      roomData.location = (address || city || state) ? `${address || ''}${address && (city || state) ? ', ' : ''}${city || ''}${city && state ? ', ' : ''}${state || ''}`.trim().replace(/(^,|,$)/g, '') : '';
    }

    // Get image URLs from Cloudinary upload
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    // Create new room with image URLs
    const newRoom = new Room({
      ...roomData,
      address: roomData.address,
      city: roomData.city,
      state: roomData.state,
      images: imageUrls,
      room360s: roomData.room360s || [],
      roomType: roomData.roomType,
      roomSize: roomData.roomSize,
      maxOccupants: roomData.maxOccupants,
      minStayDuration: roomData.minStayDuration,
      availableFrom: roomData.availableFrom,
      securityDeposit: roomData.securityDeposit,
      contactInfo: roomData.contactInfo,
      user: req.session.userId,
      // Ensure status is set to pending for admin approval
      status: 'pending'
    });
    // Enforce image count and price limits from admin settings before saving
    // AdminSettings removed: keep default moderation behavior (pending)

    await newRoom.save();

    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Room creation with images error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get rooms owned by the current user
router.get('/mine', requireAuth, async (req, res) => {
  try {
    // Debug: log who is requesting their listings
    debugLog('[rooms] GET /mine - session.userId =', req.session && req.session.userId);

    // Fetch rooms owned by the user and return a compact, safe projection
    // Exclude rooms that are currently booked (isBooked === true)
    // Return all rooms owned by the user (include booked rooms) so owners can see every listing
    const rooms = await Room.find({ user: req.session.userId })
      .select('title location price status createdAt images isBooked')
      .sort({ createdAt: -1 });

    // Ensure we always return an array (empty if none)
    res.json(Array.isArray(rooms) ? rooms : []);
  } catch (err) {
    console.error('[rooms] GET /mine error for user', req.session && req.session.userId, err && err.message ? err.message : err);
    res.status(500).json({ error: 'Failed to fetch your listings: ' + (err && err.message ? err.message : 'unknown error') });
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
    // Log request body keys and a redacted summary for debugging
    try {
      debugLog('[rooms] PUT /:id - body keys =', Object.keys(req.body || {}));
      debugLog('[rooms] PUT /:id - body (redacted) =', JSON.stringify(redactRoomData(req.body)));
    } catch (e) {
      debugLog('[rooms] PUT /:id - failed to inspect body', e && e.message);
    }
    const { title, description, location, price, amenities, imageUrl, roomType, roomSize, maxOccupants, availableFrom, securityDeposit, contactInfo } = req.body;
    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    if (location !== undefined) room.location = location;
    if (price !== undefined) room.price = price;
    if (amenities !== undefined) room.amenities = amenities;
    if (imageUrl !== undefined) room.imageUrl = imageUrl;
    if (roomType !== undefined) room.roomType = roomType;
    if (roomSize !== undefined) room.roomSize = roomSize;
    if (maxOccupants !== undefined) room.maxOccupants = maxOccupants;
    if (availableFrom !== undefined) room.availableFrom = availableFrom;
    if (securityDeposit !== undefined) room.securityDeposit = securityDeposit;
    if (contactInfo !== undefined) room.contactInfo = contactInfo;
    // Persist address and location details
    if (req.body.address !== undefined) room.address = req.body.address;
    if (req.body.city !== undefined) room.city = req.body.city;
    if (req.body.state !== undefined) room.state = req.body.state;
    if (req.body.minStayDuration !== undefined) room.minStayDuration = req.body.minStayDuration;
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

const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

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
router.post('/', async (req, res) => {
  try {
    const { title, description, location, price, amenities, imageUrl } = req.body;
    const newRoom = new Room({ title, description, location, price, amenities, imageUrl });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

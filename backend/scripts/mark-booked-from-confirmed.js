
// One-off script to set Room.isBooked=true for rooms that have a confirmed booking
// Usage: node backend/scripts/mark-booked-from-confirmed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder';

async function run() {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', mongoUri);
  try {
    const confirmed = await Booking.find({ status: 'confirmed' }).select('room');
    console.log('Found confirmed bookings:', confirmed.length);
    const roomIds = [...new Set(confirmed.map(b => String(b.room)))];
    console.log('Unique room ids to mark booked:', roomIds.length);
    let updated = 0;
    for (const rid of roomIds) {
      const room = await Room.findById(rid);
      if (!room) continue;
      if (!room.isBooked) {
        room.isBooked = true;
        await room.save();
        updated++;
      }
    }
    console.log('Rooms updated:', updated);
  } catch (e) {
    console.error('Script error', e && e.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();

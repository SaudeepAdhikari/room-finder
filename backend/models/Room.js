const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  amenities: [String],
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);

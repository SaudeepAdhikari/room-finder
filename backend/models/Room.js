const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  amenities: [String],
  imageUrl: { type: String },
  images: [String], // For multiple images
  room360s: [{
    title: String,
    imageUrl: String,
    roomId: String,
    uploadedAt: String
  }],
  roommatePreference: { type: String },
  availabilityCalendar: [{
    start: String,
    end: String
  }],
  rentDocuments: [{
    name: String,
    path: String
  }],
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Room', RoomSchema);

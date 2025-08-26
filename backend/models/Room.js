const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  price: { type: Number, required: true },
  roomType: { type: String },
  roomSize: { type: String },
  amenities: [String],
  maxOccupants: { type: Number },
  availableFrom: { type: String },
  securityDeposit: { type: String },
  contactInfo: {
    name: String,
    phone: String,
    email: String
  },
  imageUrl: { type: String },
  images: [String], // For multiple images
  room360s: [{
    title: String,
    imageUrl: String,
    roomId: String,
    uploadedAt: String
  }],
  isBooked: { type: Boolean, default: false },
  roommatePreference: { type: String },
  availabilityCalendar: [{
    start: String,
    end: String
  }],
  minStayDuration: { type: Number },
  rentDocuments: [{
    name: String,
    path: String
  }],
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Room', RoomSchema);

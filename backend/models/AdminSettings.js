const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema({
    // Site-wide settings
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'Site is under maintenance. Please check back later.' },

    // Feature toggles
    allowNewRegistrations: { type: Boolean, default: true },
    allowRoomPosting: { type: Boolean, default: true },
    allowReviews: { type: Boolean, default: true },
    allowContactHost: { type: Boolean, default: true },

    // Display controls
    showFeaturedProperties: { type: Boolean, default: true },
    showPopularCities: { type: Boolean, default: true },
    showTestimonials: { type: Boolean, default: true },
    showWhyChooseUs: { type: Boolean, default: true },
    showMapView: { type: Boolean, default: true },

    // Content moderation settings
    autoApproveRooms: { type: Boolean, default: false },
    requireRoomApproval: { type: Boolean, default: true },
    maxImagesPerRoom: { type: Number, default: 10 },
    maxPrice: { type: Number, default: 10000 },
    minPrice: { type: Number, default: 0 },

    // User restrictions
    allowGuestBrowsing: { type: Boolean, default: true },
    requireLoginForContact: { type: Boolean, default: false },

    // Custom messages
    welcomeMessage: { type: String, default: 'Welcome to Room Finder!' },
    footerMessage: { type: String, default: '© 2024 Room Finder. All rights reserved.' },

    // Last updated
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminSettings', AdminSettingsSchema); 
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    esewaTransactionUuid: {
        type: String,
        required: true,
        index: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed', 'refunded'],
        default: 'pending',
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'esewa',
        required: true
    },
    paymentGatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    transactionDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        additionalInfo: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
transactionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Generate unique transaction ID
transactionSchema.statics.generateTransactionId = function () {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${randomString}`;
};

module.exports = mongoose.model('Transaction', transactionSchema);

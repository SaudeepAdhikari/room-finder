const mongoose = require('mongoose');
require('dotenv').config();
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

async function debugTransactions() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder');
        console.log('--- DB Diagnostic ---');

        const txns = await Transaction.find({});
        console.log('Total transactions found:', txns.length);

        for (let i = 0; i < txns.length; i++) {
            const t = txns[i];
            console.log(`[${i}] ID: ${t.transactionId}, Status: ${t.paymentStatus}`);

            // Check refs
            try {
                const populated = await Transaction.findById(t._id)
                    .populate('tenant')
                    .populate('landlord')
                    .populate('room')
                    .populate('booking');
                console.log(`  Population check: ${populated ? 'OK' : 'FAILED'}`);
                if (populated) {
                    console.log(`  Tenant: ${populated.tenant ? populated.tenant.email : 'MISSING'}`);
                    console.log(`  Landlord: ${populated.landlord ? populated.landlord.email : 'MISSING'}`);
                    console.log(`  Room: ${populated.room ? populated.room.title : 'MISSING'}`);
                    console.log(`  Booking: ${populated.booking ? populated.booking._id : 'MISSING'}`);
                }
            } catch (e) {
                console.error(`  Error populating txn ${t._id}:`, e.message);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Debug failed:', err);
        process.exit(1);
    }
}

debugTransactions();

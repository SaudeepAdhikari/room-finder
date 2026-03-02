const mongoose = require('mongoose');
require('dotenv').config();
const Transaction = require('./models/Transaction');
require('./models/User');
require('./models/Room');
require('./models/Booking');

async function testTransactions() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder');
        console.log('Connected to DB');

        const transactions = await Transaction.find({})
            .populate('tenant')
            .populate('landlord')
            .populate('room')
            .populate('booking');

        console.log('Total transactions:', transactions.length);
        if (transactions.length > 0) {
            console.log('Detailed Transaction sample:', JSON.stringify(transactions[0], null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

testTransactions();

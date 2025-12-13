const mongoose = require('mongoose');
const Room = require('../models/Room');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomloader');
        console.log('Connected to DB');

        const rooms = await Room.find({
            $or: [
                { title: /test debug/i },
                { title: /pepsicola/i }
            ]
        });

        console.log('Found rooms:', rooms.length);
        rooms.forEach(r => {
            console.log('------------------------------------------------');
            console.log('ID:', r._id);
            console.log('Title:', r.title);
            console.log('Location:', r.location);
            console.log('City:', r.city);
            console.log('Address:', r.address);
            console.log('Contact Name:', r.contactInfo ? r.contactInfo.name : 'N/A');
            console.log('Status:', r.status);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();

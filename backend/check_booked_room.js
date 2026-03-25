require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Room = require('./models/Room');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        const rooms = await Room.find({ isBooked: true });
        console.log(`Found ${rooms.length} rooms that are marked as isBooked: true.`);
        for (let r of rooms) {
            console.log(`Room: ${r._id}, Title: ${r.title}, Status: ${r.status}`);
        }
        process.exit(0);
    })
    .catch(console.error);

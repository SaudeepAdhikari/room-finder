require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder',
        collectionName: 'sessions',
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
}));

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder';
console.log('Connecting to MongoDB:', mongoUri);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ MongoDB connected successfully!');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Please check your MongoDB connection string in .env file');
    console.error('For local development, you can use: mongodb://localhost:27017/roomfinder');
});

// Basic route
app.get('/', (req, res) => {
    res.send('Room Finder API is running');
});

// Room routes
app.use('/api/rooms', require('./routes/rooms'));

// Auth routes
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend should be running on http://localhost:3000`);
});

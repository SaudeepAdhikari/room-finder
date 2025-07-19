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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Create user session middleware ONCE
const userSession = session({
    name: 'user_sid',
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder',
        collectionName: 'sessions',
        ttl: 24 * 60 * 60, // 1 day in seconds
        autoRemove: 'interval',
        autoRemoveInterval: 10 // Check for expired sessions every 10 minutes
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: '/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
    },
    rolling: true, // Extend session on each request
    unset: 'destroy' // Remove session from store when unset
});

// Create admin session middleware ONCE
const adminSession = session({
    name: 'admin_sid',
    secret: process.env.ADMIN_SESSION_SECRET || 'adminsupersecret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder',
        collectionName: 'adminSessions',
        ttl: 24 * 60 * 60, // 1 day in seconds
        autoRemove: 'interval',
        autoRemoveInterval: 10 // Check for expired sessions every 10 minutes
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: '/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now
    },
    rolling: true, // Extend session on each request
    unset: 'destroy' // Remove session from store when unset
});

// Use user session for all non-admin routes
app.use((req, res, next) => {
    if (req.path.startsWith('/api/admin')) return next();
    userSession(req, res, next);
});

// Use admin session for all /api/admin routes
app.use('/api/admin', (req, res, next) => {
    adminSession(req, res, next);
});

// Session cleanup middleware
app.use((req, res, next) => {
    // Check if session exists and is not expired
    if (req.session && req.session.cookie && req.session.cookie.expires) {
        const now = new Date();
        const expires = new Date(req.session.cookie.expires);

        if (now > expires) {
            // Session has expired, destroy it
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying expired session:', err);
                }
            });
            return res.status(401).json({ error: 'Session expired. Please login again.' });
        }
    }
    next();
});

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

// Booking routes
app.use('/api/bookings', require('./routes/bookings'));

// Mount admin routes (to be created)
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend should be running on http://localhost:3000`);
});

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
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        path: '/',
    },
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
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        path: '/',
    },
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

// Mount admin routes (to be created)
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend should be running on http://localhost:3000`);
});

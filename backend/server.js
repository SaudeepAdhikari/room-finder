require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import all models to ensure they're registered
require('./models/User');
require('./models/Room');
require('./models/Booking');
require('./models/Review');
require('./models/AdminSettings');

const app = express();
// Bind the backend explicitly to port 5000 for local development per request.
const PORT = 5000;

// Configure CORS origin. Set ALLOW_ALL_ORIGINS=true to allow all origins (useful for quick testing).
// Default client URL remains localhost:3000 for CRA dev server.
const CLIENT_URL = process.env.CLIENT_URL || process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000';
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === 'true';

app.use(cors({
    // When ALLOW_ALL_ORIGINS=true, allow any origin (cors will echo request origin).
    origin: ALLOW_ALL_ORIGINS ? true : CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
}));

// Enable preflight for all routes
app.options('*', cors());
// Support JSON requests with increased limit for larger payloads
app.use(express.json({ limit: '50mb' }));
// Support URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ MongoDB connected to', mongoUri.startsWith('mongodb+srv:') ? 'Atlas (srv)' : mongoUri);
}).catch(err => {
    console.error('❌ MongoDB connection error:', err && err.message ? err.message : err);
    console.error('Please check your MongoDB connection string in .env file');
    console.error('For local development, you can use: mongodb://localhost:27017/roomfinder');
    // Exit process if DB connection fails to avoid running without DB
    process.exit(1);
});

// Basic route
app.get('/', (req, res) => {
    res.send('Room Finder API is running');
});

// Serve client static build if present (moved into parent `client/build`)
const path = require('path');
const clientBuildPath = path.resolve(__dirname, '..', 'client', 'build');
const fs = require('fs');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    // Only serve the client index for non-API and non-admin routes. This
    // prevents the client catch-all from intercepting API requests.
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}

// Serve admin static build at /admin if present (serve files under /admin and send index for admin routes)
const adminBuildPath = path.resolve(__dirname, '..', 'admin', 'build');
if (fs.existsSync(adminBuildPath)) {
    // Serve admin static assets under the /admin path
    app.use('/admin', express.static(adminBuildPath));
    // For any /admin/* route, return the admin index.html so the SPA can handle routing
    app.get('/admin/*', (req, res, next) => {
        // Allow API routes under /api to be handled by API handlers
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(adminBuildPath, 'index.html'));
    });
}

// Room routes
app.use('/api/rooms', require('./routes/rooms'));

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Booking routes
app.use('/api/bookings', require('./routes/bookings'));

// Mount admin routes (to be created)
app.use('/api/admin', require('./routes/admin'));

// Search routes
app.use('/api/search', require('./routes/search'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    serverInfo: {
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    }
  });
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(5000, HOST, () => {
    console.log(`🚀 Server listening on http://${HOST}:5000`);
    console.log(`   CORS origin: ${ALLOW_ALL_ORIGINS ? 'ALL (ALLOW_ALL_ORIGINS=true)' : CLIENT_URL}`);
});

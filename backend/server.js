const path = require('path');
const fs = require('fs');
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
require('./models/Notification');

const app = express();
// If running behind a reverse proxy (nginx, cloud load balancer, or CRA dev-proxy),
// Express needs to trust the proxy to respect X-Forwarded-* headers. This
// allows express-rate-limit to properly identify client IPs when X-Forwarded-For
// is present and avoids the ERR_ERL_UNEXPECTED_X_FORWARDED_FOR validation error.
// Use `1` in many hosting environments where a single proxy is used. Change to
// `true` or a custom value in more complex deployments.
app.set('trust proxy', 1);
// Bind the backend explicitly to port 5000 for local development per request.
const PORT = process.env.PORT || 5000;

// Configure CORS origin. Set ALLOW_ALL_ORIGINS=true to allow all origins (useful for quick testing).
// Default client URL remains localhost:3000 for CRA dev server.
const CLIENT_URL = process.env.CLIENT_URL || process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000';
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === 'true';

app.use(cors({
    // When ALLOW_ALL_ORIGINS=true, allow any origin (cors will echo request origin).
    // Otherwise, use CLIENT_URL. Explicitly check for localhost:3000 as well.
    origin: (origin, callback) => {
        if (ALLOW_ALL_ORIGINS || !origin || origin === CLIENT_URL || origin.includes('localhost:3000')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
    resave: false,
    saveUninitialized: false,
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
const clientBuildPath = path.resolve(__dirname, '..', 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    // Only serve the client index for non-API and non-admin routes. This
    // prevents the client catch-all from intercepting API requests.
    const clientIndex = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(clientIndex)) {
        app.get('*', (req, res, next) => {
            if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
            res.sendFile(clientIndex);
        });
    } else {
        console.warn(`Warning: client build found at ${clientBuildPath} but index.html is missing. Skipping SPA catch-all.`);
    }
}

// Serve admin static build at /admin if present (serve files under /admin and send index for admin routes)
const adminBuildPath = path.resolve(__dirname, '..', 'admin', 'build');
if (fs.existsSync(adminBuildPath)) {
    // Serve admin static assets under the /admin path
    app.use('/admin', express.static(adminBuildPath));
    // For any /admin/* route, return the admin index.html so the SPA can handle routing
    const adminIndex = path.join(adminBuildPath, 'index.html');
    if (fs.existsSync(adminIndex)) {
        app.get('/admin/*', (req, res, next) => {
            // Allow API routes under /api to be handled by API handlers
            if (req.path.startsWith('/api')) return next();
            res.sendFile(adminIndex);
        });
    } else {
        console.warn(`Warning: admin build found at ${adminBuildPath} but index.html is missing. Skipping admin SPA catch-all.`);
    }
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

// Notification routes
app.use('/api/notifications', require('./routes/notifications'));

// eSewa routes
app.use('/api/esewa', require('./routes/esewaRoutes'));

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

// AdminSettings and maintenance mode removed

// Debug-only test route to create a room without auth. ONLY enabled outside production.
if (process.env.NODE_ENV !== 'production') {
    const Room = require('./models/Room');
    // Local redaction helper (keeps logs safe)
    function redact(src) {
        if (!src || typeof src !== 'object') return src;
        const copy = { ...src };
        if (copy.contactInfo) copy.contactInfo = { name: copy.contactInfo.name ? '[REDACTED_NAME]' : undefined, phone: copy.contactInfo.phone ? '[REDACTED_PHONE]' : undefined, email: copy.contactInfo.email ? '[REDACTED_EMAIL]' : undefined };    // Redact obvious sensitive scalar fields
        if (copy.description && typeof copy.description === 'string') copy.description = `<${copy.description.length} chars>`;
        return copy;
    }

    app.post('/api/debug/create-room-test', express.json(), async (req, res) => {
        try {
            try { console.log('[debug] create-room-test keys =', Object.keys(req.body || {})); } catch (e) { }
            try { console.log('[debug] create-room-test (redacted) =', JSON.stringify(redact(req.body))); } catch (e) { }
            const room = new Room({ ...req.body, user: req.body.user || null, status: req.body.status || 'pending' });
            await room.save();
            res.status(201).json(room);
        } catch (err) {
            console.error('[debug] create-room-test error', err && err.message);
            res.status(400).json({ error: err && err.message });
        }
    });
}

// SDPVA: Background Scheduler for Expired Reservations
setInterval(async () => {
    try {
        const now = new Date();
        const Booking = require('./models/Booking'); // Ensure model is loaded

        // Find pending bookings that have expired
        const expiredBookings = await Booking.find({
            status: 'pending',
            expireAt: { $lt: now }
        });

        if (expiredBookings.length > 0) {
            console.log(`[Scheduler] Found ${expiredBookings.length} expired bookings. Cleaning up...`);

            for (const booking of expiredBookings) {
                booking.status = 'cancelled'; // or 'expired'
                await booking.save();
                console.log(`[Scheduler] Cancelled booking ${booking._id}`);
                // Note: room.isBooked is usually set on confirmation, so no need to revert it here
                // unless we blocked it on pending.
            }
        }
    } catch (err) {
        console.error('[Scheduler] Error cleaning up bookings:', err);
    }
}, 60 * 1000); // Check every minute

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
    console.log(`   CORS origin: ${ALLOW_ALL_ORIGINS ? 'ALL (ALLOW_ALL_ORIGINS=true)' : CLIENT_URL}`);
});

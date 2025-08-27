const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import the MongoDB models to make sure they are registered
require('./models/User');
require('./models/Room');
require('./models/Booking');
require('./models/Review');
// AdminSettings removed

const app = express();
// Close the server after checking
setTimeout(() => {
  process.exit(0);
}, 2000);

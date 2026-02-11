require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function main() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/roomfinder';
  console.log('Connecting to', MONGO_URI);
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Load the model after connection
  const User = require('../models/User');

  const email = process.env.INITIAL_ADMIN_EMAIL || 'saudeepadmin@gmail.com';
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'sajilostay12';
  const phone = process.env.INITIAL_ADMIN_PHONE || '0000000000';

  try {
    const hash = await bcrypt.hash(password, 10);
    let user = await User.findOne({ email });
    if (user) {
      user.isAdmin = true;
      user.password = hash;
      user.phone = user.phone || phone;
      await user.save();
      console.log('Updated existing user to admin:', email);
    } else {
      user = await User.create({ email, password: hash, phone, isAdmin: true });
      console.log('Created new admin user:', email);
    }
  } catch (err) {
    console.error('Error creating admin user:', err && err.stack ? err.stack : err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }

  console.log('Done. You can now login as admin with the provided credentials.');
}

main();

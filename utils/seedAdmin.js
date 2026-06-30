// utils/seedAdmin.js
//
// Run this once to create your first admin account:
//   node utils/seedAdmin.js admin@inamigosfoundation.org.in YourStrongPassword123
//
// If the email already exists as a regular user, it will be promoted to admin.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const env = require('../config/env');

async function run() {
  const [, , email, password] = process.argv;

  if (!email || !password) {
    console.error('Usage: node utils/seedAdmin.js <email> <password>');
    process.exit(1);
  }

  await mongoose.connect(env.MONGO_URI);

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    user.role = 'admin';
    await user.save();
    console.log(`✅ Existing user ${email} promoted to admin.`);
  } else {
    const hashed = await bcrypt.hash(password, 12);
    user = await User.create({
      firstName: 'Admin',
      lastName: '',
      email: email.toLowerCase(),
      password: hashed,
      role: 'admin'
    });
    console.log(`✅ Admin account created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Failed to seed admin:', err.message);
  process.exit(1);
});

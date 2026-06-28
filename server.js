// ════════════════════════════════════════════
//  InAmigos Foundation — server.js
// ════════════════════════════════════════════
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── STATIC FILES ──────────────────────────
// Serve your HTML/CSS/JS directly from root
app.use(express.static(path.join(__dirname)));

// ── API ROUTES ────────────────────────────
app.use('/api/auth', authRoutes);

// ── VOLUNTEER FORM (simple email forward) ─
// If you don't want the full auth system yet,
// you can capture volunteer form data here:
app.post('/api/volunteer', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, project, message } = req.body;
    // TODO: Save to DB or send email
    // For now, just log it
    console.log('New volunteer application:', { firstName, lastName, email, project });
    res.json({ success: true, message: 'Application received!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── MONGODB CONNECTION ─────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inamigos')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📂 Serving website from: ${__dirname}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    // Start server anyway for static file serving
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT} (no DB)`);
    });
  });

module.exports = app;

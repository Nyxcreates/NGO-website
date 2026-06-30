// routes/admin.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const {
  listDonations,
  listVolunteers,
  listContacts,
  summary,
  updateDonationStatus
} = require('../controllers/adminController');

// All admin routes require a valid JWT + admin role
router.use(requireAuth, requireAdmin);

router.get('/summary', summary);
router.get('/donations', listDonations);
router.get('/volunteers', listVolunteers);
router.get('/contacts', listContacts);
router.patch('/donations/:id/status', updateDonationStatus);

module.exports = router;

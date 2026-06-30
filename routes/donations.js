// routes/donations.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const { createDonation, getAllDonations, getDonationReceipt } = require('../controllers/donationController');

const donationValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('phone').trim().matches(/^[6-9]\d{9}$|^\+?\d{10,14}$/).withMessage('Enter a valid phone number.'),
  body('amount').isFloat({ min: 1 }).withMessage('Donation amount must be at least ₹1.'),
  body('paymentMethod').isIn(['UPI', 'Bank Transfer', 'Card', 'Cash', 'Other']).withMessage('Select a valid payment method.'),
  body('transactionId').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('purpose').optional({ checkFalsy: true }).trim()
];

// Public — submit a donation
router.post('/', donationValidation, validate, createDonation);

// Public — fetch a single donation to render/download a receipt
router.get('/:id/receipt', getDonationReceipt);

// Admin only — list all donations
router.get('/', requireAuth, requireAdmin, getAllDonations);

module.exports = router;

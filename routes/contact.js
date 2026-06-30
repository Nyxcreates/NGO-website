// routes/contact.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const { createContact, getAllContacts } = require('../controllers/contactController');

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('subject').trim().notEmpty().withMessage('Subject is required.'),
  body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters.')
];

// Public — submit contact form
router.post('/', contactValidation, validate, createContact);

// Admin only — list all messages
router.get('/', requireAuth, requireAdmin, getAllContacts);

module.exports = router;

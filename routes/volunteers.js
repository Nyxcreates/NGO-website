// routes/volunteers.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const { createVolunteer, getAllVolunteers } = require('../controllers/volunteerController');

const volunteerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('phone').trim().matches(/^[6-9]\d{9}$|^\+?\d{10,14}$/).withMessage('Enter a valid phone number.'),
  body('skills').trim().notEmpty().withMessage('Please tell us your skills.'),
  body('availability').trim().notEmpty().withMessage('Please tell us your availability.'),
  body('college').optional({ checkFalsy: true }).trim(),
  body('city').optional({ checkFalsy: true }).trim(),
  body('project').optional({ checkFalsy: true }).trim(),
  body('message').optional({ checkFalsy: true }).trim()
];

// Public — submit volunteer application
router.post('/', volunteerValidation, validate, createVolunteer);

// Admin only — list all volunteers
router.get('/', requireAuth, requireAdmin, getAllVolunteers);

module.exports = router;

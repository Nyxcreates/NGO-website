// routes/auth.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { register, login, getMe } = require('../controllers/authController');

const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('phone').optional({ checkFalsy: true }).trim(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/\d/).withMessage('Password must contain at least one number.')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', requireAuth, getMe);

module.exports = router;

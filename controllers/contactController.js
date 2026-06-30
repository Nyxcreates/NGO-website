// controllers/contactController.js
const Contact = require('../models/Contact');
const { sendMail } = require('../config/mailer');
const { ngoContactAlertEmail } = require('../utils/emailTemplates');
const env = require('../config/env');

// POST /api/contact
async function createContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({ name, email, subject, message });

    const ngoEmail = ngoContactAlertEmail(contact);
    await sendMail({ to: env.NGO_EMAIL, subject: ngoEmail.subject, html: ngoEmail.html, text: ngoEmail.text });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent. We\'ll get back to you soon.',
      contact
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/contact  (admin only)
async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    next(err);
  }
}

module.exports = { createContact, getAllContacts };

// controllers/volunteerController.js
const Volunteer = require('../models/Volunteer');
const { sendMail } = require('../config/mailer');
const { volunteerConfirmationEmail, ngoVolunteerAlertEmail } = require('../utils/emailTemplates');
const env = require('../config/env');

// POST /api/volunteers
async function createVolunteer(req, res, next) {
  try {
    const { name, email, phone, college, skills, availability, city, project, message } = req.body;

    const volunteer = await Volunteer.create({
      name, email, phone, college, skills, availability, city, project, message
    });

    const volunteerEmail = volunteerConfirmationEmail(volunteer);
    const ngoEmail = ngoVolunteerAlertEmail(volunteer);

    await Promise.allSettled([
      sendMail({ to: volunteer.email, subject: volunteerEmail.subject, html: volunteerEmail.html, text: volunteerEmail.text }),
      sendMail({ to: env.NGO_EMAIL, subject: ngoEmail.subject, html: ngoEmail.html, text: ngoEmail.text })
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted! We\'ll be in touch soon.',
      volunteer
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/volunteers  (admin only)
async function getAllVolunteers(req, res, next) {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: volunteers.length, volunteers });
  } catch (err) {
    next(err);
  }
}

module.exports = { createVolunteer, getAllVolunteers };

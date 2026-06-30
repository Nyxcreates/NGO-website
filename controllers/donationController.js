// controllers/donationController.js
const Donation = require('../models/Donation');
const { sendMail } = require('../config/mailer');
const { donorReceiptEmail, ngoDonationAlertEmail } = require('../utils/emailTemplates');
const env = require('../config/env');

// POST /api/donations
async function createDonation(req, res, next) {
  try {
    const { fullName, email, phone, amount, paymentMethod, transactionId, purpose } = req.body;

    const donation = await Donation.create({
      fullName,
      email,
      phone,
      amount,
      paymentMethod,
      transactionId,
      purpose
    });

    // Fire both emails. We don't await sequentially-block the response on email
    // failures — but we do await them so the deploy logs show outcome clearly.
    const donorEmail = donorReceiptEmail(donation);
    const ngoEmail = ngoDonationAlertEmail(donation);

    await Promise.allSettled([
      sendMail({ to: donation.email, subject: donorEmail.subject, html: donorEmail.html, text: donorEmail.text }),
      sendMail({ to: env.NGO_EMAIL, subject: ngoEmail.subject, html: ngoEmail.html, text: ngoEmail.text })
    ]);

    res.status(201).json({
      success: true,
      message: 'Thank you for supporting InAmigos Foundation. Your donation request has been received successfully.',
      donation
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/donations  (admin only)
async function getAllDonations(req, res, next) {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, donations });
  } catch (err) {
    next(err);
  }
}

// GET /api/donations/:id/receipt  (used by "download receipt" button)
async function getDonationReceipt(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }
    res.json({ success: true, donation });
  } catch (err) {
    next(err);
  }
}

module.exports = { createDonation, getAllDonations, getDonationReceipt };

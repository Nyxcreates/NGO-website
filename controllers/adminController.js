// controllers/adminController.js
const Donation = require('../models/Donation');
const Volunteer = require('../models/Volunteer');
const Contact = require('../models/Contact');

// GET /api/admin/donations — newest first
async function listDonations(req, res, next) {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, donations });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/volunteers — newest first
async function listVolunteers(req, res, next) {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: volunteers.length, volunteers });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/contacts — newest first
async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/summary — quick dashboard counts
async function summary(req, res, next) {
  try {
    const [donationCount, volunteerCount, contactCount, totalRaisedAgg] = await Promise.all([
      Donation.countDocuments(),
      Volunteer.countDocuments(),
      Contact.countDocuments(),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
    ]);

    res.json({
      success: true,
      summary: {
        totalDonations: donationCount,
        totalVolunteers: volunteerCount,
        totalContacts: contactCount,
        totalAmountRaised: totalRaisedAgg[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/donations/:id/status — verify/reject a donation
async function updateDonationStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }
    res.json({ success: true, donation });
  } catch (err) {
    next(err);
  }
}

module.exports = { listDonations, listVolunteers, listContacts, summary, updateDonationStatus };

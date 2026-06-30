// utils/emailTemplates.js
// Simple, inline-styled HTML emails (safe for most email clients).

function baseWrapper(title, bodyHtml) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif; background:#FAFAF7; padding:32px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #E5E5E0;">
      <div style="background:#0D1B2A; padding:24px 32px;">
        <span style="font-size:1.2rem; font-weight:700; color:#fff; font-family:Georgia,serif;">
          InAmigos <em style="color:#F4831F; font-style:italic;">Foundation</em>
        </span>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#1A1A2E; margin:0 0 16px; font-family:Georgia,serif;">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="background:#F3F2EF; padding:16px 32px; font-size:0.78rem; color:#6B7280; text-align:center;">
        InAmigos Foundation · Bilaspur, Chhattisgarh 495555<br/>
        support@inamigosfoundation.org.in
      </div>
    </div>
  </div>`;
}

const donorReceiptEmail = (donation) => ({
  subject: 'Thank You for Supporting InAmigos Foundation ❤️',
  html: baseWrapper('Thank You for Supporting InAmigos Foundation ❤️', `
    <p style="color:#374151; line-height:1.6;">Dear ${donation.fullName},</p>
    <p style="color:#374151; line-height:1.6;">Thank you for your generous support.</p>
    <p style="color:#374151; line-height:1.6;">We have received your donation details. Our team will verify the payment shortly.</p>
    <table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:0.9rem;">
      <tr><td style="padding:8px 0; color:#6B7280;">Amount</td><td style="padding:8px 0; text-align:right; font-weight:700; color:#1A1A2E;">₹${donation.amount}</td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Payment Method</td><td style="padding:8px 0; text-align:right; color:#1A1A2E;">${donation.paymentMethod}</td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Transaction ID</td><td style="padding:8px 0; text-align:right; color:#1A1A2E;">${donation.transactionId || 'N/A'}</td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Reference No.</td><td style="padding:8px 0; text-align:right; color:#1A1A2E;">${donation._id}</td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Date</td><td style="padding:8px 0; text-align:right; color:#1A1A2E;">${new Date(donation.createdAt).toLocaleString('en-IN')}</td></tr>
    </table>
    <p style="color:#374151; line-height:1.6;">Your support helps us continue creating positive social impact.</p>
    <p style="color:#374151; line-height:1.6;">Regards,<br/><strong>InAmigos Foundation</strong></p>
  `),
  text: `Dear ${donation.fullName},\n\nThank you for your generous support.\n\nWe have received your donation details. Our team will verify the payment shortly.\n\nAmount: ₹${donation.amount}\nPayment Method: ${donation.paymentMethod}\nTransaction ID: ${donation.transactionId || 'N/A'}\n\nYour support helps us continue creating positive social impact.\n\nRegards,\nInAmigos Foundation`
});

const ngoDonationAlertEmail = (donation) => ({
  subject: `💰 New Donation Submitted — ₹${donation.amount}`,
  html: baseWrapper('New Donation Received', `
    <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
      <tr><td style="padding:6px 0; color:#6B7280;">Name</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${donation.fullName}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Email</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${donation.email}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Phone</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${donation.phone}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Amount</td><td style="padding:6px 0; text-align:right; font-weight:700; color:#1A1A2E;">₹${donation.amount}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Payment Method</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${donation.paymentMethod}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Transaction ID</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${donation.transactionId || 'N/A'}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Status</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${donation.status}</td></tr>
    </table>
  `),
  text: `New donation submitted:\nName: ${donation.fullName}\nEmail: ${donation.email}\nPhone: ${donation.phone}\nAmount: ₹${donation.amount}\nPayment Method: ${donation.paymentMethod}\nTransaction ID: ${donation.transactionId || 'N/A'}`
});

const volunteerConfirmationEmail = (volunteer) => ({
  subject: 'Welcome to InAmigos Foundation — Application Received',
  html: baseWrapper('Application Received!', `
    <p style="color:#374151; line-height:1.6;">Dear ${volunteer.name},</p>
    <p style="color:#374151; line-height:1.6;">Thank you for applying to volunteer with InAmigos Foundation. We've received your application and our team will review it shortly.</p>
    <table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:0.9rem;">
      <tr><td style="padding:8px 0; color:#6B7280;">Skills</td><td style="padding:8px 0; text-align:right; color:#1A1A2E;">${volunteer.skills}</td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">Availability</td><td style="padding:8px 0; text-align:right; color:#1A1A2E;">${volunteer.availability}</td></tr>
      <tr><td style="padding:8px 0; color:#6B7280;">City</td><td style="padding:8px 0; text-align:right; color:#1A1A2E;">${volunteer.city}</td></tr>
    </table>
    <p style="color:#374151; line-height:1.6;">We typically respond within 2–3 working days.</p>
    <p style="color:#374151; line-height:1.6;">Regards,<br/><strong>InAmigos Foundation</strong></p>
  `),
  text: `Dear ${volunteer.name},\n\nThank you for applying to volunteer with InAmigos Foundation. We've received your application and will respond within 2-3 working days.\n\nRegards,\nInAmigos Foundation`
});

const ngoVolunteerAlertEmail = (volunteer) => ({
  subject: `🙋 New Volunteer Application — ${volunteer.name}`,
  html: baseWrapper('New Volunteer Application', `
    <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
      <tr><td style="padding:6px 0; color:#6B7280;">Name</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${volunteer.name}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Email</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${volunteer.email}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Phone</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${volunteer.phone}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">College</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${volunteer.college || 'N/A'}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Skills</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${volunteer.skills}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Availability</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${volunteer.availability}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">City</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${volunteer.city}</td></tr>
    </table>
  `),
  text: `New volunteer application:\nName: ${volunteer.name}\nEmail: ${volunteer.email}\nPhone: ${volunteer.phone}\nCollege: ${volunteer.college || 'N/A'}\nSkills: ${volunteer.skills}\nAvailability: ${volunteer.availability}\nCity: ${volunteer.city}`
});

const ngoContactAlertEmail = (contact) => ({
  subject: `📩 New Contact Message — ${contact.subject}`,
  html: baseWrapper('New Contact Form Submission', `
    <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
      <tr><td style="padding:6px 0; color:#6B7280;">Name</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${contact.name}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Email</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${contact.email}</td></tr>
      <tr><td style="padding:6px 0; color:#6B7280;">Subject</td><td style="padding:6px 0; text-align:right; color:#1A1A2E;">${contact.subject}</td></tr>
    </table>
    <p style="color:#6B7280; margin-top:16px;">Message:</p>
    <p style="color:#1A1A2E; background:#F3F2EF; padding:16px; border-radius:8px;">${contact.message}</p>
  `),
  text: `New contact message:\nName: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\nMessage: ${contact.message}`
});

module.exports = {
  donorReceiptEmail,
  ngoDonationAlertEmail,
  volunteerConfirmationEmail,
  ngoVolunteerAlertEmail,
  ngoContactAlertEmail
};

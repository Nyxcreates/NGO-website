// config/mailer.js
const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('⚠️  SMTP not fully configured — emails will be logged, not sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  return transporter;
}

/**
 * Sends an email. Falls back to console logging if SMTP isn't configured,
 * so the app never crashes in dev/demo environments without email creds.
 */
async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();

  if (!t) {
    console.log('📧 [DEV MODE — email not sent, SMTP not configured]');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', text || html);
    return { simulated: true };
  }

  try {
    const info = await t.sendMail({
      from: `"InAmigos Foundation" <${env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text
    });
    return info;
  } catch (err) {
    // Email failures should never crash the request — just log them.
    console.error('❌ Email send failed:', err.message);
    return { error: err.message };
  }
}

module.exports = { sendMail };

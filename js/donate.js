/* ════════════════════════════════════════
   InAmigos Foundation — donate.js
   Handles: dynamic UPI link, validation,
   submission, success modal, receipt download
   ════════════════════════════════════════ */

(function () {
  let upiConfig = { upiId: 'inamigosfoundation@upi', payeeName: 'InAmigos Foundation' };
  let lastDonationId = null;
  let lastDonationData = null;

  // ── FETCH UPI CONFIG FROM SERVER ────────
  async function loadUpiConfig() {
    try {
      const res = await fetch('/api/config/upi');
      if (res.ok) {
        upiConfig = await res.json();
      }
    } catch {
      // Falls back to default upiConfig above — page still works offline/in dev.
    }
    updateUpiLink();
  }

  function getSelectedAmount() {
    const custom = document.getElementById('customAmount');
    return custom ? custom.value : '';
  }

  function updateUpiLink() {
    const btn = document.getElementById('upiPayBtn');
    if (!btn) return;
    const amount = getSelectedAmount();
    const params = new URLSearchParams({
      pa: upiConfig.upiId,
      pn: upiConfig.payeeName,
      tn: 'Donation to InAmigos Foundation',
      cu: 'INR'
    });
    if (amount) params.set('am', amount);
    btn.href = `upi://pay?${params.toString()}`;
  }

  // Update the UPI link whenever the amount changes
  document.addEventListener('DOMContentLoaded', () => {
    loadUpiConfig();
    document.getElementById('customAmount')?.addEventListener('input', updateUpiLink);
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.addEventListener('click', () => setTimeout(updateUpiLink, 0));
    });
  });

  // ── VALIDATION HELPERS ──────────────────
  function showFieldError(input, message) {
    clearFieldError(input);
    input.classList.add('input-invalid');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = message;
    err.dataset.errorFor = input.id;
    input.parentElement.appendChild(err);
  }

  function clearFieldError(input) {
    input.classList.remove('input-invalid');
    const existing = input.parentElement.querySelector(`.field-error[data-error-for="${input.id}"]`);
    if (existing) existing.remove();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13;
  }

  function validateDonationForm() {
    const nameEl = document.getElementById('donateName');
    const emailEl = document.getElementById('donateEmail');
    const phoneEl = document.getElementById('donatePhone');
    const amountEl = document.getElementById('customAmount');
    const errorBox = document.getElementById('donateError');

    [nameEl, emailEl, phoneEl, amountEl].forEach(clearFieldError);
    errorBox.style.display = 'none';

    let firstError = null;

    if (!nameEl.value.trim()) {
      showFieldError(nameEl, 'Please enter your name.');
      firstError = firstError || nameEl;
    }
    if (!emailEl.value.trim() || !isValidEmail(emailEl.value.trim())) {
      showFieldError(emailEl, 'Please enter a valid email address.');
      firstError = firstError || emailEl;
    }
    if (!phoneEl.value.trim() || !isValidPhone(phoneEl.value.trim())) {
      showFieldError(phoneEl, 'Please enter a valid phone number.');
      firstError = firstError || phoneEl;
    }
    const amount = parseFloat(amountEl.value);
    if (!amount || amount < 1) {
      showFieldError(amountEl, 'Please enter a donation amount of at least ₹1.');
      firstError = firstError || amountEl;
    }

    if (firstError) {
      errorBox.textContent = 'Please fix the highlighted fields before submitting.';
      errorBox.style.display = 'block';
      firstError.focus();
      return null;
    }

    return {
      fullName: nameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim(),
      amount,
      paymentMethod: 'UPI',
      transactionId: document.getElementById('transactionId')?.value.trim() || '',
      purpose: document.getElementById('donatePurpose')?.value || 'general'
    };
  }

  // ── SUBMIT DONATION ──────────────────────
  async function submitDonation() {
    const payload = validateDonationForm();
    if (!payload) return;

    const btn = document.getElementById('submitDonationBtn');
    btn.classList.add('btn-loading');
    btn.disabled = true;

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        lastDonationId = data.donation._id;
        lastDonationData = data.donation;
        showDonationModal(data.donation);
        resetDonationForm();
      } else {
        const errorBox = document.getElementById('donateError');
        errorBox.textContent = data.message || 'Something went wrong. Please try again.';
        errorBox.style.display = 'block';
      }
    } catch (err) {
      const errorBox = document.getElementById('donateError');
      errorBox.textContent = 'Unable to connect to the server. Please check your connection and try again.';
      errorBox.style.display = 'block';
    } finally {
      btn.classList.remove('btn-loading');
      btn.disabled = false;
    }
  }

  function resetDonationForm() {
    document.getElementById('donateName').value = '';
    document.getElementById('donateEmail').value = '';
    document.getElementById('donatePhone').value = '';
    document.getElementById('transactionId').value = '';
  }

  // ── SUCCESS MODAL ────────────────────────
  function showDonationModal(donation) {
    const overlay = document.getElementById('donationModalOverlay');
    const receiptIdEl = document.getElementById('modalReceiptId');
    receiptIdEl.textContent = `Reference ID: ${donation._id}`;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDonationModal() {
    const overlay = document.getElementById('donationModalOverlay');
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── DOWNLOAD RECEIPT (simple text/HTML receipt, client-side) ──
  function downloadReceipt() {
    if (!lastDonationData) return;
    const d = lastDonationData;
    const receiptHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Donation Receipt — InAmigos Foundation</title>
<style>
  body { font-family: Georgia, serif; padding: 40px; color: #1A1A2E; }
  .header { border-bottom: 3px solid #F4831F; padding-bottom: 16px; margin-bottom: 24px; }
  .header h1 { font-size: 1.4rem; margin: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  td { padding: 10px 0; border-bottom: 1px solid #E5E5E0; }
  td:first-child { color: #6B7280; }
  td:last-child { text-align: right; font-weight: 600; }
  .footer { margin-top: 40px; font-size: 0.85rem; color: #6B7280; }
</style>
</head>
<body>
  <div class="header"><h1>InAmigos Foundation — Donation Receipt</h1></div>
  <table>
    <tr><td>Reference ID</td><td>${d._id}</td></tr>
    <tr><td>Donor Name</td><td>${d.fullName}</td></tr>
    <tr><td>Email</td><td>${d.email}</td></tr>
    <tr><td>Phone</td><td>${d.phone}</td></tr>
    <tr><td>Amount</td><td>₹${d.amount}</td></tr>
    <tr><td>Payment Method</td><td>${d.paymentMethod}</td></tr>
    <tr><td>Transaction ID</td><td>${d.transactionId || 'N/A'}</td></tr>
    <tr><td>Status</td><td>${d.status}</td></tr>
    <tr><td>Date</td><td>${new Date(d.createdAt || Date.now()).toLocaleString('en-IN')}</td></tr>
  </table>
  <p class="footer">This is a provisional receipt. Your 80G tax certificate will be emailed separately once payment is verified.<br/>InAmigos Foundation · Bilaspur, Chhattisgarh 495555</p>
</body>
</html>`;
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InAmigos-Donation-Receipt-${d._id}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ── EVENT BINDINGS ───────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitDonationBtn')?.addEventListener('click', submitDonation);
    document.getElementById('closeDonationModal')?.addEventListener('click', closeDonationModal);
    document.getElementById('downloadReceiptBtn')?.addEventListener('click', downloadReceipt);
    document.getElementById('donationModalOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'donationModalOverlay') closeDonationModal();
    });
  });
})();

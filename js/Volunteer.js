/* ════════════════════════════════════════
   InAmigos Foundation — volunteer.js
   Handles real submission to /api/volunteers
   ════════════════════════════════════════ */

(function () {
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13;
  }

  function showError(msg) {
    const box = document.getElementById('volunteerError');
    if (!box) return;
    box.textContent = msg;
    box.style.display = 'block';
  }

  function clearError() {
    const box = document.getElementById('volunteerError');
    if (box) box.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('volunteerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();

      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const college = document.getElementById('college').value.trim();
      const availability = document.getElementById('availability').value;
      const city = document.getElementById('city').value.trim();
      const project = document.getElementById('project').value;
      const skills = document.getElementById('skills').value.trim();
      const message = document.getElementById('message').value.trim();

      // ── Client-side validation ──
      if (!firstName) return showError('Please enter your first name.');
      if (!isValidEmail(email)) return showError('Please enter a valid email address.');
      if (!isValidPhone(phone)) return showError('Please enter a valid phone number.');
      if (!skills) return showError('Please tell us your skills.');
      if (!availability) return showError('Please select your availability.');

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.classList.add('btn-loading');
      btn.disabled = true;

      try {
        const res = await fetch('/api/volunteers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email,
            phone,
            college,
            skills,
            availability,
            city,
            project,
            message
          })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          const successEl = document.getElementById('formSuccess');
          if (successEl) {
            form.style.display = 'none';
            successEl.style.display = 'block';
          }
          if (typeof showToast === 'function') {
            showToast('Application submitted! We\'ll be in touch soon. 🎉');
          }
        } else {
          showError(data.message || 'Something went wrong. Please try again.');
          btn.classList.remove('btn-loading');
          btn.disabled = false;
        }
      } catch (err) {
        showError('Unable to connect to the server. Please check your connection and try again.');
        btn.classList.remove('btn-loading');
        btn.disabled = false;
      }
    });
  });
})();

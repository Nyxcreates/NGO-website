/* ════════════════════════════════════════
   InAmigos Foundation — script.js
   ════════════════════════════════════════ */

// ── NAV SCROLL EFFECT ────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── MOBILE NAV ───────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function openMobile() {
  mobileNav?.classList.add('open');
  mobileOverlay?.classList.add('show');
  mobileNav?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobile() {
  mobileNav?.classList.remove('open');
  mobileOverlay?.classList.remove('show');
  mobileNav?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobile);
mobileClose?.addEventListener('click', closeMobile);

// ── SCROLL REVEAL ────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling reveals
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION ────────────────────
function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 0) + 'K';
  return n.toString();
}

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // ease out quart
    const value = Math.round(ease * target);
    el.textContent = formatNum(value);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.i-num[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

counterEls.forEach(el => counterObserver.observe(el));

// ── SMOOTH SCROLL FOR ANCHOR LINKS ───────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── TOAST NOTIFICATION ───────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── VOLUNTEER FORM ───────────────────────
const volForm = document.getElementById('volunteerForm');
if (volForm) {
  volForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = volForm.querySelector('button[type="submit"]');
    btn.textContent = 'Submitting…';
    btn.disabled = true;

    // Simulate async submission (replace with real API call / Formspree)
    await new Promise(r => setTimeout(r, 1200));

    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      volForm.style.display = 'none';
      successEl.style.display = 'block';
    }
    showToast('Application submitted! We\'ll be in touch soon. 🎉');
  });
}

// ── DONATE AMOUNT BUTTONS ────────────────
const amountBtns = document.querySelectorAll('.amount-btn');
const customInput = document.getElementById('customAmount');

amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (customInput) customInput.value = btn.dataset.amount || '';
  });
});

// ── GALLERY FILTER ───────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item[data-cat]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;

    galleryItems.forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat;
      item.style.opacity = show ? '1' : '0';
      item.style.pointerEvents = show ? 'auto' : 'none';
      item.style.transform = show ? 'scale(1)' : 'scale(0.9)';
      item.style.transition = 'opacity 0.3s, transform 0.3s';
    });
  });
});

// ── COPY UPI ID ──────────────────────────
const copyUpiBtn = document.getElementById('copyUpi');
if (copyUpiBtn) {
  copyUpiBtn.addEventListener('click', () => {
    const upiId = copyUpiBtn.dataset.upi;
    navigator.clipboard.writeText(upiId).then(() => {
      showToast('UPI ID copied to clipboard! ✅');
    }).catch(() => {
      showToast('Please copy: ' + upiId, 'error');
    });
  });
}

// ── NAV ACTIVE LINK ──────────────────────
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-donate)');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith(currentPage)) {
    link.classList.add('active');
  }
});

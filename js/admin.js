/* ════════════════════════════════════════
   InAmigos Foundation — admin.js
   ════════════════════════════════════════ */

(function () {
  let token = localStorage.getItem('admin_token');
  let activeTab = 'donations';

  function authHeaders() {
    return { Authorization: `Bearer ${token}` };
  }

  async function login() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorBox = document.getElementById('adminLoginError');
    errorBox.style.display = 'none';

    if (!email || !password) {
      errorBox.textContent = 'Please enter email and password.';
      errorBox.style.display = 'block';
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        errorBox.textContent = data.message || 'Login failed.';
        errorBox.style.display = 'block';
        return;
      }

      if (data.user.role !== 'admin') {
        errorBox.textContent = 'This account does not have admin access.';
        errorBox.style.display = 'block';
        return;
      }

      token = data.token;
      localStorage.setItem('admin_token', token);
      showDashboard();
    } catch (err) {
      errorBox.textContent = 'Unable to connect to the server.';
      errorBox.style.display = 'block';
    }
  }

  function logout() {
    localStorage.removeItem('admin_token');
    token = null;
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLoginGate').style.display = 'block';
  }

  async function showDashboard() {
    document.getElementById('adminLoginGate').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    await loadSummary();
    await loadTab(activeTab);
  }

  async function loadSummary() {
    try {
      const res = await fetch('/api/admin/summary', { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return handleAuthFailure(res);

      const s = data.summary;
      document.getElementById('adminSummary').innerHTML = `
        <div class="admin-stat"><div class="num">₹${s.totalAmountRaised}</div><div class="lbl">Total Raised</div></div>
        <div class="admin-stat"><div class="num">${s.totalDonations}</div><div class="lbl">Donations</div></div>
        <div class="admin-stat"><div class="num">${s.totalVolunteers}</div><div class="lbl">Volunteers</div></div>
        <div class="admin-stat"><div class="num">${s.totalContacts}</div><div class="lbl">Messages</div></div>
      `;
    } catch {
      // Summary is non-critical — fail silently, tables still load.
    }
  }

  function statusPill(status) {
    return `<span class="status-pill status-${status}">${status}</span>`;
  }

  async function loadTab(tab) {
    activeTab = tab;
    const wrap = document.getElementById('adminTableWrap');
    wrap.innerHTML = '<p style="color:var(--muted); font-size:0.9rem;">Loading…</p>';

    try {
      const res = await fetch(`/api/admin/${tab}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return handleAuthFailure(res);

      if (tab === 'donations') renderDonations(data.donations);
      if (tab === 'volunteers') renderVolunteers(data.volunteers);
      if (tab === 'contacts') renderContacts(data.contacts);
    } catch {
      wrap.innerHTML = '<p style="color:var(--red); font-size:0.9rem;">Failed to load data.</p>';
    }
  }

  function renderDonations(rows) {
    const wrap = document.getElementById('adminTableWrap');
    if (!rows.length) return (wrap.innerHTML = '<p style="color:var(--muted);">No donations yet.</p>');
    wrap.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Amount</th><th>Method</th><th>Txn ID</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          ${rows.map(d => `
            <tr>
              <td>${d.fullName}</td>
              <td>${d.email}</td>
              <td>₹${d.amount}</td>
              <td>${d.paymentMethod}</td>
              <td>${d.transactionId || '—'}</td>
              <td>${statusPill(d.status)}</td>
              <td>${new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function renderVolunteers(rows) {
    const wrap = document.getElementById('adminTableWrap');
    if (!rows.length) return (wrap.innerHTML = '<p style="color:var(--muted);">No volunteers yet.</p>');
    wrap.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Skills</th><th>Availability</th><th>City</th><th>Date</th></tr></thead>
        <tbody>
          ${rows.map(v => `
            <tr>
              <td>${v.name}</td>
              <td>${v.email}</td>
              <td>${v.phone}</td>
              <td>${v.skills}</td>
              <td>${v.availability}</td>
              <td>${v.city || '—'}</td>
              <td>${new Date(v.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function renderContacts(rows) {
    const wrap = document.getElementById('adminTableWrap');
    if (!rows.length) return (wrap.innerHTML = '<p style="color:var(--muted);">No messages yet.</p>');
    wrap.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th></tr></thead>
        <tbody>
          ${rows.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.email}</td>
              <td>${c.subject}</td>
              <td>${c.message}</td>
              <td>${new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function handleAuthFailure(res) {
    if (res.status === 401 || res.status === 403) {
      logout();
    }
    document.getElementById('adminTableWrap').innerHTML = '<p style="color:var(--red);">Session expired or access denied.</p>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('adminLoginBtn')?.addEventListener('click', login);
    document.getElementById('adminLogoutBtn')?.addEventListener('click', logout);
    document.querySelectorAll('.admin-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        tabBtn.classList.add('active');
        loadTab(tabBtn.dataset.tab);
      });
    });

    if (token) showDashboard();
  });
})();

// ================================================
// ADVOCATE SAATHI — PROFILE SCREEN
// frontend/js/screens/profile.js
// ================================================

const ProfileScreen = (() => {

  function render() {
    return `
      <div class="screen" id="profile">
        ${renderStatusBar()}

        <div class="scroll-area" style="flex:1;padding-bottom:80px;">

          <!-- ── HERO CARD ────────────────────── -->
          <div style="position:relative;padding:24px 24px 0;">
            <div style="
              background:linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(5,13,26,0) 60%),var(--navy-mid);
              border:1px solid var(--navy-border);
              border-radius:20px;
              padding:24px;
              overflow:hidden;">

              <!-- Background decoration -->
              <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;border-radius:50%;background:rgba(245,158,11,0.06);pointer-events:none;"></div>
              <div style="position:absolute;top:20px;right:20px;width:60px;height:60px;border-radius:50%;background:rgba(245,158,11,0.05);pointer-events:none;"></div>

              <div style="display:flex;align-items:center;gap:16px;position:relative;">
                <!-- Avatar -->
                <div id="profile-avatar" style="
                  width:64px;height:64px;border-radius:50%;
                  background:linear-gradient(135deg,var(--gold),var(--gold-dim));
                  display:flex;align-items:center;justify-content:center;
                  font-weight:800;font-size:26px;color:var(--navy-deep);
                  box-shadow:0 4px 16px rgba(245,158,11,0.3);
                  flex-shrink:0;">U</div>

                <div style="flex:1;min-width:0;">
                  <div id="profile-name" style="font-weight:700;font-size:18px;color:var(--text-primary);margin-bottom:3px;">Loading…</div>
                  <div id="profile-email" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></div>
                  <span id="profile-plan" style="
                    font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;
                    background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.08));
                    color:var(--gold);border:1px solid rgba(245,158,11,0.4);
                    letter-spacing:0.05em;">FREE PLAN</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── STATS ROW ──────────────────────── -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px 24px 0;">
            <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:14px;padding:16px 10px;text-align:center;">
              <div id="stat-cases" style="font-size:26px;font-weight:800;color:var(--gold);line-height:1;">—</div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:5px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Cases</div>
            </div>
            <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:14px;padding:16px 10px;text-align:center;">
              <div id="stat-consultations" style="font-size:26px;font-weight:800;color:var(--gold);line-height:1;">—</div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:5px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Consults</div>
            </div>
            <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:14px;padding:16px 10px;text-align:center;">
              <div id="stat-notices" style="font-size:26px;font-weight:800;color:var(--gold);line-height:1;">—</div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:5px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">Notices</div>
            </div>
          </div>

          <!-- ── MY ACTIVITY ───────────────────── -->
          <div style="padding:20px 24px 0;">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">My Activity</div>
            <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:16px;overflow:hidden;">
              ${_menuRow('📋', 'My Cases', 'View all saved legal cases', "Router.navigate('history')")}
              ${_divider()}
              ${_menuRow('👨‍⚖️', 'My Consultations', 'View booked lawyer consultations', "Router.navigate('consultations')")}
              ${_divider()}
              ${_menuRow('✉️', 'My Legal Notices', 'View all drafted legal notices', "Toast.show('Coming soon')")}
              ${_divider()}
              ${_menuRow('🔔', 'Notifications', 'View alerts and reminders', "Router.navigate('notifications')")}
            </div>
          </div>

          <!-- ── ACCOUNT ────────────────────────── -->
          <div style="padding:16px 24px 0;">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">Account</div>
            <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:16px;overflow:hidden;">
              ${_menuRow('👤', 'Edit Profile', 'Update your name and phone number', "Toast.show('Coming soon')")}
              ${_divider()}
              ${_menuRow('🔒', 'Change Password', 'Update your account password', "Toast.show('Coming soon')")}
              ${_divider()}
              ${_menuRow('🌐', 'Language', 'English / Hindi', "Toast.show('Coming soon')")}
            </div>
          </div>

          <!-- ── LEGAL HELPLINES ────────────────── -->
          <div style="padding:16px 24px 0;">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">Emergency Helplines</div>
            <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:16px;padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              ${_helpline('🚔', 'Police', '100')}
              ${_helpline('🔥', 'Fire', '101')}
              ${_helpline('🚑', 'Ambulance', '102')}
              ${_helpline('💻', 'Cyber Crime', '1930')}
              ${_helpline('👩', "Women's Help", '181')}
              ${_helpline('⚖️', 'Legal Aid', '1516')}
            </div>
          </div>

          <!-- ── SUPPORT ─────────────────────────── -->
          <div style="padding:16px 24px 0;">
            <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:16px;overflow:hidden;">
              ${_menuRow('❓', 'How It Works', 'Learn about Advocate Saathi', "Toast.show('Coming soon')")}
              ${_divider()}
              ${_menuRow('⭐', 'Rate the App', 'Share your feedback with us', "Toast.show('Coming soon')")}
            </div>
          </div>

          <!-- ── SIGN OUT ──────────────────────── -->
          <div style="padding:20px 24px 0;">
            <button onclick="ProfileScreen.logout()" style="
              width:100%;padding:15px;
              background:rgba(224,92,92,0.08);
              border:1px solid rgba(224,92,92,0.25);
              border-radius:14px;
              font-family:var(--font-body);font-size:14px;font-weight:600;
              color:var(--danger);cursor:pointer;
              transition:background 0.2s;"
              onmouseover="this.style.background='rgba(224,92,92,0.15)'"
              onmouseout="this.style.background='rgba(224,92,92,0.08)'">
              Sign Out
            </button>
          </div>

          <!-- ── APP VERSION ───────────────────── -->
          <div style="text-align:center;padding:20px 0 8px;color:var(--text-muted);font-size:11px;">
            Advocate Saathi v1.0.0 · Made in India 🇮🇳
          </div>

        </div>

        ${renderNavBar('profile')}
      </div>`;
  }

  function _menuRow(icon, title, sub, action) {
    return `<div onclick="${action}" style="display:flex;align-items:center;gap:14px;padding:14px 16px;cursor:pointer;transition:background 0.15s;"
      onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='none'">
      <div style="width:36px;height:36px;border-radius:10px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:600;color:var(--text-primary);">${title}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${sub}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="color:var(--text-muted);flex-shrink:0;" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>`;
  }

  function _divider() {
    return `<div style="height:1px;background:var(--navy-border);margin:0 16px;"></div>`;
  }

  function _helpline(icon, label, number) {
    return `<div style="background:var(--navy-deep);border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:8px;">
      <span style="font-size:16px;">${icon}</span>
      <div>
        <div style="font-size:10px;color:var(--text-muted);">${label}</div>
        <div style="font-size:14px;font-weight:700;color:var(--gold);">${number}</div>
      </div>
    </div>`;
  }

  async function init() {
    const user = Storage.get('user') || {};

    const avatarEl = document.getElementById('profile-avatar');
    const nameEl   = document.getElementById('profile-name');
    const emailEl  = document.getElementById('profile-email');
    const planEl   = document.getElementById('profile-plan');

    if (user.name) {
      if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
      if (nameEl)   nameEl.textContent   = user.name;
    }
    if (emailEl && user.email) emailEl.textContent = user.email;
    if (planEl)                planEl.textContent  = user.plan === 'pro' ? '✦ PRO PLAN' : 'FREE PLAN';

    // Load stats from MongoDB
    try {
      const [statsRes, noticesRes, consultsRes] = await Promise.all([
        API.getCaseStats(),
        API.getNotices(),
        API.getConsultations(),
      ]);

      const stats = statsRes.stats || {};

      const caseEl    = document.getElementById('stat-cases');
      const noticeEl  = document.getElementById('stat-notices');
      const consultEl = document.getElementById('stat-consultations');

      if (caseEl)    caseEl.textContent    = stats.total !== undefined ? stats.total : 0;
      if (noticeEl)  noticeEl.textContent  = (noticesRes.notices  || []).length;
      if (consultEl) consultEl.textContent = (consultsRes.consultations || []).length;

    } catch (err) {
      console.warn('Profile stats failed:', err.message);
      ['stat-cases','stat-notices','stat-consultations'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '0';
      });
    }
  }

  function logout() {
    Storage.remove('session');
    Storage.remove('user');
    Router.navigate('auth');
    Toast.show('Signed out successfully');
  }

  return { render, init, logout };
})();

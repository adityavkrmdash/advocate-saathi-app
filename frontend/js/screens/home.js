// ================================================
// ADVOCATE SAATHI — HOME SCREEN
// frontend/js/screens/home.js
// ================================================

const HomeScreen = (() => {

  const categories = [
    { emoji: '⚖️', label: 'Labour Law',  bg: 'rgba(245,158,11,0.12)',  category: 'labour' },
    { emoji: '🚔', label: 'Criminal',    bg: 'rgba(239,68,68,0.12)',   category: 'criminal' },
    { emoji: '🛒', label: 'Consumer',    bg: 'rgba(16,185,129,0.12)',  category: 'consumer' },
    { emoji: '🏠', label: 'Property',    bg: 'rgba(99,102,241,0.12)',  category: 'property' },
    { emoji: '👨‍👩‍👧', label: 'Family Law', bg: 'rgba(236,72,153,0.12)',  category: 'family' },
    { emoji: '💻', label: 'Cyber Crime', bg: 'rgba(6,182,212,0.12)',   category: 'cyber' },
  ];

  const quickActions = [
    { emoji: '📋', title: 'File an FIR',    subtitle: 'Eligibility + step guide', action: "ChatScreen.openWithQuery('Help me understand how to file an FIR')" },
    { emoji: '✉️', title: 'Legal Notice',   subtitle: 'Draft & send',             action: "Router.navigate('legalnotice')" },
    { emoji: '🏛️', title: 'Consumer Forum', subtitle: 'File complaint',           action: "Router.navigate('consumerforum')" },
    { emoji: '💰', title: 'Salary Dispute', subtitle: 'Know your rights',          action: "ChatScreen.openCategory('labour')" },
  ];

  function render() {
    return `
      <div class="screen" id="home">
        ${renderStatusBar('live-time')}
        <div class="scroll-area" style="flex:1;">

          <div class="home-hero">
            <div class="home-greeting" id="home-greeting">Good morning,</div>
            <div class="home-name" id="home-username">User 👋</div>
            <div class="search-box" onclick="ChatScreen.openFresh()">
              <div class="search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div class="search-text">
                <span class="label">Describe your legal problem...</span>
                <span class="hint">e.g. My landlord is withholding my deposit</span>
              </div>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-card"><div class="stat-value" id="home-stat-cases">—</div><div class="stat-label">My Cases</div></div>
            <div class="stat-card"><div class="stat-value">12</div><div class="stat-label">Laws Covered</div></div>
            <div class="stat-card"><div class="stat-value">98%</div><div class="stat-label">Accuracy</div></div>
          </div>

          <div class="section-label">Legal Categories</div>
          <div class="categories-row">
            ${categories.map(c => `
              <div class="category-chip" onclick="ChatScreen.openCategory('${c.category}')">
                <div class="chip-icon" style="background:${c.bg}">${c.emoji}</div>
                <div class="chip-label">${c.label}</div>
              </div>`).join('')}
          </div>

          <div class="section-label">Quick Actions</div>
          <div class="quick-actions">
            ${quickActions.map(a => `
              <div class="qa-card" onclick="${a.action}">
                <div class="qa-icon">${a.emoji}</div>
                <div>
                  <div class="qa-title">${a.title}</div>
                  <div class="qa-subtitle">${a.subtitle}</div>
                </div>
              </div>`).join('')}
          </div>

          <div class="section-label">Recent Cases</div>
          <div id="home-recent-cases" style="padding:0 24px 20px;">
            <div style="text-align:center;padding:30px 0;color:var(--text-muted);font-size:13px;">Loading…</div>
          </div>

          <div style="height:20px;"></div>
        </div>
        ${renderNavBar('home')}
      </div>`;
  }

  const catMeta = {
    labour:   { icon:'⚖️', tag:'Labour Law' },
    criminal: { icon:'🚔', tag:'Criminal Law' },
    consumer: { icon:'🛒', tag:'Consumer Rights' },
    property: { icon:'🏠', tag:'Property Law' },
    family:   { icon:'👨‍👩‍👧', tag:'Family Law' },
    cyber:    { icon:'💻', tag:'Cyber Crime' },
    civil:    { icon:'📜', tag:'Civil Law' },
    other:    { icon:'⚖️', tag:'Legal' },
  };

  async function init() {
    // Greeting
    const user = Storage.get('user');
    const nameEl = document.getElementById('home-username');
    const greetEl = document.getElementById('home-greeting');
    if (nameEl && user && user.name) nameEl.textContent = user.name.split(' ')[0] + ' 👋';
    const hr = new Date().getHours();
    if (greetEl) greetEl.textContent = hr < 12 ? 'Good morning,' : hr < 17 ? 'Good afternoon,' : 'Good evening,';

    // Load real recent cases from MongoDB
    try {
      const data  = await API.getCases('limit=3');
      const cases = data.cases || [];

      const statEl = document.getElementById('home-stat-cases');
      if (statEl) statEl.textContent = data.total || 0;

      const recentEl = document.getElementById('home-recent-cases');
      if (!recentEl) return;

      if (cases.length === 0) {
        recentEl.innerHTML = `
          <div style="text-align:center;padding:30px 20px;color:var(--text-muted);">
            <div style="font-size:36px;margin-bottom:10px;">📂</div>
            <div style="font-size:13px;line-height:1.6;">No cases saved yet.<br>Describe a problem in chat and tap <strong style="color:var(--gold)">Save This Case</strong>.</div>
          </div>`;
        return;
      }

      recentEl.innerHTML = cases.map(c => {
        const meta    = catMeta[c.category] || catMeta.other;
        const date    = _relativeTime(c.createdAt);
        const preview = _buildPreview(c);
        return buildCaseCard({
          category: c.category,
          tag:      meta.tag,
          time:     date,
          title:    c.title || (meta.tag + ' Case'),
          preview:  preview,
          onClick:  'HistoryScreen.openCase("' + c._id + '")',
        });
      }).join('');

    } catch (err) {
      console.warn('Could not load recent cases:', err.message);
      const recentEl = document.getElementById('home-recent-cases');
      if (recentEl) recentEl.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">Could not load recent cases. Start the backend to see them here.</div>`;
    }
  }

  function _buildPreview(c) {
    const cat = c.category;
    const a   = c.answers || {};
    if (cat === 'labour')   return 'Salary dispute — ' + (a.q1 ? a.q1 + ' months pending' : 'guidance provided');
    if (cat === 'cyber')    return 'Cyber fraud — ' + (a.q1 ? 'Rs ' + a.q1 + ' involved' : 'complaint guidance provided');
    if (cat === 'consumer') return 'Consumer complaint — ' + (c.firApplicable ? 'escalation required' : 'forum guidance provided');
    if (cat === 'property') return 'Property dispute — ' + (c.firApplicable ? 'FIR applicable' : 'civil remedy suggested');
    if (cat === 'family')   return 'Family law matter — guidance provided';
    if (cat === 'criminal') return 'Criminal matter — ' + (c.firApplicable ? 'FIR applicable' : 'guidance provided');
    return 'Legal case — action plan provided';
  }

  function _relativeTime(iso) {
    if (!iso) return 'Recently';
    try {
      const d    = new Date(iso);
      const diff = Date.now() - d;
      const mins = Math.floor(diff / 60000);
      const hrs  = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1)   return 'Just now';
      if (mins < 60)  return mins + ' min ago';
      if (hrs < 24)   return hrs + ' hr' + (hrs > 1 ? 's' : '') + ' ago';
      if (days === 1) return 'Yesterday';
      if (days < 7)   return days + ' days ago';
      return d.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
    } catch(e) { return 'Recently'; }
  }

  return { render, init };
})();

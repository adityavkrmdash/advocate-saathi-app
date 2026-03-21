// ================================================
// ADVOCATE SAATHI — HISTORY SCREEN
// frontend/js/screens/history.js
//
// Loads cases from MongoDB.
// Tapping a case replays the full conversation.
// ================================================

const HistoryScreen = (() => {

  const filters = ['All', 'Labour', 'Criminal', 'Consumer', 'Civil', 'Family', 'Property', 'Cyber'];

  const categoryMeta = {
    labour:   { icon: '⚖️', tag: 'Labour Law',     filterKey: 'Labour' },
    criminal: { icon: '🚔', tag: 'Criminal Law',    filterKey: 'Criminal' },
    consumer: { icon: '🛒', tag: 'Consumer Rights', filterKey: 'Consumer' },
    civil:    { icon: '📜', tag: 'Civil Law',        filterKey: 'Civil' },
    family:   { icon: '👨‍👩‍👧', tag: 'Family Law',   filterKey: 'Family' },
    property: { icon: '🏠', tag: 'Property Law',    filterKey: 'Property' },
    cyber:    { icon: '💻', tag: 'Cyber Crime',     filterKey: 'Cyber' },
    other:    { icon: '⚖️', tag: 'Legal Case',      filterKey: 'Civil' },
  };

  let activeFilter = 'All';
  let allCases     = [];

  function render() {
    return `
      <div class="screen" id="history">
        ${renderStatusBar()}
        <div class="screen-header">
          <div class="screen-header-title">Case History</div>
          <div class="screen-header-sub" id="history-count">Loading…</div>
        </div>

        <div class="filter-row" id="filter-row">
          ${filters.map(f => `
            <div class="filter-chip ${f === 'All' ? 'active' : ''}"
                 onclick="HistoryScreen.applyFilter('${f}', this)">${f}</div>`).join('')}
        </div>

        <div class="scroll-area" style="flex:1;">
          <div id="history-list" style="padding:0 24px 20px;">
            ${_loadingState()}
          </div>
        </div>

        ${renderNavBar('history')}
      </div>`;
  }

  async function init() {
    activeFilter = 'All';
    _resetFilters();
    _setList(_loadingState());
    await _fetchCases();
  }

  async function _fetchCases() {
    try {
      const data = await API.getCases();
      allCases   = data.cases || [];

      const countEl = document.getElementById('history-count');
      if (countEl) {
        countEl.textContent = allCases.length === 0
          ? 'No cases saved yet'
          : allCases.length + ' case' + (allCases.length !== 1 ? 's' : '') + ' saved';
      }

      _renderFiltered('All');
    } catch (err) {
      console.error('Could not load cases:', err.message);
      _setList(_errorState());
      const countEl = document.getElementById('history-count');
      if (countEl) countEl.textContent = 'Could not load';
    }
  }

  function applyFilter(filter, el) {
    activeFilter = filter;
    document.querySelectorAll('#filter-row .filter-chip')
      .forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    _renderFiltered(filter);
  }

  function _renderFiltered(filter) {
    const filtered = filter === 'All'
      ? allCases
      : allCases.filter(c => {
          const meta = categoryMeta[c.category];
          return meta && meta.filterKey === filter;
        });
    _setList(_renderCards(filtered));
  }

  function _renderCards(cases) {
    if (!cases || cases.length === 0) {
      return `
        <div style="text-align:center;padding:60px 20px;color:var(--text-muted);">
          <div style="font-size:48px;margin-bottom:16px;">📂</div>
          <div style="font-size:16px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">No cases yet</div>
          <div style="font-size:13px;line-height:1.7;">
            Describe a legal problem and tap<br>
            <strong style="color:var(--gold)">Save This Case</strong> to save it here.
          </div>
        </div>`;
    }

    // Newest first
    const sorted = [...cases].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return sorted.map(c => {
      const meta    = categoryMeta[c.category] || categoryMeta.other;
      const date    = _formatDate(c.createdAt);
      const title   = c.title || (meta.tag + ' Case');
      const preview = _buildPreview(c);
      const msgCount = (c.messages && c.messages.length) ? c.messages.length : 0;
      const caseId  = c._id;

      return `
        <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:14px;padding:16px;margin-bottom:12px;cursor:pointer;transition:border-color 0.2s;"
             onclick="HistoryScreen.openCase('${caseId}')"
             onmouseover="this.style.borderColor='var(--gold)'"
             onmouseout="this.style.borderColor='var(--navy-border)'">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <div style="font-size:24px;flex-shrink:0;">${meta.icon}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:4px;">${escapeHTML(title)}</div>
              <div style="font-size:12px;color:var(--text-muted);line-height:1.5;margin-bottom:8px;">${escapeHTML(preview)}</div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;background:rgba(245,158,11,0.1);color:var(--gold);border:1px solid rgba(245,158,11,0.2);">${escapeHTML(meta.tag)}</span>
                ${c.firApplicable ? '<span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;background:rgba(224,92,92,0.1);color:var(--danger);border:1px solid rgba(224,92,92,0.2);">FIR Applicable</span>' : ''}
                ${msgCount > 0 ? '<span style="font-size:10px;color:var(--text-muted);">💬 ' + msgCount + ' messages</span>' : ''}
                <span style="font-size:11px;color:var(--text-muted);margin-left:auto;">${escapeHTML(date)}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;border-top:1px solid var(--navy-border);padding-top:10px;">
            <button onclick="event.stopPropagation();HistoryScreen.openCase('${caseId}')"
              style="flex:1;padding:8px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:8px;font-family:var(--font-body);font-size:12px;font-weight:600;color:var(--gold);cursor:pointer;">
              📂 View Chat
            </button>
            <button onclick="event.stopPropagation();HistoryScreen.deleteCase('${caseId}')"
              style="padding:8px 16px;background:rgba(224,92,92,0.1);border:1px solid rgba(224,92,92,0.2);border-radius:8px;font-family:var(--font-body);font-size:12px;font-weight:600;color:var(--danger);cursor:pointer;">
              🗑 Delete
            </button>
          </div>
        </div>`;
    }).join('');
  }

  // ── Open case — fetch full data then replay ────
  async function openCase(caseId) {
    Toast.show('Loading case...');
    try {
      // Fetch full case with messages from MongoDB
      const data = await API.getCase(caseId);
      const c    = data.case;
      if (!c) { Toast.show('Could not load case'); return; }

      // Pass full case data to chat screen for replay
      ChatScreen.openFromHistory(c);

    } catch (err) {
      console.error('Could not open case:', err.message);
      Toast.show('Could not load case. Check your connection.');
    }
  }

  // ── Delete case ───────────────────────────────
  async function deleteCase(caseId) {
    try {
      await API.deleteCase(caseId);
      Toast.show('Case deleted');
      await _fetchCases();
    } catch (err) {
      Toast.show('Could not delete case');
    }
  }

  function _buildPreview(c) {
    const cat     = c.category;
    const answers = c.answers || {};
    if (cat === 'labour')   return 'Salary dispute — ' + (answers.q1 ? answers.q1 + ' months pending' : 'action plan provided');
    if (cat === 'cyber')    return 'Cyber fraud — ' + (answers.q1 ? 'Rs ' + answers.q1 + ' lost' : 'complaint guidance provided');
    if (cat === 'consumer') return 'Consumer complaint — forum guidance and action plan provided';
    if (cat === 'property') return 'Property dispute — ' + (c.firApplicable ? 'FIR applicable' : 'civil remedy suggested');
    if (cat === 'family')   return 'Family law matter — guidance and action plan provided';
    if (cat === 'criminal') return 'Criminal matter — ' + (c.firApplicable ? 'FIR applicable' : 'legal guidance provided');
    return 'Legal case — action plan and guidance provided';
  }

  function _setList(html) {
    const el = document.getElementById('history-list');
    if (el) el.innerHTML = html;
  }

  function _resetFilters() {
    document.querySelectorAll('#filter-row .filter-chip')
      .forEach((c, i) => c.classList.toggle('active', i === 0));
  }

  function _loadingState() {
    return `<div style="text-align:center;padding:60px 0;color:var(--text-muted);">
      <div style="display:flex;gap:6px;justify-content:center;margin-bottom:16px;">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out 0.2s infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out 0.4s infinite;"></div>
      </div>
      <div style="font-size:13px;">Loading your cases…</div>
    </div>`;
  }

  function _errorState() {
    return `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);">
      <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:8px;">Could not load cases</div>
      <div style="font-size:12px;margin-bottom:20px;">Make sure your backend is running on port 5000</div>
      <button onclick="HistoryScreen.init()" style="padding:10px 24px;background:var(--gold);border:none;border-radius:10px;font-family:var(--font-body);font-size:13px;font-weight:600;color:var(--navy-deep);cursor:pointer;">Retry</button>
    </div>`;
  }

  function _formatDate(isoString) {
    if (!isoString) return 'Recently';
    try {
      const date = new Date(isoString);
      const now  = new Date();
      const diff = now - date;
      const mins = Math.floor(diff / 60000);
      const hrs  = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1)   return 'Just now';
      if (mins < 60)  return mins + ' min ago';
      if (hrs < 24)   return hrs + ' hr' + (hrs > 1 ? 's' : '') + ' ago';
      if (days === 1) return 'Yesterday';
      if (days < 7)   return days + ' days ago';
      return date.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    } catch(e) { return 'Recently'; }
  }

  return { render, init, applyFilter, openCase, deleteCase };
})();

// ================================================
// ADVOCATE SAATHI — MY CONSULTATIONS SCREEN
// frontend/js/screens/consultations.js
//
// Shows all booked lawyer consultations from MongoDB.
// Accessible from Profile → My Consultations
// ================================================

const ConsultationsScreen = (() => {

  const statusMeta = {
    requested:  { label: 'Requested',  color: 'rgba(245,158,11,0.8)',  bg: 'rgba(245,158,11,0.1)' },
    confirmed:  { label: 'Confirmed',  color: 'rgba(16,185,129,0.9)',  bg: 'rgba(16,185,129,0.1)' },
    completed:  { label: 'Completed',  color: 'rgba(99,102,241,0.9)',  bg: 'rgba(99,102,241,0.1)' },
    cancelled:  { label: 'Cancelled',  color: 'rgba(224,92,92,0.8)',   bg: 'rgba(224,92,92,0.1)' },
  };

  function render() {
    return `
      <div class="screen" id="consultations">
        ${renderStatusBar()}
        <div class="screen-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <div onclick="Router.navigate('profile')"
              style="width:32px;height:32px;border-radius:50%;background:var(--navy-mid);border:1px solid var(--navy-border);display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </div>
            <div>
              <div class="screen-header-title">My Consultations</div>
              <div class="screen-header-sub" id="consult-count">Loading…</div>
            </div>
          </div>
        </div>

        <div class="scroll-area" style="flex:1;">
          <div id="consult-list" style="padding:0 24px 20px;">
            ${_loadingState()}
          </div>
        </div>

        ${renderNavBar('profile')}
      </div>`;
  }

  async function init() {
    _setList(_loadingState());
    await _fetchConsultations();
  }

  async function _fetchConsultations() {
    try {
      const data          = await API.getConsultations();
      const consultations = data.consultations || [];

      const countEl = document.getElementById('consult-count');
      if (countEl) countEl.textContent = consultations.length + ' consultation' + (consultations.length !== 1 ? 's' : '');

      _setList(_renderCards(consultations));
    } catch (err) {
      console.warn('Could not load consultations:', err.message);
      _setList(_errorState());
    }
  }

  function _renderCards(consultations) {
    if (!consultations || consultations.length === 0) {
      return `
        <div style="text-align:center;padding:60px 20px;color:var(--text-muted);">
          <div style="font-size:48px;margin-bottom:16px;">👨‍⚖️</div>
          <div style="font-size:16px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">No consultations yet</div>
          <div style="font-size:13px;line-height:1.7;">
            When you find a lawyer in chat and tap<br>
            <strong style="color:var(--gold)">Book Consultation</strong>, it will appear here.
          </div>
          <button onclick="ChatScreen.openFresh()"
            style="margin-top:20px;padding:12px 28px;background:linear-gradient(135deg,var(--gold),var(--gold-dim));border:none;border-radius:12px;font-family:var(--font-body);font-size:13px;font-weight:700;color:var(--navy-deep);cursor:pointer;">
            Find a Lawyer
          </button>
        </div>`;
    }

    return consultations.map(c => {
      const sm   = statusMeta[c.status] || statusMeta.requested;
      const date = _formatDate(c.createdAt);
      const fee  = c.lawyer.consultationFee === 0 ? 'Free' : '₹' + c.lawyer.consultationFee;

      return `
        <div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:14px;padding:16px;margin-bottom:14px;">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dim));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:var(--navy-deep);flex-shrink:0;">
              ${escapeHTML(c.lawyer.name.charAt(0))}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:15px;color:var(--text-primary);margin-bottom:2px;">${escapeHTML(c.lawyer.name)}</div>
              <div style="font-size:12px;color:var(--text-muted);">${escapeHTML(c.lawyer.specialisation || 'Legal Consultant')}</div>
              <div style="font-size:12px;color:var(--text-muted);">📍 ${escapeHTML(c.lawyer.city || '')}${c.lawyer.city && c.lawyer.state ? ', ' : ''}${escapeHTML(c.lawyer.state || '')}</div>
            </div>
            <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;background:${sm.bg};color:${sm.color};border:1px solid ${sm.color};flex-shrink:0;">${sm.label}</span>
          </div>

          <div style="background:var(--navy-deep);border-radius:10px;padding:12px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="font-size:11px;color:var(--text-muted);">Case</span>
              <span style="font-size:11px;font-weight:600;color:var(--text-secondary);">${escapeHTML(c.caseTitle || c.caseCategory || 'General Consultation')}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="font-size:11px;color:var(--text-muted);">Fee</span>
              <span style="font-size:11px;font-weight:600;color:var(--gold);">${escapeHTML(fee)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:11px;color:var(--text-muted);">Requested</span>
              <span style="font-size:11px;color:var(--text-muted);">${escapeHTML(date)}</span>
            </div>
          </div>

          <div style="display:flex;gap:8px;">
            ${c.status === 'requested' || c.status === 'confirmed' ? `
              <button onclick="ConsultationsScreen.cancel('${c._id}')"
                style="flex:1;padding:8px;background:rgba(224,92,92,0.1);border:1px solid rgba(224,92,92,0.3);border-radius:8px;font-family:var(--font-body);font-size:12px;font-weight:600;color:var(--danger);cursor:pointer;">
                Cancel
              </button>` : ''}
            <button onclick="ConsultationsScreen.remove('${c._id}')"
              style="padding:8px 16px;background:var(--navy-deep);border:1px solid var(--navy-border);border-radius:8px;font-family:var(--font-body);font-size:12px;color:var(--text-muted);cursor:pointer;">
              Remove
            </button>
          </div>
        </div>`;
    }).join('');
  }

  async function cancel(id) {
    try {
      await API.updateConsultStatus(id, 'cancelled');
      Toast.show('Consultation cancelled');
      await _fetchConsultations();
    } catch (err) { Toast.show('Could not cancel'); }
  }

  async function remove(id) {
    try {
      await API.deleteConsultation(id);
      Toast.show('Removed');
      await _fetchConsultations();
    } catch (err) { Toast.show('Could not remove'); }
  }

  function _setList(html) {
    const el = document.getElementById('consult-list');
    if (el) el.innerHTML = html;
  }

  function _loadingState() {
    return `<div style="text-align:center;padding:60px 0;color:var(--text-muted);">
      <div style="display:flex;gap:6px;justify-content:center;margin-bottom:16px;">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out 0.2s infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out 0.4s infinite;"></div>
      </div>
      <div style="font-size:13px;">Loading consultations…</div>
    </div>`;
  }

  function _errorState() {
    return `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);">
      <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
      <div style="font-size:14px;margin-bottom:20px;">Could not load consultations</div>
      <button onclick="ConsultationsScreen.init()" style="padding:10px 24px;background:var(--gold);border:none;border-radius:10px;font-family:var(--font-body);font-size:13px;font-weight:600;color:var(--navy-deep);cursor:pointer;">Retry</button>
    </div>`;
  }

  function _formatDate(iso) {
    if (!iso) return '';
    try {
      const d    = new Date(iso);
      const diff = Date.now() - d;
      const hrs  = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (hrs < 24)   return hrs + ' hr' + (hrs !== 1 ? 's' : '') + ' ago';
      if (days === 1) return 'Yesterday';
      if (days < 7)   return days + ' days ago';
      return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    } catch(e) { return ''; }
  }

  return { render, init, cancel, remove };
})();

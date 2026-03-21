// ================================================
// ADVOCATE SAATHI — NOTIFICATIONS SCREEN
// frontend/js/screens/notifications.js
//
// Loads real notifications from MongoDB.
// Notifications are created automatically when:
//  - A case is saved
//  - FIR is applicable
//  - A notice is drafted
// ================================================

const NotificationsScreen = (() => {

  let notifications = [];

  function render() {
    return `
      <div class="screen" id="notifications">
        ${renderStatusBar()}
        <div class="screen-header">
          <div class="screen-header-title">Notifications</div>
          <div class="screen-header-sub" id="notif-count">Loading…</div>
        </div>

        <div style="padding:0 24px 8px;display:flex;justify-content:flex-end;">
          <button onclick="NotificationsScreen.markAllRead()"
            style="font-size:12px;color:var(--gold);background:none;border:none;font-family:var(--font-body);cursor:pointer;padding:4px 0;">
            Mark all as read
          </button>
        </div>

        <div class="scroll-area" style="flex:1;">
          <div id="notif-list" style="padding:0 24px 20px;">
            ${_loadingState()}
          </div>
        </div>

        ${renderNavBar('notifications')}
      </div>`;
  }

  async function init() {
    _setList(_loadingState());
    await _fetchNotifications();
  }

  async function _fetchNotifications() {
    try {
      const data  = await API.getNotifications();
      notifications = data.notifications || [];
      const unread  = data.unread || 0;

      const countEl = document.getElementById('notif-count');
      if (countEl) countEl.textContent = unread > 0 ? unread + ' unread' : 'All caught up';

      _setList(_renderNotifications());

    } catch (err) {
      console.warn('Could not load notifications:', err.message);
      _setList(_emptyState('Could not load notifications. Make sure your backend is running.'));
    }
  }

  function _renderNotifications() {
    if (!notifications || notifications.length === 0) {
      return _emptyState('No notifications yet.\n\nYou will receive updates here when cases are saved, FIRs are applicable, or reminders are triggered.');
    }

    // Group by date
    const today     = [];
    const yesterday = [];
    const older     = [];

    const now = new Date();
    notifications.forEach(function(n) {
      const d    = new Date(n.createdAt);
      const diff = now - d;
      const days = Math.floor(diff / 86400000);
      if (days < 1)       today.push(n);
      else if (days < 2)  yesterday.push(n);
      else                older.push(n);
    });

    let html = '';

    if (today.length) {
      html += '<div class="notif-group-title">Today</div>';
      html += today.map(_renderItem).join('');
    }
    if (yesterday.length) {
      html += '<div class="notif-group-title">Yesterday</div>';
      html += yesterday.map(_renderItem).join('');
    }
    if (older.length) {
      html += '<div class="notif-group-title">Earlier</div>';
      html += older.map(_renderItem).join('');
    }

    return html;
  }

  function _renderItem(n) {
    const time = _formatTime(n.createdAt);
    return `
      <div class="notif-item ${n.read ? '' : 'unread'}"
           onclick="NotificationsScreen.onTap('${n._id}', '${n.caseId || ''}')">
        <div class="notif-icon-wrap">${n.icon || '🔔'}</div>
        <div class="notif-content">
          <div class="notif-title">${escapeHTML(n.title)}</div>
          <div class="notif-body">${escapeHTML(n.body)}</div>
          <div class="notif-time">${escapeHTML(time)}</div>
        </div>
        ${!n.read ? '<div style="width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:4px;"></div>' : ''}
      </div>`;
  }

  async function onTap(notifId, caseId) {
    // Mark as read
    try { await API.markRead(notifId); } catch(e) {}

    // If linked to a case — open it
    if (caseId && caseId !== 'null' && caseId !== '') {
      try {
        const data = await API.getCase(caseId);
        if (data.case) ChatScreen.openFromHistory(data.case);
      } catch(e) {
        Toast.show('Could not open case');
      }
    }

    // Refresh
    await _fetchNotifications();
  }

  async function markAllRead() {
    try {
      await API.markAllRead();
      await _fetchNotifications();
      Toast.show('All marked as read');
    } catch (err) {
      Toast.show('Could not update notifications');
    }
  }

  function _formatTime(iso) {
    if (!iso) return '';
    try {
      const d    = new Date(iso);
      const diff = Date.now() - d;
      const mins = Math.floor(diff / 60000);
      const hrs  = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1)   return 'Just now';
      if (mins < 60)  return mins + ' min ago';
      if (hrs < 24)   return hrs + ' hr' + (hrs > 1 ? 's' : '') + ' ago';
      if (days === 1) return 'Yesterday, ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
      return d.toLocaleDateString('en-IN', { day:'numeric', month:'short' }) + ', ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    } catch(e) { return ''; }
  }

  function _setList(html) {
    const el = document.getElementById('notif-list');
    if (el) el.innerHTML = html;
  }

  function _loadingState() {
    return `<div style="text-align:center;padding:60px 0;color:var(--text-muted);">
      <div style="display:flex;gap:6px;justify-content:center;margin-bottom:16px;">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out 0.2s infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);animation:dot-bounce 1.2s ease-in-out 0.4s infinite;"></div>
      </div>
      <div style="font-size:13px;">Loading notifications…</div>
    </div>`;
  }

  function _emptyState(msg) {
    return `<div style="text-align:center;padding:60px 20px;color:var(--text-muted);">
      <div style="font-size:48px;margin-bottom:16px;">🔔</div>
      <div style="font-size:13px;line-height:1.7;white-space:pre-line;">${escapeHTML(msg)}</div>
    </div>`;
  }

  return { render, init, onTap, markAllRead };
})();

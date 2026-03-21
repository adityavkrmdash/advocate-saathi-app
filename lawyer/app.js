// ================================================
// ADVOCATE SAATHI — LAWYER DASHBOARD JS
// lawyer/app.js
// ================================================

const App = (() => {

  let currentPage  = 'dashboard';
  let currentCase  = null;
  let currentView  = 'list';
  let currentWsTab = 'chat';

  // ── Init ──────────────────────────────────────
  function init() {
    // Set lawyer name from localStorage or use dummy
    const stored = JSON.parse(localStorage.getItem('as_user') || '{}');
    const name   = stored.name || DATA.lawyer.name;
    const initials = name.split(' ').filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0,2) || 'RS';

    document.getElementById('sb-name').textContent   = name;
    document.getElementById('sb-avatar').textContent  = initials;
    document.getElementById('tb-avatar').textContent  = initials;
    document.getElementById('lawyer-name').textContent = name.split(' ')[0];

    // Build case list
    renderCaseList(DATA.cases);

    // Animate stat counters
    animateCounters();

    // Animate rating bars after delay
    setTimeout(animateRatingBars, 500);
  }

  // ── Navigation ────────────────────────────────
  function navigate(page, el) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (el) el.classList.add('active');

    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      workspace:  'Case Workspace',
      clients:    'Clients',
      payments:   'Payments',
      reviews:    'Reviews',
      settings:   'Settings',
    };
    document.getElementById('page-title').textContent = titles[page] || page;

    currentPage = page;

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  }

  function toggleNotifications() {
    const dd = document.getElementById('notif-dropdown');
    dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  }

  // Close notifications on outside click
  document.addEventListener('click', function(e) {
    const dd  = document.getElementById('notif-dropdown');
    const btn = document.querySelector('.notif-btn');
    if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
      dd.style.display = 'none';
    }
  });

  // ── Case List ─────────────────────────────────
  function renderCaseList(cases) {
    const container = document.getElementById('case-list');
    if (!container) return;

    if (currentView === 'kanban') {
      renderKanban(cases);
      return;
    }

    container.innerHTML = cases.map(c => `
      <div class="case-item ${currentCase && currentCase.id === c.id ? 'active' : ''}"
           onclick="App.openCase('${c.id}')">
        <div class="ci-title">${c.title}</div>
        <div class="ci-client">${c.client} · ${c.type}</div>
        <div class="ci-footer">
          <span class="status-badge status-${c.status}">${capitalize(c.status)}</span>
          <span class="urgency-badge ${c.urgency}" style="font-size:9px;">${c.urgency.toUpperCase()}</span>
          ${c.fir ? '<span class="tag red" style="font-size:9px;">FIR</span>' : ''}
        </div>
      </div>`).join('');
  }

  function renderKanban(cases) {
    const container = document.getElementById('case-list');
    const groups = {
      urgent:   cases.filter(c => c.urgency === 'high'),
      active:   cases.filter(c => c.status === 'active' && c.urgency !== 'high'),
      pending:  cases.filter(c => c.status === 'pending'),
      resolved: cases.filter(c => c.status === 'resolved'),
    };

    container.innerHTML = `
      <div class="kanban-board">
        ${Object.entries({ 'Urgent': groups.urgent, 'Active': groups.active, 'Pending': groups.pending, 'Resolved': groups.resolved })
          .map(([label, items]) => `
            <div class="kanban-col">
              <div class="kanban-col-title" style="color:${label==='Urgent'?'#ef4444':label==='Active'?'#f59e0b':label==='Resolved'?'#10b981':'#3b82f6'}">${label} (${items.length})</div>
              ${items.map(c => `
                <div class="kanban-card" onclick="App.openCase('${c.id}')">
                  <div style="font-weight:700;margin-bottom:4px;">${c.title}</div>
                  <div style="color:#94a3b8;font-size:11px;">${c.client}</div>
                </div>`).join('')}
            </div>`).join('')}
      </div>`;
  }

  function setView(view) {
    currentView = view;
    document.getElementById('btn-list').classList.toggle('active',   view === 'list');
    document.getElementById('btn-kanban').classList.toggle('active', view === 'kanban');
    renderCaseList(DATA.cases);
  }

  function filterCases(select) {
    const val = select.value;
    const filtered = val ? DATA.cases.filter(c => c.category === val) : DATA.cases;
    renderCaseList(filtered);
  }

  // ── Open Case ─────────────────────────────────
  function openCase(id) {
    const c = DATA.cases.find(x => x.id === id);
    if (!c) return;
    currentCase = c;

    // Navigate to workspace if not there
    if (currentPage !== 'workspace') {
      navigate('workspace', document.querySelector('.nav-item[onclick*="workspace"]'));
    }

    // Update case list active state
    renderCaseList(DATA.cases);

    // Show case detail
    document.getElementById('ws-empty').style.display = 'none';
    const detail = document.getElementById('ws-case-detail');
    detail.style.display = 'flex';
    detail.style.flexDirection = 'column';
    detail.style.flex = '1';
    detail.style.overflow = 'hidden';

    detail.innerHTML = `
      <div class="case-detail-header">
        <div>
          <div class="cd-title">${c.title}</div>
          <div class="cd-meta">${c.client} · ${c.type} · <span class="status-badge status-${c.status}">${capitalize(c.status)}</span></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          ${c.fir ? '<span class="tag red">FIR Required</span>' : ''}
          <span class="urgency-badge ${c.urgency}">${c.urgency.toUpperCase()}</span>
          <button class="btn-xs" onclick="App.markResolved('${c.id}')">Mark Resolved</button>
        </div>
      </div>
      <div class="case-detail-body">
        <div class="cd-section">
          <div class="cd-section-title">Problem Description</div>
          <div class="cd-text">${c.description}</div>
        </div>
        <div class="cd-section">
          <div class="cd-section-title">AI Analysis Summary</div>
          <div class="ai-summary">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
              <span class="ai-badge">AI</span>
              <span style="font-size:11px;color:#f59e0b;font-weight:700;">Smart Case Analysis</span>
            </div>
            <div class="cd-text">${c.aiSummary}</div>
          </div>
        </div>
        <div class="cd-section">
          <div class="cd-section-title">Case Timeline</div>
          <div class="timeline">
            ${c.timeline.map(t => `
              <div class="tl-item">
                <div class="tl-dot ${t.status}">${t.status==='done'?'✓':t.status==='active'?'●':'○'}</div>
                <div class="tl-body">
                  <div class="tl-title">${t.title}</div>
                  <div class="tl-date">${t.date}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;

    // Load chat
    renderChat(c.messages);

    // Load documents
    renderDocs(c.documents);
  }

  function openNewCase() {
    alert('New case intake form — coming soon!');
  }

  function markResolved(id) {
    const c = DATA.cases.find(x => x.id === id);
    if (c) { c.status = 'resolved'; openCase(id); renderCaseList(DATA.cases); }
  }

  // ── Chat ──────────────────────────────────────
  function renderChat(messages) {
    const container = document.getElementById('chat-messages-ws');
    if (!container) return;

    container.innerHTML = messages.map(m => `
      <div class="chat-msg ${m.from === 'lawyer' ? 'sent' : 'received'}">
        <div class="chat-bubble">${m.text}</div>
        <div class="chat-time">${m.time}</div>
      </div>`).join('');

    container.scrollTop = container.scrollHeight;
  }

  function sendMessage() {
    const input = document.getElementById('ws-chat-input');
    const text  = input ? input.value.trim() : '';
    if (!text || !currentCase) return;

    // Add to data
    currentCase.messages.push({
      from: 'lawyer',
      text: text,
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
    });

    input.value = '';
    input.style.height = 'auto';
    renderChat(currentCase.messages);
  }

  // ── Documents ─────────────────────────────────
  function renderDocs(docs) {
    const container = document.getElementById('docs-list');
    if (!container) return;

    container.innerHTML = docs.map(d => `
      <div class="doc-item">
        <div class="doc-icon">${d.icon}</div>
        <div class="doc-info">
          <div class="doc-name">${d.name}</div>
          <div class="doc-size">${d.size}</div>
        </div>
        <div class="doc-action" onclick="App.viewDoc('${d.name}')">View →</div>
      </div>`).join('');
  }

  function uploadDoc(input) {
    const file = input.files[0];
    if (!file || !currentCase) return;
    currentCase.documents.push({
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      type: 'upload',
      icon: '📄',
    });
    renderDocs(currentCase.documents);
    Toast('Document uploaded: ' + file.name);
  }

  function viewDoc(name) {
    Toast('Opening: ' + name);
  }

  // ── Workspace Tabs ────────────────────────────
  function switchWsTab(tab) {
    currentWsTab = tab;
    document.getElementById('tab-chat').classList.toggle('active', tab === 'chat');
    document.getElementById('tab-docs').classList.toggle('active', tab === 'docs');
    document.getElementById('ws-chat').style.display = tab === 'chat' ? 'flex' : 'none';
    document.getElementById('ws-docs').style.display = tab === 'docs' ? 'block' : 'none';
  }

  // ── Animations ────────────────────────────────
  function animateCounters() {
    document.querySelectorAll('.stat-value').forEach(el => {
      const text = el.textContent;
      const num  = parseInt(text.replace(/[^0-9]/g, ''));
      if (!num) return;
      let cur = 0;
      const step = Math.ceil(num / 30);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, num);
        if (text.includes('₹')) {
          el.textContent = '₹' + cur.toLocaleString('en-IN');
        } else {
          el.textContent = cur;
        }
        if (cur >= num) clearInterval(timer);
      }, 30);
    });
  }

  function animateRatingBars() {
    document.querySelectorAll('.rb-fill').forEach(el => {
      const w = el.style.width;
      el.style.width = '0';
      setTimeout(() => { el.style.width = w; }, 100);
    });
  }

  // ── Logout ────────────────────────────────────
  function logout() {
    localStorage.removeItem('as_session');
    localStorage.removeItem('as_user');
    window.location.href = '../index.html';
  }

  // ── Toast ─────────────────────────────────────
  function Toast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e2a3a;border:1px solid #2d3f52;color:#f1f5f9;padding:12px 18px;border-radius:10px;font-size:13px;font-family:Inter,sans-serif;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.4);animation:fadeIn 0.2s ease;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  // ── Helpers ───────────────────────────────────
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }

  return { init, navigate, toggleSidebar, toggleNotifications, openCase, openNewCase, markResolved, sendMessage, uploadDoc, viewDoc, setView, filterCases, switchWsTab, logout, autoResize };

})();

// ── Bootstrap ────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  App.init();
});

// Expose autoResize globally for inline onkeyup
function autoResize(el) { App.autoResize(el); }

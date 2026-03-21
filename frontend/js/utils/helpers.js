// ================================================
// ADVOCATE SAATHI — HELPERS
// frontend/js/utils/helpers.js
// ================================================

function getTimeString() {
  const n = new Date();
  return n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0');
}

function escapeHTML(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

function formatAIText(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>');
  text = text.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  text = text.replace(
    /(IPC\s+Section\s+\d+[A-Za-z]*|CrPC\s+Section\s+\d+[A-Za-z]*|Section\s+\d+[A-Za-z]*\s+of\s+[A-Za-z ,]+|Article\s+\d+[A-Za-z]*)/g,
    '<span style="color:var(--gold);font-weight:600">$1</span>'
  );
  return text;
}

function startLiveClock(id = 'live-time') {
  const update = () => { const el = document.getElementById(id); if (el) el.textContent = getTimeString(); };
  update();
  setInterval(update, 30000);
}

function getInitials(name) {
  return (name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AV';
}

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

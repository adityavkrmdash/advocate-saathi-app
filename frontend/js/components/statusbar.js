// ================================================
// ADVOCATE SAATHI — STATUS BAR COMPONENT
// frontend/js/components/statusbar.js
// ================================================

function renderStatusBar(timeId = null) {
  const timeEl = timeId
    ? `<span class="time" id="${timeId}">${getTimeString()}</span>`
    : `<span class="time">${getTimeString()}</span>`;
  return `<div class="status-bar">${timeEl}<div class="status-icons">
    <svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="6" width="3" height="10" rx="1"/><rect x="6" y="4" width="3" height="12" rx="1"/><rect x="11" y="1" width="3" height="15" rx="1"/></svg>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 6c2-2 4.5-3 7-3s5 1 7 3"/><path d="M3.5 9c1.2-1.2 2.8-2 4.5-2s3.3.8 4.5 2"/><circle cx="8" cy="13" r="1" fill="currentColor"/></svg>
    <svg viewBox="0 0 22 12" fill="none"><rect x="1" y="1" width="17" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M19 4v4a2 2 0 000-4z" fill="currentColor"/><rect x="2.5" y="2.5" width="10" height="7" rx="1" fill="currentColor"/></svg>
  </div></div>`;
}

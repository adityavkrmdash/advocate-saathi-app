// ================================================
// ADVOCATE SAATHI — CASE CARD COMPONENT
// frontend/js/components/casecard.js
// ================================================

function buildCaseCard({ category, tag, time, title, preview, onClick = '' }) {
  return `<div class="case-card ${category}" onclick="${onClick}">
    <div class="case-card-header">
      <span class="case-tag">${escapeHTML(tag)}</span>
      <span class="case-time">${escapeHTML(time)}</span>
    </div>
    <div class="case-title">${escapeHTML(title)}</div>
    <div class="case-preview">${escapeHTML(preview)}</div>
  </div>`;
}

function buildHistoryCard({ icon, title, preview, tag, date, onClick = '' }) {
  return `<div class="history-card" onclick="${onClick}">
    <div class="history-icon">${icon}</div>
    <div class="history-content">
      <div class="history-title">${escapeHTML(title)}</div>
      <div class="history-preview">${escapeHTML(preview)}</div>
      <div class="history-meta">
        <div class="history-tag">${escapeHTML(tag)}</div>
        <div class="history-date">${escapeHTML(date)}</div>
      </div>
    </div>
  </div>`;
}

// ================================================
// ADVOCATE SAATHI — CHAT BUBBLE COMPONENT
// frontend/js/components/chatbubble.js
// ================================================

function buildAIBubble(text, card = null, time = getTimeString()) {
  const cardHTML = card ? buildLegalCard(card.title, card.items) : '';
  return `<div class="msg-row ai">
    <div class="msg-avatar ai">⚖</div>
    <div><div class="msg-bubble">${text}${cardHTML}</div><div class="msg-time">${time}</div></div>
  </div>`;
}

function buildUserBubble(text, initials = 'AV', time = getTimeString()) {
  return `<div class="msg-row user">
    <div><div class="msg-bubble">${escapeHTML(text)}</div><div class="msg-time">${time}</div></div>
    <div class="msg-avatar user">${initials}</div>
  </div>`;
}

function buildTypingIndicator() {
  return `<div class="msg-row ai" id="typing-row">
    <div class="msg-avatar ai">⚖</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
    </div>
  </div>`;
}

function buildLegalCard(title, items) {
  return `<div class="legal-card">
    <div class="legal-card-title">⚖️ ${escapeHTML(title)}</div>
    <ul>${items.map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ul>
  </div>`;
}

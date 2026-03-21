// ================================================
// ADVOCATE SAATHI — TOAST
// frontend/js/utils/toast.js
// ================================================

const Toast = (() => {
  let t = null;
  function show(msg, ms = 2500) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(t);
    t = setTimeout(() => el.classList.remove('show'), ms);
  }
  return { show };
})();

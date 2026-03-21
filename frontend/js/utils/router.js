// ================================================
// ADVOCATE SAATHI — ROUTER
// frontend/js/utils/router.js
// ================================================

const Router = (() => {
  let current = null;

  function navigate(id) {
    if (id === current) return;
    const prev = current ? document.getElementById(current) : null;
    const next = document.getElementById(id);
    if (!next) return console.warn('[Router] Screen not found:', id);

    if (prev) {
      prev.classList.add('slide-out');
      setTimeout(() => prev.classList.remove('active', 'slide-out'), 380);
    }

    next.style.transform = 'translateX(30px)';
    next.style.opacity   = '0';
    next.classList.add('active');
    requestAnimationFrame(() => { next.style.transform = ''; next.style.opacity = ''; });

    current = id;
    window.dispatchEvent(new CustomEvent('screenchange', { detail: { screen: id } }));
  }

  function getCurrent() { return current; }

  return { navigate, getCurrent };
})();

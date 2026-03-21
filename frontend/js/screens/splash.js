// ================================================
// ADVOCATE SAATHI — SPLASH SCREEN
// frontend/js/screens/splash.js
// ================================================

const SplashScreen = (() => {
  const LOGO = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L6 14V26C6 35.94 13.8 45.26 24 48C34.2 45.26 42 35.94 42 26V14L24 4Z" fill="currentColor" fill-opacity="0.95"/>
    <path d="M18 24L22 28L30 20" stroke="#050d1a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  function render() {
    return `<div class="screen" id="splash">
      <div class="splash-bg"></div>
      <div class="splash-content">
        <div class="splash-logo">${LOGO}</div>
        <div class="splash-title">Advocate<br/><span>Saathi</span></div>
        <div class="splash-subtitle">AI Legal Assistant</div>
        <div class="splash-tagline">Your trusted companion for navigating India's legal system</div>
        <div class="splash-loader">
          <div class="splash-dot"></div><div class="splash-dot"></div><div class="splash-dot"></div>
        </div>
      </div>
    </div>`;
  }

  function init() {
    setTimeout(() => Router.navigate('onboarding'), 2800);
  }

  return { render, init };
})();

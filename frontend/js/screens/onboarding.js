// ================================================
// ADVOCATE SAATHI — ONBOARDING SCREEN
// frontend/js/screens/onboarding.js
// ================================================

const OnboardingScreen = (() => {
  let slide = 0;

  const slides = [
    {
      icon: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="20" r="10" stroke="currentColor" stroke-width="2"/><path d="M10 44C10 36.27 17.16 30 26 30s16 6.27 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M36 10l3 3-3 3M42 13H36" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      title: 'Know Your<br/>Legal Rights',
      desc:  "Understand complex Indian laws in simple language. From IPC to Consumer Protection Act — we've got you covered."
    },
    {
      icon: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="8" width="32" height="36" rx="4" stroke="currentColor" stroke-width="2"/><path d="M18 20h16M18 27h10M18 34h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="38" cy="38" r="8" fill="#050d1a" stroke="currentColor" stroke-width="2"/><path d="M35 38l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      title: 'AI-Powered<br/>Action Plans',
      desc:  "Get step-by-step guidance for FIRs, legal notices, consumer complaints — personalised to your situation."
    },
    {
      icon: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 6L10 14v12c0 10 6.8 19.3 16 22 9.2-2.7 16-12 16-22V14L26 6z" stroke="currentColor" stroke-width="2"/><path d="M20 26l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      title: 'Confidential &<br/>Secure',
      desc:  "Your legal conversations are encrypted and private. Hindi support coming soon."
    }
  ];

  function render() {
    return `<div class="screen" id="onboarding">
      <div style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
        <div style="flex:1;overflow:hidden;position:relative;">
          <div class="onboarding-slides" id="ob-slides">
            ${slides.map(s => `<div class="onboarding-slide">
              <div class="ob-icon"><div class="ob-icon-inner">${s.icon}</div></div>
              <div class="ob-title">${s.title}</div>
              <div class="ob-desc">${s.desc}</div>
            </div>`).join('')}
          </div>
        </div>
        <div class="ob-footer">
          <div class="ob-dots" id="ob-dots">
            ${slides.map((_,i) => `<div class="ob-dot ${i===0?'active':''}"></div>`).join('')}
          </div>
          <button class="btn-primary" id="ob-btn">Get Started</button>
          <button class="btn-ghost" onclick="Router.navigate('auth')">I already have an account</button>
        </div>
      </div>
    </div>`;
  }

  function init() {
    slide = 0;
    document.getElementById('ob-btn').addEventListener('click', next);
  }

  function next() {
    if (slide < slides.length - 1) {
      slide++;
      document.getElementById('ob-slides').style.transform = `translateX(-${slide * (100/slides.length)}%)`;
      document.querySelectorAll('.ob-dot').forEach((d,i) => d.classList.toggle('active', i===slide));
      document.getElementById('ob-btn').textContent = slide === slides.length-1 ? 'Create Free Account →' : 'Get Started';
    } else {
      Router.navigate('auth');
    }
  }

  return { render, init };
})();

// ================================================
// ADVOCATE SAATHI — NAVBAR COMPONENT
// frontend/js/components/navbar.js
// ================================================

function renderNavBar(active) {
  const tabs = [
    {
      id:    'home',
      label: 'Home',
      icon:  `<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>`
    },
    {
      id:    'history',
      label: 'History',
      icon:  `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`
    },
    {
      id:    'notifications',
      label: 'Alerts',
      icon:  `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>`
    },
    {
      id:    'profile',
      label: 'Profile',
      icon:  `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>`
    }
  ];

  return `
    <nav class="nav-bar">
      ${tabs.map(t => `
        <div class="nav-item ${t.id === active ? 'active' : ''}"
             onclick="Router.navigate('${t.id}')">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${t.icon}</svg>
          <span>${t.label}</span>
        </div>`).join('')}
    </nav>`;
}

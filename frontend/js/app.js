// ================================================
// ADVOCATE SAATHI — APP BOOTSTRAP
// frontend/js/app.js
// ================================================

const App = (() => {

  const screens = [
    { id: 'splash',         module: SplashScreen },
    { id: 'onboarding',     module: OnboardingScreen },
    { id: 'auth',           module: AuthScreen },
    { id: 'home',           module: HomeScreen },
    { id: 'chat',           module: ChatScreen },
    { id: 'legalnotice',    module: LegalNoticeScreen },
    { id: 'consumerforum',  module: ConsumerForumScreen },
    { id: 'history',        module: HistoryScreen },
    { id: 'notifications',    module: NotificationsScreen },
    { id: 'consultations',    module: ConsultationsScreen },
    { id: 'profile',        module: ProfileScreen },
  ];

  const screenMap = {};

  function init() {
    const root = document.getElementById('screen-root');
    if (!root) return console.error('[App] #screen-root not found');

    screens.forEach(({ id, module }) => {
      root.insertAdjacentHTML('beforeend', module.render());
      screenMap[id] = module;
    });

    window.addEventListener('screenchange', (e) => {
      const id  = e.detail && e.detail.screen;
      const mod = screenMap[id];
      // For chat screen: only call init() if it was NOT opened via
      // openWithQuery/openCategory/openFromHistory (those manage state themselves)
      if (mod && mod.init) {
        if (id === 'chat' && window._chatManagedNav) {
          // Skip init — chat screen managed its own state
          window._chatManagedNav = false;
        } else {
          mod.init();
        }
      }
    });

    const session = Storage.get('session');
    if (session && session.loggedIn) {
      Router.navigate('home');
      startLiveClock('live-time');
    } else {
      Router.navigate('splash');
      SplashScreen.init();
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', function() { App.init(); });

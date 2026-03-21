// ================================================
// ADVOCATE SAATHI — AUTH SCREEN
// frontend/js/screens/auth.js
// ================================================

const AuthScreen = (() => {
  let tab  = 'login';
  let role = 'user'; // 'user' or 'lawyer'

  const LOGO = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L6 14V26C6 35.94 13.8 45.26 24 48C34.2 45.26 42 35.94 42 26V14L24 4Z" fill="currentColor"/>
    <path d="M18 24L22 28L30 20" stroke="#050d1a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  function render() {
    return `
      <div class="screen" id="auth">
        ${renderStatusBar()}
        <div class="scroll-area" style="flex:1;">

          <div class="auth-header">
            <div class="auth-logo-small">${LOGO}</div>
            <div class="auth-title">Advocate Saathi</div>
            <div class="auth-subtitle">India's AI-powered legal assistant</div>
          </div>

          <!-- Role Selector -->
          <div style="padding:0 36px 20px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div id="role-user" onclick="AuthScreen.setRole('user')"
                style="padding:12px;border-radius:12px;border:2px solid var(--gold);background:rgba(245,158,11,0.1);text-align:center;cursor:pointer;transition:all 0.2s;">
                <div style="font-size:22px;margin-bottom:4px;">👤</div>
                <div style="font-size:13px;font-weight:700;color:var(--gold);">User Login</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">Seek legal help</div>
              </div>
              <div id="role-lawyer" onclick="AuthScreen.setRole('lawyer')"
                style="padding:12px;border-radius:12px;border:2px solid var(--navy-border);background:var(--navy-mid);text-align:center;cursor:pointer;transition:all 0.2s;">
                <div style="font-size:22px;margin-bottom:4px;">⚖️</div>
                <div style="font-size:13px;font-weight:700;color:var(--text-secondary);">Lawyer Login</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">Manage your cases</div>
              </div>
            </div>
          </div>

          <div class="auth-tabs">
            <div class="auth-tab active" id="tab-login"  onclick="AuthScreen.switchTab('login')">Login</div>
            <div class="auth-tab"        id="tab-signup" onclick="AuthScreen.switchTab('signup')">Sign Up</div>
          </div>

          <!-- Login Form -->
          <div class="auth-form" id="auth-login-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" type="email" id="login-email" placeholder="you@example.com"/>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input class="form-input" type="password" id="login-pass" placeholder="Enter your password"/>
            </div>
            <div style="text-align:right;margin-bottom:24px;">
              <a href="#" style="font-size:13px;color:var(--gold);text-decoration:none;">Forgot password?</a>
            </div>
            <div id="login-error" style="color:var(--danger);font-size:13px;margin-bottom:16px;display:none;text-align:center;"></div>
            <button class="btn-primary" id="login-btn" onclick="AuthScreen.submit()">Sign In →</button>
          </div>

          <!-- Signup Form -->
          <div class="auth-form" id="auth-signup-form" style="display:none;">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input class="form-input" type="text" id="signup-name" placeholder="Aditya Vikram"/>
            </div>
            <div id="lawyer-fields" style="display:none;">
              <div class="form-group">
                <label class="form-label">Bar Council ID</label>
                <input class="form-input" type="text" id="signup-barid" placeholder="MH/1234/2020"/>
              </div>
              <div class="form-group">
                <label class="form-label">Specialisation</label>
                <input class="form-input" type="text" id="signup-spec" placeholder="e.g. Labour Law, Criminal Law"/>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" type="email" id="signup-email" placeholder="you@example.com"/>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input class="form-input" type="password" id="signup-pass" placeholder="Minimum 6 characters"/>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <input class="form-input" type="password" id="signup-confirm" placeholder="Re-enter password"/>
            </div>
            <div id="signup-error" style="color:var(--danger);font-size:13px;margin-bottom:16px;display:none;text-align:center;"></div>
            <button class="btn-primary" id="signup-btn" onclick="AuthScreen.submit()">Create Account →</button>
          </div>

          <div style="padding:0 36px;">
            <div class="auth-terms">
              By continuing, you agree to our
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  function init() { tab = 'login'; role = 'user'; }

  function setRole(r) {
    role = r;
    var userCard   = document.getElementById('role-user');
    var lawyerCard = document.getElementById('role-lawyer');
    var lawyerFields = document.getElementById('lawyer-fields');

    if (r === 'user') {
      if (userCard)   { userCard.style.borderColor='var(--gold)'; userCard.style.background='rgba(245,158,11,0.1)'; userCard.querySelector('div:nth-child(2)').style.color='var(--gold)'; }
      if (lawyerCard) { lawyerCard.style.borderColor='var(--navy-border)'; lawyerCard.style.background='var(--navy-mid)'; lawyerCard.querySelector('div:nth-child(2)').style.color='var(--text-secondary)'; }
      if (lawyerFields) lawyerFields.style.display = 'none';
    } else {
      if (lawyerCard) { lawyerCard.style.borderColor='var(--gold)'; lawyerCard.style.background='rgba(245,158,11,0.1)'; lawyerCard.querySelector('div:nth-child(2)').style.color='var(--gold)'; }
      if (userCard)   { userCard.style.borderColor='var(--navy-border)'; userCard.style.background='var(--navy-mid)'; userCard.querySelector('div:nth-child(2)').style.color='var(--text-secondary)'; }
      if (lawyerFields) lawyerFields.style.display = 'block';
    }
  }

  function switchTab(t) {
    tab = t;
    document.getElementById('tab-login').classList.toggle('active',  t==='login');
    document.getElementById('tab-signup').classList.toggle('active', t==='signup');
    document.getElementById('auth-login-form').style.display  = t==='login'  ? 'block' : 'none';
    document.getElementById('auth-signup-form').style.display = t==='signup' ? 'block' : 'none';
    _clearErrors();
  }

  async function submit() {
    _clearErrors();
    if (tab === 'login') {
      var email = document.getElementById('login-email').value.trim();
      var pass  = document.getElementById('login-pass').value;
      if (!email || !pass) return _showError('login','Please fill in all fields');
      var btn = document.getElementById('login-btn');
      _setLoading(btn, true, 'Signing in…');
      try {
        // For lawyer role — redirect to lawyer dashboard with dummy session
        if (role === 'lawyer') {
          Storage.set('session', { loggedIn:true, token:'lawyer-demo-token', role:'lawyer' });
          Storage.set('user', { name:'Adv. '+email.split('@')[0], email:email, role:'lawyer', plan:'pro' });
          _navigateLawyer();
          return;
        }
        var data = await API.login(email, pass);
        _onSuccess(data);
      } catch(err) {
        if (role === 'lawyer') { _navigateLawyerLocal(email); }
        else if (err.message.includes('fetch') || err.message.includes('Failed')) { _localLogin(email); }
        else _showError('login', err.message);
      } finally { _setLoading(btn, false, 'Sign In →'); }
    } else {
      var name    = document.getElementById('signup-name').value.trim();
      var email   = document.getElementById('signup-email').value.trim();
      var pass    = document.getElementById('signup-pass').value;
      var confirm = document.getElementById('signup-confirm').value;
      if (!name||!email||!pass) return _showError('signup','Please fill in all fields');
      if (pass.length < 6)      return _showError('signup','Password must be at least 6 characters');
      if (pass !== confirm)     return _showError('signup','Passwords do not match');
      var btn = document.getElementById('signup-btn');
      _setLoading(btn, true, 'Creating account…');
      try {
        if (role === 'lawyer') { _navigateLawyerLocal(email, name); return; }
        var data = await API.signup(name, email, pass);
        _onSuccess(data);
      } catch(err) {
        if (err.message.includes('fetch') || err.message.includes('Failed')) { _localLogin(email, name); }
        else _showError('signup', err.message);
      } finally { _setLoading(btn, false, 'Create Account →'); }
    }
  }

  function _onSuccess(data) {
    Storage.set('session', { loggedIn:true, token:data.token });
    Storage.set('user', { id:data.user._id, name:data.user.name, email:data.user.email, plan:data.user.plan, role:data.user.role });
    _navigateHome();
  }

  function _localLogin(email, name) {
    var displayName = name || email.split('@')[0];
    Storage.set('session', { loggedIn:true, token:'local-dev-token' });
    Storage.set('user', { name:displayName, email, plan:'free', role:'user' });
    _navigateHome();
  }

  function _navigateLawyer() {
    // Open lawyer dashboard in new tab/window
    window.open('lawyer/index.html', '_blank');
  }

  function _navigateLawyerLocal(email, name) {
    var displayName = name || ('Adv. ' + email.split('@')[0]);
    Storage.set('session', { loggedIn:true, token:'lawyer-demo-token', role:'lawyer' });
    Storage.set('user', { name:displayName, email, plan:'pro', role:'lawyer' });
    window.open('lawyer/index.html', '_blank');
  }

  function _navigateHome() {
    Router.navigate('home');
    startLiveClock('live-time');
    Toast.show('Welcome to Advocate Saathi! 🙏');
  }

  function _showError(form, msg) { var el=document.getElementById(form+'-error'); if(el){el.textContent=msg;el.style.display='block';} }
  function _clearErrors() { ['login-error','signup-error'].forEach(function(id){var el=document.getElementById(id);if(el){el.textContent='';el.style.display='none';}}); }
  function _setLoading(btn, loading, text) { if(!btn)return; btn.disabled=loading; btn.textContent=text; btn.style.opacity=loading?'0.7':'1'; }

  return { render, init, setRole, switchTab, submit };
})();

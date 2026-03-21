// ================================================
// ADVOCATE SAATHI — LEGAL NOTICE SCREEN
// frontend/js/screens/legalnotice.js
// ================================================

const LegalNoticeScreen = (() => {

  // ── State ─────────────────────────────────────
  let state = {
    step:        'select_type', // select_type → collect_details → done
    noticeType:  null,
    category:    null,
    details:     {},
    detailStep:  0,
    isBusy:      false,
    // Track done actions — controls action bar visibility
    done: { saved: false, lawyer: false },
  };

  // ── Questions per type ─────────────────────────
  const questions = {
    labour:   [
      { key: 'company',   text: 'What is the name of the company or employer?' },
      { key: 'amount',    text: 'How much salary is pending? (in rupees)' },
      { key: 'months',    text: 'For how many months?' },
      { key: 'last_date', text: 'What was your last working date?' },
    ],
    property: [
      { key: 'landlord',    text: 'What is the name of the landlord?' },
      { key: 'address',     text: 'Address of the rented property?' },
      { key: 'amount',      text: 'What is the deposit amount? (in rupees)' },
      { key: 'vacate_date', text: 'When did you vacate the property?' },
    ],
    consumer: [
      { key: 'company', text: 'Name of the seller or company?' },
      { key: 'product', text: 'What product or service did you purchase?' },
      { key: 'amount',  text: 'Purchase amount? (in rupees)' },
      { key: 'issue',   text: 'What is the exact issue? (defective / not delivered / refund refused)' },
    ],
    cheque: [
      { key: 'drawer',      text: 'Name of the person who gave the cheque?' },
      { key: 'amount',      text: 'Cheque amount? (in rupees)' },
      { key: 'bank',        text: 'Which bank was the cheque from?' },
      { key: 'bounce_date', text: 'When did the cheque bounce?' },
    ],
    civil: [
      { key: 'party',  text: 'Name of the other party?' },
      { key: 'amount', text: 'Amount or value involved? (in rupees)' },
      { key: 'issue',  text: 'Describe the breach or dispute briefly' },
      { key: 'since',  text: 'Since when is this ongoing?' },
    ],
  };

  // ── Render ─────────────────────────────────────
  // Action bar HIDDEN by default — shown only after notice is generated
  function render() {
    return `
      <div class="screen" id="legalnotice">
        ${renderStatusBar()}

        <div class="chat-header">
          <div class="chat-back" onclick="Router.navigate('home')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </div>
          <div class="chat-info">
            <div class="chat-title">✉️ Legal Notice</div>
            <div class="chat-status" id="ln-status">Draft your notice</div>
          </div>
          <!-- Header actions: hidden until notice done -->
          <div class="chat-header-actions" id="ln-header-actions" style="display:none;">
            <div id="ln-hdr-save" class="chat-action-btn" onclick="LegalNoticeScreen.handleAction('Save')" title="Save Notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <path d="M17 21v-8H7v8M7 3v5h8"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div style="height:3px;background:var(--navy-border);flex-shrink:0;">
          <div id="ln-progress" style="height:100%;background:var(--gold);width:5%;transition:width 0.4s ease;"></div>
        </div>

        <!-- Action bar: HIDDEN until notice is fully generated -->
        <div class="action-bar" id="ln-action-bar" style="display:none;">
          <button id="ln-chip-save" class="action-chip" onclick="LegalNoticeScreen.handleAction('Save')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <path d="M17 21v-8H7v8M7 3v5h8"/>
            </svg>
            Save Notice
          </button>
          <button id="ln-chip-lawyer" class="action-chip" onclick="LegalNoticeScreen.handleAction('Find Lawyer')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Find Lawyer
          </button>
          <button class="action-chip" onclick="LegalNoticeScreen.handleAction('New Notice')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            New Notice
          </button>
        </div>

        <div class="chat-messages" id="ln-messages"></div>

        <div class="chat-input-bar">
          <div class="chat-suggestions" id="ln-suggestions"></div>
          <div class="chat-input-row">
            <textarea id="ln-input" rows="1"
              placeholder="Select a notice type above…"
              oninput="autoResizeTextarea(this)"
              onkeydown="LegalNoticeScreen.handleKeyDown(event)"></textarea>
            <button class="send-btn" onclick="LegalNoticeScreen.send()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── Show action bar after notice is done ────────
  function _showActionBar() {
    var bar = document.getElementById('ln-action-bar');
    var hdr = document.getElementById('ln-header-actions');
    if (bar) bar.style.display = 'flex';
    if (hdr) hdr.style.display = 'flex';
    _updateChips();
  }

  function _updateChips() {
    var saveChip   = document.getElementById('ln-chip-save');
    var lawyerChip = document.getElementById('ln-chip-lawyer');
    var hdrSave    = document.getElementById('ln-hdr-save');
    if (saveChip)   saveChip.style.display   = state.done.saved  ? 'none' : 'inline-flex';
    if (hdrSave)    hdrSave.style.display    = state.done.saved  ? 'none' : 'flex';
    if (lawyerChip) lawyerChip.style.display = state.done.lawyer ? 'none' : 'inline-flex';
  }

  // ── Init ────────────────────────────────────────
  function init() {
    state = {
      step:'select_type', noticeType:null, category:null,
      details:{}, detailStep:0, isBusy:false,
      done:{ saved:false, lawyer:false },
    };
    var msgs = document.getElementById('ln-messages');
    if (msgs) msgs.innerHTML = '';
    _clearSuggestions();
    _setProgress(5);

    // Hide action bar until notice done
    var bar = document.getElementById('ln-action-bar');
    var hdr = document.getElementById('ln-header-actions');
    if (bar) bar.style.display = 'none';
    if (hdr) hdr.style.display = 'none';

    setTimeout(function() {
      _addAI(
        'Namaskar! ✉️ I\'ll help you draft a professional legal notice.\n\n' +
        '<strong>What is the legal notice for?</strong>\n\nPick a type below:'
      );
      _setSuggestions([
        '💰 Unpaid Salary',
        '🏠 Security Deposit Not Returned',
        '🛒 Defective Product / Refund',
        '📄 Cheque Bounce',
        '🏗️ Property Dispute',
        '🤝 Breach of Contract',
      ]);
    }, 350);
  }

  // ── Send ────────────────────────────────────────
  function send() {
    var input = document.getElementById('ln-input');
    var text  = input ? input.value.trim() : '';
    if (!text || state.isBusy) return;
    input.value = '';
    input.style.height = 'auto';
    _clearSuggestions();
    _addUser(text);

    if      (state.step === 'select_type')     _selectType(text);
    else if (state.step === 'collect_details') _collectDetail(text);
    else _addAI('Your notice is ready above. Tap <strong>New Notice</strong> to draft another or <strong>Save Notice</strong> to save it.');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function handleAction(label) {
    if      (label === 'Save')        _saveNotice();
    else if (label === 'Find Lawyer') _showLawyers();
    else if (label === 'New Notice')  init();
  }

  function sendSuggestion(text) {
    if (state.isBusy) return;
    _clearSuggestions();
    var input = document.getElementById('ln-input');
    if (input) input.value = '';
    var t = text.toLowerCase();

    if      (state.step === 'select_type')     { _addUser(text); _selectType(text); }
    else if (state.step === 'collect_details') { _addUser(text); _collectDetail(text); }
    else if (t.includes('save'))               _saveNotice();
    else if (t.includes('lawyer'))             _showLawyers();
    else if (t.includes('new'))                init();
    else { _addUser(text); _addAI('Use the action bar above to save, find a lawyer, or start a new notice.'); }
  }

  // ── Select notice type ──────────────────────────
  function _selectType(text) {
    var t = text.toLowerCase();
    if      (t.includes('salary') || t.includes('unpaid'))                                    { state.category='labour';   state.noticeType='Unpaid Salary'; }
    else if (t.includes('deposit') || t.includes('security'))                                 { state.category='property'; state.noticeType='Security Deposit'; }
    else if (t.includes('product') || t.includes('defective') || t.includes('refund'))       { state.category='consumer'; state.noticeType='Defective Product / Refund'; }
    else if (t.includes('cheque') || t.includes('bounce'))                                    { state.category='cheque';   state.noticeType='Cheque Bounce'; }
    else if (t.includes('property') || t.includes('dispute'))                                 { state.category='civil';    state.noticeType='Property Dispute'; }
    else if (t.includes('contract') || t.includes('breach'))                                  { state.category='civil';    state.noticeType='Breach of Contract'; }
    else                                                                                       { state.category='civil';    state.noticeType=text; }

    state.step = 'collect_details';
    state.details = {};
    state.detailStep = 0;
    _setProgress(20);

    _addAI('Got it! I\'ll draft a <strong style="color:var(--gold);">' + escapeHTML(state.noticeType) + '</strong> legal notice.\n\nI need a few details to personalise it:');
    setTimeout(function() { _askDetail(); }, 500);
  }

  // ── Detail questions ────────────────────────────
  function _askDetail() {
    var qs = questions[state.category] || questions.civil;
    var q  = qs[state.detailStep];
    if (!q) { _generateNotice(); return; }

    var progress = 20 + Math.round(((state.detailStep + 1) / qs.length) * 50);
    _setProgress(progress);
    _addAI('<span style="color:var(--text-muted);font-size:12px;">Detail ' + (state.detailStep+1) + ' of ' + qs.length + '</span>\n\n' + q.text);
  }

  function _collectDetail(answer) {
    var qs = questions[state.category] || questions.civil;
    var q  = qs[state.detailStep];
    if (q) state.details[q.key] = answer;
    state.detailStep++;
    if (state.detailStep < qs.length) _askDetail();
    else _generateNotice();
  }

  // ── Generate notice ─────────────────────────────
  function _generateNotice() {
    state.step   = 'done';
    state.isBusy = true;
    _setStatus('Generating notice…');
    _showTyping();
    _setProgress(90);

    setTimeout(function() {
      _removeTyping();
      _setStatus('Notice ready ✓');
      _setProgress(100);
      state.isBusy = false;

      var user     = Storage.get('user') || {};
      var d        = state.details;
      var date     = new Date().toLocaleDateString('en-IN');
      var deadline = new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-IN');

      _addAI(
        '<strong>✉️ Legal Notice — Ready to Send</strong>\n\n' +
        '<div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:12px;padding:18px;margin-top:10px;font-size:12px;line-height:2;color:var(--text-secondary);">' +
        '<div style="text-align:right;color:var(--text-primary);margin-bottom:16px;font-weight:600;">Date: ' + date + '</div>' +
        '<strong style="color:var(--gold);">FROM:</strong><br>' +
        escapeHTML(user.name || '[Your Full Name]') + '<br>[Your Complete Address]<br>Mobile: [Your Phone]<br>' +
        'Email: ' + escapeHTML(user.email || '[Your Email]') + '<br><br>' +
        '<strong style="color:var(--gold);">TO:</strong><br>' +
        escapeHTML(d.company||d.landlord||d.drawer||d.party||'[Receiver Name]') + '<br>[Their Complete Address]<br><br>' +
        '<div style="border-top:1px solid var(--navy-border);padding-top:12px;">' +
        '<strong style="color:var(--text-primary);">SUBJECT: Legal Notice under ' + _getLaws() + '</strong><br><br>' +
        'Dear Sir/Madam,<br><br>' + _buildBody(d, user) + '<br><br>' +
        'You are hereby called upon to comply within <strong style="color:var(--gold);">30 days</strong> ' +
        'i.e., on or before <strong style="color:var(--gold);">' + deadline + '</strong>, ' +
        'failing which I shall initiate legal proceedings at your risk and cost.<br><br>' +
        'Yours faithfully,<br><strong style="color:var(--text-primary);">' + escapeHTML(user.name||'[Your Name]') + '</strong><br>Date: ' + date +
        '</div></div>'
      );

      setTimeout(function() {
        _addAI(
          '<strong>📮 How to Send:</strong><br><br>' +
          '• Fill in <span style="color:var(--gold)">[brackets]</span> with your actual details<br>' +
          '• Print 2 copies — one to send, one to keep<br>' +
          '• Sign at the bottom<br>' +
          '• Send via <strong>Registered Post with AD</strong> from any post office<br>' +
          '• Keep the postal receipt safely as proof<br><br>' +
          '<strong>⏰ If no reply in 30 days:</strong> File case in ' + _getCourtName()
        );

        // Show action bar NOW — notice is complete
        _showActionBar();

        // Suggestion chips — only undone actions
        setTimeout(function() {
          var s = [];
          if (!state.done.saved)  s.push('Save This Notice');
          if (!state.done.lawyer) s.push('Find Lawyer');
          s.push('New Notice');
          _setSuggestions(s);
        }, 400);
      }, 700);
    }, 1500);
  }

  // ── Save notice to MongoDB ───────────────────────
  async function _saveNotice() {
    var user = Storage.get('user');
    if (!user) { Toast.show('Please login to save'); return; }
    if (state.step !== 'done') { Toast.show('Please complete the notice first'); return; }

    // Hide save chip immediately
    state.done.saved = true;
    _updateChips();

    Toast.show('Saving notice...');
    try {
      await API.createNotice({
        title:      (state.noticeType || 'Legal Notice') + ' — ' + new Date().toLocaleDateString('en-IN'),
        noticeType: state.noticeType || 'Legal Notice',
        category:   state.category   || 'civil',
        details:    state.details    || {},
      });
      Toast.show('Notice saved ✓');
      _addAI('✅ Notice saved to your account! You can view it in <strong>Profile → My Legal Notices</strong>.');

      // Refresh suggestion chips
      setTimeout(function() {
        var s = [];
        if (!state.done.lawyer) s.push('Find Lawyer');
        s.push('New Notice');
        _setSuggestions(s);
      }, 500);
    } catch (err) {
      // Revert if failed
      state.done.saved = false;
      _updateChips();
      console.warn('Notice save failed:', err.message);
      Toast.show('Could not save. Check your connection.');
    }
  }

  // ── Find Lawyers ─────────────────────────────────
  async function _showLawyers() {
    if (state.step !== 'done') { Toast.show('Please complete the notice first'); return; }

    // Hide lawyer chip immediately
    state.done.lawyer = true;
    _updateChips();

    _showTyping();
    try {
      var result;
      try { result = await API.findLawyers(state.category || 'civil'); }
      catch(e) { result = { lawyers: _dummyLawyers() }; }
      _removeTyping();

      var lawyers = (result.lawyers || []).slice(0, 3);
      if (!lawyers.length) { _addAI('No lawyers found. Try the Bar Council India website.'); return; }

      var html = lawyers.map(function(l) {
        var lawyerData = JSON.stringify({
          name: l.name, specialisation: state.noticeType || '',
          city: (l.location&&l.location.city)||'', state: (l.location&&l.location.state)||'',
          consultationFee: l.consultationFee||0, experience: l.experience||0,
          averageRating: l.averageRating||4.0, lawyerId: l._id||'',
        }).replace(/'/g, '&apos;');

        return '<div style="border:1px solid var(--navy-border);border-radius:12px;padding:14px;margin-top:10px;background:var(--navy-mid);">' +
          '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;">' +
          '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dim));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--navy-deep);">' + l.name.charAt(0) + '</div>' +
          '<div><div style="font-weight:700;font-size:14px;">' + escapeHTML(l.name) + '</div>' +
          '<div style="font-size:11px;color:var(--gold);">⭐ ' + (l.averageRating||4.0) + ' · ' + l.experience + ' yrs exp</div></div></div>' +
          '<div style="font-size:12px;color:var(--text-secondary);">📍 ' + escapeHTML((l.location&&l.location.city)||'') + ', ' + escapeHTML((l.location&&l.location.state)||'') + '</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">💰 ' + (l.consultationFee===0?'Free first consultation':'₹'+l.consultationFee+' fee') + '</div>' +
          '<button onclick="LegalNoticeScreen.bookConsultation(\'' + lawyerData + '\')" ' +
          'style="margin-top:10px;width:100%;padding:8px;background:linear-gradient(135deg,var(--gold),var(--gold-dim));border:none;border-radius:8px;font-family:var(--font-body);font-size:12px;font-weight:700;color:var(--navy-deep);cursor:pointer;">📅 Book Consultation</button>' +
          '</div>';
      }).join('');

      _addAI('Recommended lawyers for <strong>' + escapeHTML(state.noticeType||'your notice') + '</strong>:' + html);

      // Refresh chips — lawyer is done
      setTimeout(function() {
        var s = [];
        if (!state.done.saved) s.push('Save This Notice');
        s.push('New Notice');
        _setSuggestions(s);
      }, 400);

    } catch(err) {
      state.done.lawyer = false;
      _updateChips();
      _removeTyping();
      _addAI('Could not load lawyers. Please try again.');
    }
  }

  // ── Book Consultation ────────────────────────────
  async function bookConsultation(lawyerJsonStr) {
    var user = Storage.get('user');
    if (!user) { Toast.show('Please login'); return; }
    var lawyer;
    try { lawyer = JSON.parse(lawyerJsonStr); } catch(e) { Toast.show('Error'); return; }

    Toast.show('Booking consultation...');
    try {
      await API.createConsultation({
        lawyer, caseId: null, caseCategory: state.category || 'civil',
        caseTitle: (state.noticeType || 'Legal Notice') + ' — ' + new Date().toLocaleDateString('en-IN'),
        notes: 'Requested from Legal Notice screen',
      });
      Toast.show('Consultation booked ✓');
      _addAI('✅ Consultation with <strong>' + escapeHTML(lawyer.name) + '</strong> booked! View it in <strong>Profile → My Consultations</strong>.');
    } catch(err) {
      Toast.show('Could not book. Check your connection.');
    }
  }

  // ── Notice body builders ─────────────────────────
  function _buildBody(d, user) {
    var name = escapeHTML(user.name || '[Your Name]');
    var bodies = {
      labour:   'I, ' + name + ', was employed at <strong style="color:var(--text-primary);">' + escapeHTML(d.company||'[Company]') + '</strong>. My salary of <strong style="color:var(--text-primary);">₹' + escapeHTML(d.amount||'[Amount]') + '</strong> for <strong style="color:var(--text-primary);">' + escapeHTML(d.months||'[X]') + ' months</strong> remains unpaid. Last working date: <strong style="color:var(--text-primary);">' + escapeHTML(d.last_date||'[Date]') + '</strong>. I demand immediate payment under Payment of Wages Act, 1936.',
      property: 'I vacated <strong style="color:var(--text-primary);">' + escapeHTML(d.address||'[Address]') + '</strong> on <strong style="color:var(--text-primary);">' + escapeHTML(d.vacate_date||'[Date]') + '</strong>. Security deposit of <strong style="color:var(--text-primary);">₹' + escapeHTML(d.amount||'[Amount]') + '</strong> has not been returned. I demand immediate return of the full deposit.',
      consumer: 'I purchased <strong style="color:var(--text-primary);">' + escapeHTML(d.product||'[Product]') + '</strong> worth <strong style="color:var(--text-primary);">₹' + escapeHTML(d.amount||'[Amount]') + '</strong>. Issue: <strong style="color:var(--text-primary);">' + escapeHTML(d.issue||'defective') + '</strong>. I demand full refund under Consumer Protection Act, 2019.',
      cheque:   'You issued a cheque of <strong style="color:var(--text-primary);">₹' + escapeHTML(d.amount||'[Amount]') + '</strong> drawn on <strong style="color:var(--text-primary);">' + escapeHTML(d.bank||'[Bank]') + '</strong>, dishonoured on <strong style="color:var(--text-primary);">' + escapeHTML(d.bounce_date||'[Date]') + '</strong>. This is an offence under NI Act Section 138. I demand payment within 15 days.',
      civil:    'You entered into an agreement regarding <strong style="color:var(--text-primary);">' + escapeHTML(d.issue||'[matter]') + '</strong> involving ₹' + escapeHTML(d.amount||'[Amount]') + ' since <strong style="color:var(--text-primary);">' + escapeHTML(d.since||'[Date]') + '</strong>. You have failed to honour the terms. I demand immediate compliance.',
    };
    return bodies[state.category] || bodies.civil;
  }

  function _getLaws() {
    var l = { labour:'Payment of Wages Act 1936 & IPC 406', property:'Transfer of Property Act 1882 & IPC 406', consumer:'Consumer Protection Act 2019', cheque:'Negotiable Instruments Act 1881 — Section 138', civil:'Indian Contract Act 1872' };
    return l[state.category] || 'Indian Contract Act 1872';
  }

  function _getCourtName() {
    var c = { labour:'Labour Court', property:'Civil Court / Rent Control Court', consumer:'District Consumer Forum', cheque:'Magistrate Court (NI Act S.138)', civil:'Civil Court' };
    return c[state.category] || 'Civil Court';
  }

  function _dummyLawyers() {
    return [
      { name:'Adv. Rajesh Sharma', averageRating:4.5, experience:12, location:{city:'Delhi',      state:'Delhi'},       consultationFee:500  },
      { name:'Adv. Priya Nair',    averageRating:4.8, experience:8,  location:{city:'Bangalore',  state:'Karnataka'},   consultationFee:1000 },
      { name:'Adv. Suresh Patel',  averageRating:4.3, experience:15, location:{city:'Mumbai',     state:'Maharashtra'}, consultationFee:0    },
    ];
  }

  // ── DOM helpers ───────────────────────────────────
  function _addUser(text) {
    var u = Storage.get('user');
    _append(buildUserBubble(text, getInitials((u&&u.name)||'AV')));
  }
  function _addAI(text) {
    _removeTyping();
    _append(
      '<div class="msg-row ai"><div class="msg-avatar ai">✉</div><div>' +
      '<div class="msg-bubble">' + text.replace(/\n/g,'<br>') + '</div>' +
      '<div class="msg-time">' + getTimeString() + '</div>' +
      '</div></div>'
    );
  }
  function _append(html)      { var m=document.getElementById('ln-messages'); if(!m)return; m.insertAdjacentHTML('beforeend',html); m.scrollTop=m.scrollHeight; }
  function _showTyping()      { if(document.getElementById('typing-row'))return; _append(buildTypingIndicator()); var m=document.getElementById('ln-messages'); if(m)m.scrollTop=99999; }
  function _removeTyping()    { var e=document.getElementById('typing-row'); if(e)e.remove(); }
  function _setStatus(t)      { var e=document.getElementById('ln-status');   if(e)e.textContent=t; }
  function _setProgress(p)    { var e=document.getElementById('ln-progress'); if(e)e.style.width=p+'%'; }
  function _setSuggestions(chips) {
    var e=document.getElementById('ln-suggestions'); if(!e)return;
    e.innerHTML=chips.map(function(c){
      return '<button class="suggestion-chip" onclick="LegalNoticeScreen.sendSuggestion(\''+c.replace(/'/g,"\\'")+'\')">' + c + '</button>';
    }).join('');
  }
  function _clearSuggestions(){ var e=document.getElementById('ln-suggestions'); if(e)e.innerHTML=''; }

  return { render, init, send, sendSuggestion, handleKeyDown, handleAction, bookConsultation };

})();

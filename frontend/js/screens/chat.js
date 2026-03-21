// ================================================
// ADVOCATE SAATHI — GENERAL CHAT SCREEN
// frontend/js/screens/chat.js
//
// Fix 1: Action bar hidden until chat is complete
// Fix 2: Full conversation saved to MongoDB and
//        replayed when opened from History
// ================================================

const ChatScreen = (() => {

  let state = {
    step:          'describe',
    category:      null,
    caseId:        null,
    caseTitle:     '',
    confidence:    0,
    followUpQs:    [],
    currentQIndex: 0,
    answers:       {},
    firApplicable: false,
    isBusy:        false,
    messages:      [],
    done: { saved:false, rights:false, lawyers:false, fir:false },
  };

  const categoryQuestions = {
    labour: [
      'Do you have a written offer letter or employment contract?',
      'How many months of salary is pending?',
      'Did your employer give any written reason for non-payment?',
      'Are you still employed or have you resigned / been terminated?',
      'Does your company have more than 10 employees?',
    ],
    criminal: [
      'Did this incident happen recently (within last 3 years)?',
      'Do you have any witnesses to the incident?',
      'Do you have any evidence such as photos, videos, or messages?',
      'Have you already approached the police or filed an FIR?',
      'Do you know the identity of the accused person?',
    ],
    consumer: [
      'Do you have the purchase receipt or invoice?',
      'Did you contact the seller or company before this?',
      'What was the seller\'s response to your complaint?',
      'What is the total value of goods or services involved? (in rupees)',
      'When did you make the purchase?',
    ],
    property: [
      'Do you have a signed rental or sale agreement?',
      'How long ago did this dispute start?',
      'What is the approximate value involved? (in rupees)',
      'Did the other party give any written communication?',
      'Is the other party a private individual or a company?',
    ],
    family: [
      'Is this about divorce, maintenance, custody, or domestic violence?',
      'Are there children involved in this matter?',
      'How long have you been married?',
      'Is there any physical or mental abuse involved?',
      'Have you already consulted a lawyer or approached any authority?',
    ],
    cyber: [
      'When did this incident happen?',
      'How much money was lost? (in rupees)',
      'Do you have screenshots or transaction IDs as evidence?',
      'Did you receive any suspicious call, link, or message before this?',
      'Have you already contacted your bank about this?',
    ],
  };

  const categoryLabels = {
    labour:   'Labour Law',
    criminal: 'Criminal Law',
    consumer: 'Consumer Rights',
    property: 'Property Law',
    family:   'Family Law',
    cyber:    'Cyber Crime',
    civil:    'Civil Law',
  };

  // ── Render ─────────────────────────────────────
  // Action bar is hidden by default — shown only when
  // guidance is complete (step === 'guidance')
  function render() {
    return `
      <div class="screen" id="chat">
        ${renderStatusBar()}
        <div class="chat-header">
          <div class="chat-back" onclick="Router.navigate('home')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </div>
          <div class="chat-info">
            <div class="chat-title" id="chat-title">Legal Assistant</div>
            <div class="chat-status" id="chat-status-text">AI Active</div>
          </div>
          <div class="chat-header-actions" id="chat-header-actions" style="display:none;">
            <div id="hdr-save" class="chat-action-btn" onclick="ChatScreen.handleAction('Save Case')" title="Save Case">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
            </div>
            <div id="hdr-fir" class="chat-action-btn" onclick="ChatScreen.handleAction('FIR Draft')" title="FIR Draft">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            </div>
          </div>
        </div>

        <!-- Action bar: hidden until guidance complete -->
        <div class="action-bar" id="chat-action-bar" style="display:none;">
          <button class="action-chip" id="chip-save" onclick="ChatScreen.handleAction('Save Case')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
            Save Case
          </button>
          <button class="action-chip" id="chip-fir" onclick="ChatScreen.handleAction('FIR Draft')" style="display:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
            FIR Draft
          </button>
          <button class="action-chip" id="chip-rights" onclick="ChatScreen.handleAction('My Rights')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            My Rights
          </button>
          <button class="action-chip" id="chip-lawyer" onclick="ChatScreen.handleAction('Find Lawyer')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            Find Lawyer
          </button>
          <button class="action-chip" onclick="ChatScreen.handleAction('New Case')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            New Case
          </button>
        </div>

        <div class="chat-messages" id="chat-messages"></div>

        <div class="chat-input-bar">
          <div class="chat-suggestions" id="chat-suggestions"></div>
          <div class="chat-input-row">
            <textarea id="chat-input" rows="1"
              placeholder="Describe your legal problem…"
              oninput="autoResizeTextarea(this)"
              onkeydown="ChatScreen.handleKeyDown(event)"></textarea>
            <button class="send-btn" onclick="ChatScreen.send()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── Show action bar — smart: hides already-done chips ──
  function _showActionBar() {
    var bar = document.getElementById('chat-action-bar');
    var hdr = document.getElementById('chat-header-actions');
    if (bar) bar.style.display = 'flex';
    if (hdr) hdr.style.display = 'flex';

    // Guarantee done exists
    if (!state.done) state.done = { saved:false, rights:false, lawyers:false, fir:false };
    var done = state.done;

    // ── Bottom action bar chips ──────────────────
    var chipSave   = document.getElementById('chip-save');
    var chipFir    = document.getElementById('chip-fir');
    var chipRights = document.getElementById('chip-rights');
    var chipLawyer = document.getElementById('chip-lawyer');

    // ── Header icon buttons ──────────────────────
    var hdrSave = document.getElementById('hdr-save');
    var hdrFir  = document.getElementById('hdr-fir');

    // Save Case: HIDE if already saved (history case or just saved)
    var showSave = !done.saved;
    if (chipSave) chipSave.style.display = showSave ? 'inline-flex' : 'none';
    if (hdrSave)  hdrSave.style.display  = showSave ? 'flex' : 'none';

    // FIR Draft: show only if FIR is applicable AND not yet done
    var showFir = state.firApplicable && !done.fir;
    if (chipFir) chipFir.style.display = showFir ? 'inline-flex' : 'none';
    if (hdrFir)  hdrFir.style.display  = showFir ? 'flex' : 'none';

    // Know My Rights: hide if already viewed
    if (chipRights) chipRights.style.display = done.rights  ? 'none' : 'inline-flex';

    // Find Lawyer: hide if already found
    if (chipLawyer) chipLawyer.style.display = done.lawyers ? 'none' : 'inline-flex';
  }

  // ── Init ──────────────────────────────────────
  function init() {
    state = {
      step:'describe', category:null, caseId:null, caseTitle:'',
      confidence:0, followUpQs:[], currentQIndex:0, answers:{},
      firApplicable:false, isBusy:false, messages:[],
      done:{ saved:false, rights:false, lawyers:false, fir:false },
    };
    var msgs = document.getElementById('chat-messages');
    if (msgs) msgs.innerHTML = '';
    _clearSuggestions();
    _setChatTitle('Legal Assistant');
    // Hide action bar on reset
    var bar = document.getElementById('chat-action-bar');
    var hdr = document.getElementById('chat-header-actions');
    if (bar) bar.style.display = 'none';
    if (hdr) hdr.style.display = 'none';
  }

  // ── Open Fresh ────────────────────────────────
  function openFresh() {
    init();
    window._chatManagedNav = true;  // we already called init()
    Router.navigate('chat');
    setTimeout(function() {
      _addAI("Namaskar! 🙏 I'm your Advocate Saathi legal assistant.\n\nPlease <strong>describe your legal problem</strong> in detail — I'll identify the case type, ask a few questions, and guide you with exact next steps.");
      _setPlaceholder('Describe your legal problem…');
    }, 350);
  }

  // ── Open With Query ───────────────────────────
  function openWithQuery(query) {
    state = {
      step:'describe', category:null, caseId:null, caseTitle:'',
      confidence:0, followUpQs:[], currentQIndex:0, answers:{},
      firApplicable:false, isBusy:false, messages:[],
      done:{ saved:false, rights:false, lawyers:false, fir:false },
    };
    window._chatManagedNav = true;  // skip app.js init()
    Router.navigate('chat');
    setTimeout(function() {
      var msgs = document.getElementById('chat-messages');
      if (msgs) msgs.innerHTML = '';
      _clearSuggestions();
      _setChatTitle('Legal Assistant');
      var bar = document.getElementById('chat-action-bar');
      var hdr = document.getElementById('chat-header-actions');
      if (bar) bar.style.display = 'none';
      if (hdr) hdr.style.display = 'none';
      _addUser(query);
      setTimeout(function() { _step1_classify(query); }, 500);
    }, 350);
  }

  // ── Open Category — skip classification ───────
  function openCategory(category) {
    state = {
      step:'questions', category:category, caseId:null, caseTitle:'',
      confidence:1, followUpQs: categoryQuestions[category] || [],
      currentQIndex:0, answers:{},
      firApplicable:false, isBusy:false, messages:[],
      done:{ saved:false, rights:false, lawyers:false, fir:false },
    };
    window._chatManagedNav = true;  // skip app.js init()
    Router.navigate('chat');
    setTimeout(function() {
      var msgs = document.getElementById('chat-messages');
      if (msgs) msgs.innerHTML = '';
      _clearSuggestions();
      var bar = document.getElementById('chat-action-bar');
      var hdr = document.getElementById('chat-header-actions');
      if (bar) bar.style.display = 'none';
      if (hdr) hdr.style.display = 'none';

      var label = categoryLabels[category] || 'Legal';
      _setChatTitle(label);
      _setStatus('AI Active');
      _addAI(
        'Namaskar! 🙏 I\'ll help you with your <strong style="color:var(--gold);">' + label + '</strong> matter.\n\n' +
        'I need to ask you a few quick questions to understand your situation and give you the most accurate guidance.'
      );
      setTimeout(function() { _askNextQuestion(); }, 700);
    }, 350);
  }

  // ── Replay saved conversation from History ────
  // Replays entire message history exactly as it happened
  function openFromHistory(savedCase) {
    var msgs_arr = savedCase.messages || [];

    // Detect done actions by scanning saved assistant messages
    // Use very specific strings that only appear in those responses
    var assistantText = msgs_arr
      .filter(function(m){ return m.role === 'assistant'; })
      .map(function(m){ return (m.content||'').toLowerCase(); })
      .join(' ');

    // Detection: look for unique strings only present in those specific responses
    // These match what _addAI pushes to state.messages (lowercased for comparison)
    var rightsAlready = assistantText.indexOf('your legal rights') >= 0;
    var lawyerAlready = assistantText.indexOf('lawyers</strong>') >= 0
                     || assistantText.indexOf('book consultation') >= 0;
    var firAlready    = assistantText.indexOf('station house officer') >= 0
                     || assistantText.indexOf('fir draft template') >= 0;

    state = {
      step:          'guidance',
      category:      savedCase.category      || null,
      caseId:        savedCase._id           || null,
      caseTitle:     savedCase.title         || '',
      confidence:    1,
      followUpQs:    [],
      currentQIndex: 0,
      answers:       savedCase.answers       || {},
      firApplicable: savedCase.firApplicable || false,
      isBusy:        false,
      messages:      msgs_arr,
      done: {
        saved:   true,           // always true — case IS already saved
        rights:  rightsAlready,
        lawyers: lawyerAlready,
        fir:     firAlready,
      },
    };

    window._chatManagedNav = true;  // CRITICAL: skip app.js init() — would reset done
    Router.navigate('chat');

    setTimeout(function() {
      var msgs = document.getElementById('chat-messages');
      if (msgs) msgs.innerHTML = '';
      _clearSuggestions();
      var label = categoryLabels[savedCase.category] || 'Legal';
      _setChatTitle(label);
      _setStatus('Saved Case');

      if (!msgs_arr || msgs_arr.length === 0) {
        _noMsgReplayAI('This is your saved <strong style="color:var(--gold);">' + label + '</strong> case. Use the action bar to continue.');
      } else {
        msgs_arr.forEach(function(msg) {
          if (msg.role === 'user') _replayUser(msg.content);
          else _replayAI(msg.content);
        });
      }
      _showActionBar();
    }, 350);
  }

  // ── Send ──────────────────────────────────────
  function send() {
    var input = document.getElementById('chat-input');
    var text  = input ? input.value.trim() : '';
    if (!text || state.isBusy) return;
    input.value = '';
    input.style.height = 'auto';
    _clearSuggestions();
    _addUser(text);
    if      (state.step === 'describe')  _step1_classify(text);
    else if (state.step === 'questions') _step2_answer(text);
    else _addAI("Tap <strong>New Case</strong> to start over or use the action bar above.");
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function handleAction(label) {
    if      (label === 'Save Case')   _saveCase();
    else if (label === 'FIR Draft')   { if (!state.firApplicable) { Toast.show('FIR not applicable for your case'); return; } _showFIRDraft(); }
    else if (label === 'My Rights')   _showRights();
    else if (label === 'Find Lawyer') _showLawyers();
    else if (label === 'New Case')    { init(); openFresh(); }
  }

  function sendSuggestion(text) {
    if (state.isBusy) return;
    _clearSuggestions();
    var input = document.getElementById('chat-input');
    if (input) input.value = '';
    _addUser(text);
    var t = text.toLowerCase();
    if      (state.step === 'describe')  _step1_classify(text);
    else if (state.step === 'questions') _step2_answer(text);
    else if (t.includes('generate fir') || t.includes('fir draft')) { if (!state.firApplicable) { Toast.show('FIR not applicable'); return; } _showFIRDraft(); }
    else if (t.includes('rights') || t.includes('know my')) _showRights();
    else if (t.includes('lawyer'))       _showLawyers();
    else if (t.includes('save'))         _saveCase();
    else if (t.includes('new case'))     { init(); openFresh(); }
    else _addAI("Got it! Use the action bar above or type your question.");
  }

  // ════════════════════════════════════════════
  // STEP 1 — CLASSIFY
  // ════════════════════════════════════════════
  async function _step1_classify(text) {
    state.isBusy = true;
    _showTyping();
    _setStatus('Analysing your problem…');
    try {
      var result;
      try { result = await API.classifyCase(text); }
      catch(e) { result = FallbackResponses.classify(text); }

      state.category      = result.category;
      state.confidence    = result.confidence;
      state.followUpQs    = result.followUpQuestions || [];
      state.currentQIndex = 0;
      state.step          = 'questions';
      state.isBusy        = false;
      _removeTyping();
      _setStatus('AI Active');
      _setChatTitle(categoryLabels[state.category] || 'Legal Assistant');

      var pct = Math.round(state.confidence * 100);
      var msg = 'I\'ve identified this as a <strong style="color:var(--gold)">' + (categoryLabels[state.category]||'Legal') + ' case</strong> (' + pct + '% confidence).\n\nI need to ask you a few quick questions to give you accurate guidance.';
      _addAI(msg);
      setTimeout(function() { _askNextQuestion(); }, 600);
    } catch(err) {
      state.isBusy = false;
      _removeTyping();
      _addAI('Sorry, I had trouble analysing your problem. Please try again.');
    }
  }

  // ════════════════════════════════════════════
  // STEP 2 — QUESTIONS
  // ════════════════════════════════════════════
  function _step2_answer(answer) {
    state.answers['q' + state.currentQIndex] = answer;
    state.currentQIndex++;
    if (state.currentQIndex < state.followUpQs.length) _askNextQuestion();
    else _step3_firCheck();
  }

  function _askNextQuestion() {
    var q = state.followUpQs[state.currentQIndex];
    if (!q) { _step3_firCheck(); return; }
    var msg = '<span style="color:var(--text-muted);font-size:12px;">Question ' + (state.currentQIndex+1) + ' of ' + state.followUpQs.length + '</span>\n\n' + q;
    _addAI(msg);
    _setPlaceholder('Type your answer…');
    var lower = q.toLowerCase();
    if (lower.includes('do you have') || lower.includes('have you') || lower.includes('is there') || lower.includes('are there') || lower.includes('is this about')) {
      _setSuggestions(['Yes', 'No', 'Not sure']);
    } else { _clearSuggestions(); }
  }

  // ════════════════════════════════════════════
  // STEP 3 — FIR CHECK + GUIDANCE
  // ════════════════════════════════════════════
  async function _step3_firCheck() {
    state.isBusy = true;
    state.step   = 'guidance';
    _showTyping();
    _setStatus('Checking FIR applicability…');
    try {
      var firResult, guidanceResult;
      try {
        firResult      = await API.checkFIR(state.category, state.answers);
        guidanceResult = await API.getGuidance(state.category, firResult.firApplicable, state.answers);
      } catch(e) {
        firResult      = FallbackResponses.firCheck(state.category);
        guidanceResult = FallbackResponses.guidance(state.category, firResult.firApplicable);
      }

      state.firApplicable = firResult.firApplicable;
      state.isBusy        = false;
      _removeTyping();
      _setStatus('Analysis complete');

      var firIcon  = firResult.firApplicable ? '🚨' : '⚖️';
      var firColor = firResult.firApplicable ? 'var(--danger)' : 'var(--success)';
      var firMsg   = firIcon + ' <strong style="color:' + firColor + '">FIR ' + (firResult.firApplicable ? 'IS' : 'is NOT') + ' applicable</strong>\n\n' + firResult.reason + '\n\n<strong>Recommended Authority:</strong> ' + firResult.recommendedAuthority;
      _addAI(firMsg);

      setTimeout(function() {
        var planCard = {
          title: (categoryLabels[state.category]||'Legal') + ' – Action Plan',
          sections: [
            { heading: '📋 Applicable Laws',   items: guidanceResult.laws },
            { heading: '👣 Steps to Take',      items: guidanceResult.steps },
            { heading: '📁 Documents Required', items: guidanceResult.documents },
          ]
        };
        _addAI('Here is your complete legal action plan:', planCard);

        if (guidanceResult.helplineNumbers && guidanceResult.helplineNumbers.length) {
          var ht = guidanceResult.helplineNumbers.map(function(h) { return '• ' + h.name + ': <strong style="color:var(--gold)">' + h.number + '</strong>'; }).join('\n');
          setTimeout(function() { _addAI('📞 <strong>Important Helplines</strong>\n\n' + ht); }, 800);
        }

        setTimeout(function() {
          _addAI('Your analysis is complete. Use the action bar above to save this case, generate an FIR draft, know your rights, or find a lawyer.');

          // Show action bar NOW that guidance is complete
          _showActionBar();

          // Suggestion chips — only show not-yet-done actions
          var s = [];
          if (state.firApplicable && !(state.done && state.done.fir)) s.push('Generate FIR Draft');
          if (!(state.done && state.done.rights))  s.push('Know My Rights');
          if (!(state.done && state.done.lawyers)) s.push('Find Lawyer');
          if (!(state.done && state.done.saved))   s.push('Save This Case');
          _setSuggestions(s);

        }, 1600);
      }, 800);

    } catch(err) {
      state.isBusy = false;
      _removeTyping();
      _addAI('Something went wrong. Please try again.');
    }
  }

  // ════════════════════════════════════════════
  // FIR DRAFT
  // ════════════════════════════════════════════
  function _showFIRDraft() {
    if (!state.done) state.done = {};
    state.done.fir = true;
    var c = document.getElementById('chip-fir');
    if (c) c.style.display = 'none';
    var hf2 = document.getElementById('hdr-fir');
    if (hf2) hf2.style.display = 'none';
    var user = Storage.get('user') || {};
    var msg  =
      '<strong>📋 FIR Draft Template</strong>\n\nHere is your pre-filled FIR draft. Carry this when visiting the police station.\n\n' +
      '<div style="background:var(--navy-mid);border:1px solid var(--navy-border);border-radius:12px;padding:16px;margin-top:10px;font-size:12px;line-height:1.8;color:var(--text-secondary);">' +
      '<div style="color:var(--gold);font-weight:700;margin-bottom:12px;">TO,<br>The Station House Officer,<br>[Your nearest police station name]<br>[City, State]</div>' +
      '<strong style="color:var(--text-primary);">SUBJECT: Complaint for FIR under ' + _getCategoryLaws(state.category) + '</strong><br><br>' +
      'Respected Sir/Madam,<br><br>I, <strong style="color:var(--text-primary);">' + escapeHTML(user.name||'[Your Full Name]') + '</strong>, residing at [Your Full Address], contact: [Your Phone], wish to lodge a complaint against the accused.<br><br>' +
      '<strong style="color:var(--text-primary);">FACTS:</strong><br>' + _getDraftFacts(state.category, state.answers) + '<br><br>' +
      'I request you to register an FIR and take appropriate legal action.<br><br>' +
      'Thanking you,<br><strong style="color:var(--text-primary);">' + escapeHTML(user.name||'[Your Name]') + '</strong><br>Date: ' + new Date().toLocaleDateString('en-IN') + '</div>';
    _addAI(msg);
    var tips = '• Fill in <span style="color:var(--gold)">[brackets]</span> with your details<br>• Carry 2 printed copies<br>• Police MUST give you a signed copy with FIR number<br>• If police refuses → Magistrate under CrPC 156(3)';
    setTimeout(function() {
      _addAI(tips);
      // Mark FIR as done so chip hides
      if (!state.done) state.done = {};
      state.done.fir = true;
      var fc = document.getElementById('chip-fir');
      if (fc) fc.style.display = 'none';
      var hf = document.getElementById('hdr-fir');
      if (hf) hf.style.display = 'none';
    }, 600);
  }

  // ════════════════════════════════════════════
  // KNOW YOUR RIGHTS
  // ════════════════════════════════════════════
  function _showRights() {
    if (!state.done) state.done = {};
    state.done.rights = true;
    var c = document.getElementById('chip-rights');
    if (c) c.style.display = 'none';
    var rights = {
      labour:   ['Employer CANNOT withhold salary under Payment of Wages Act','Right to written termination letter','PF must be deposited — check epfindia.gov.in','Claim compensation up to 15 days salary per year','Labour Commissioner MUST respond within 45 days'],
      cyber:    ['Bank liable to refund if fraud due to their system failure','File Zero FIR at ANY police station','Cyber crime complaint acknowledged within 24 hours','Bank must respond to fraud dispute within 10 days (RBI)','Approach RBI Ombudsman if bank ignores complaint'],
      consumer: ['Right to full refund for defective goods under CPA 2019','E-commerce cannot refuse return within window','Consumer forum fee only Rs 100-200','Claim compensation for mental harassment','Company must respond to notice within 30 days'],
      property: ['Landlord MUST return deposit within 30-60 days','Can only deduct for actual damages with receipts','Verbal eviction NOT valid — must be written','Right to remain until court eviction order','Landlord entering without notice is trespass'],
      family:   ['Woman has right to reside in matrimonial home under DV Act','Maintenance can be claimed before divorce finalised','Child custody — court prioritises best interest of child','Dowry demand is criminal offence under IPC 498A','File complaint at any station under Zero FIR rule'],
      criminal: ['Police CANNOT refuse FIR for cognizable offences','Right to free copy of FIR immediately','File Zero FIR at ANY police station','If refused → Magistrate under CrPC 156(3)','Right to know investigating officer name and badge'],
      civil:    ['Limitation period for civil suits: 3 years','Legal notice must be replied within 30 days','Right to request documents from opposing party','Court can grant interim injunction','Mediation and arbitration are faster alternatives'],
    };
    var list = (rights[state.category] || rights.criminal)
      .map(function(r, i) { return '<div style="display:flex;gap:10px;margin-bottom:8px;"><span style="color:var(--gold);font-weight:700;flex-shrink:0;">' + (i+1) + '.</span><span style="color:var(--text-secondary);font-size:13px;line-height:1.5;">' + r + '</span></div>'; }).join('');
    var msg = '<strong style="color:var(--gold);">⚖️ Your Legal Rights — ' + (categoryLabels[state.category]||'Legal') + '</strong>\n\n<div style="margin-top:10px;">' + list + '</div>';
    _addAI(msg);
    // Mark rights as done so chip hides
    if (!state.done) state.done = {};
    state.done.rights = true;
    var rc = document.getElementById('chip-rights');
    if (rc) rc.style.display = 'none';

    setTimeout(function() {
      var s = [];
      if (state.firApplicable && !(state.done && state.done.fir)) s.push('Generate FIR Draft');
      if (!(state.done && state.done.lawyers)) s.push('Find Lawyer');
      if (!(state.done && state.done.saved))   s.push('Save This Case');
      _setSuggestions(s);
    }, 400);
  }

  // ════════════════════════════════════════════
  // FIND LAWYERS
  // ════════════════════════════════════════════
  async function _showLawyers() {
    // state.category is always set — from fresh chat or from history case
    // If somehow null (edge case), default to 'civil'
    if (!state.category) {
      Toast.show('Please start a case first');
      return;
    }
    if (!state.done) state.done = { saved:false, rights:false, lawyers:false, fir:false };
    state.done.lawyers = true;
    var c = document.getElementById('chip-lawyer');
    if (c) c.style.display = 'none';
    _showTyping();
    try {
      var result;
      try { result = await API.findLawyers(state.category); }
      catch(e) { result = { lawyers: _dummyLawyers() }; }
      _removeTyping();
      var lawyers = (result.lawyers || []).slice(0, 3);
      if (!lawyers.length) { _addAI('No lawyers found. Try Bar Council India website.'); return; }
      var html = lawyers.map(function(l) {
        var lawyerData = JSON.stringify({
          name:            l.name,
          specialisation:  categoryLabels[state.category] || '',
          city:            (l.location&&l.location.city)||'',
          state:           (l.location&&l.location.state)||'',
          consultationFee: l.consultationFee||0,
          experience:      l.experience||0,
          averageRating:   l.averageRating||4.0,
          lawyerId:        l._id||'',
        }).replace(/'/g, '&apos;');
        return '<div style="border:1px solid var(--navy-border);border-radius:12px;padding:14px;margin-top:10px;background:var(--navy-mid);">' +
          '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
          '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dim));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--navy-deep);">' + l.name.charAt(0) + '</div>' +
          '<div><div style="font-weight:700;font-size:14px;">' + escapeHTML(l.name) + '</div>' +
          '<div style="font-size:11px;color:var(--gold);">⭐ ' + (l.averageRating||4.0) + ' · ' + l.experience + ' yrs exp</div></div></div>' +
          '<div style="font-size:12px;color:var(--text-secondary);">📍 ' + escapeHTML((l.location&&l.location.city)||'') + ', ' + escapeHTML((l.location&&l.location.state)||'') + '</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">💰 ' + (l.consultationFee===0?'Free first consultation':'₹'+l.consultationFee+' consultation fee') + '</div>' +
          '<button onclick="ChatScreen.bookConsultation(' + "'" + lawyerData + "'" + ')" ' +
          'style="margin-top:10px;width:100%;padding:8px;background:linear-gradient(135deg,var(--gold),var(--gold-dim));border:none;border-radius:8px;font-family:var(--font-body);font-size:12px;font-weight:700;color:var(--navy-deep);cursor:pointer;">📅 Book Consultation</button>' +
          '</div>';
      }).join('');
      var lawyerMsg = 'Found <strong>' + lawyers.length + ' lawyers</strong> for ' + (categoryLabels[state.category]||'your case') + ':<br><span style="font-size:11px;color:var(--text-muted);">Tap a lawyer card to book a consultation.</span>' + html;
      _addAI(lawyerMsg);
      if (!state.done) state.done = {};
      state.done.lawyers = true;
      var lc = document.getElementById('chip-lawyer');
      if (lc) lc.style.display = 'none';
    } catch(err) { _removeTyping(); _addAI('Could not load lawyers. Please try again.'); }
  }

  // ════════════════════════════════════════════
  // SAVE CASE — saves full conversation to MongoDB
  // ════════════════════════════════════════════
  async function _saveCase() {
    var user = Storage.get('user');
    if (!user) { Toast.show('Please login to save cases'); return; }
    if (!state.done) state.done = {};
    state.done.saved = true;
    var c = document.getElementById('chip-save');
    if (c) c.style.display = 'none';
    var hs2 = document.getElementById('hdr-save');
    if (hs2) hs2.style.display = 'none';

    var caseTitle = (categoryLabels[state.category] || 'Legal') + ' Case — ' + new Date().toLocaleDateString('en-IN');
    Toast.show('Saving case...');

    try {
      await API.createCase({
        title:         caseTitle,
        category:      state.category,
        firApplicable: state.firApplicable,
        answers:       state.answers,
        messages:      state.messages,   // save full conversation
      });
      Toast.show('Case saved ✓');
      // Mark as saved so chip hides
      if (!state.done) state.done = {};
      state.done.saved = true;
      var sc = document.getElementById('chip-save');
      if (sc) sc.style.display = 'none';
      var hs = document.getElementById('hdr-save');
      if (hs) hs.style.display = 'none';
      setTimeout(function() {
        _addAI('✅ Case saved to your account! Tap <strong>History</strong> in the bottom nav to view all your saved cases.');
      }, 400);
    } catch (err) {
      console.warn('Backend save failed:', err.message);
      Toast.show('Could not save case. Please check your connection.');
    }
  }

  // ════════════════════════════════════════════
  // BOOK CONSULTATION
  // ════════════════════════════════════════════
  async function bookConsultation(lawyerJsonStr) {
    var user = Storage.get('user');
    if (!user) { Toast.show('Please login to book a consultation'); return; }

    var lawyer;
    try { lawyer = JSON.parse(lawyerJsonStr); } catch(e) { Toast.show('Invalid lawyer data'); return; }

    Toast.show('Booking consultation...');

    try {
      await API.createConsultation({
        lawyer:       lawyer,
        caseId:       state.caseId       || null,
        caseCategory: state.category     || '',
        caseTitle:    state.caseTitle    || ((categoryLabels[state.category]||'Legal') + ' Case'),
        notes:        'Requested via Advocate Saathi app',
      });

      Toast.show('Consultation booked! ✓');
      setTimeout(function() {
        _addAI(
          '✅ <strong>Consultation with ' + escapeHTML(lawyer.name) + ' has been booked!</strong><br><br>' +
          'You can view all your consultations in the <strong>My Consultations</strong> section of your profile.<br><br>' +
          lawyer.name + ' will contact you shortly at your registered email/phone.'
        );
      }, 400);

    } catch (err) {
      console.warn('Booking failed:', err.message);
      Toast.show('Could not book consultation. Check your connection.');
    }
  }

  // ════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════
  function _getDraftFacts(category, answers) {
    var facts = {
      labour:   'On or around [Date], I was employed at [Company Name] as [Designation]. My employer failed to pay salary for approximately ' + (answers.q1||'[X]') + ' months. This constitutes an offence under Payment of Wages Act, 1936 and IPC Section 406.',
      cyber:    'On [Date], I received a suspicious call/link resulting in unauthorized transaction of Rs ' + (answers.q1||'[Amount]') + ' from my bank/UPI. This constitutes an offence under IT Act 66C, 66D and IPC 420.',
      consumer: 'On [Date], I purchased [Product] worth Rs [Amount] from [Seller]. Despite approaching the seller, they refused refund/replacement. This violates Consumer Protection Act, 2019.',
      property: 'I have a property dispute regarding [Address]. The other party has [describe dispute]. This constitutes a civil dispute under Transfer of Property Act, 1882.',
      family:   'I am filing against [Accused Name] for [cruelty/domestic violence/dowry demand] since [Date]. This is an offence under IPC 498A and DV Act 2005.',
      criminal: 'On [Date] at [Time] at [Location], the accused [Name/Description] committed [describe incident]. I have [evidence/witnesses] to support this complaint.',
    };
    return facts[category] || facts.criminal;
  }

  function _getCategoryLaws(cat) {
    var l = { labour:'Payment of Wages Act 1936 & IPC 406', cyber:'IT Act 66C, 66D & IPC 420', consumer:'Consumer Protection Act 2019 & IPC 420', property:'IPC 406 & Transfer of Property Act', family:'IPC 498A & DV Act 2005', criminal:'IPC (relevant sections)', civil:'Indian Contract Act 1872' };
    return l[cat] || 'IPC (relevant sections)';
  }

  function _dummyLawyers() {
    return [
      { name:'Adv. Rajesh Sharma', averageRating:4.5, experience:12, location:{city:'Delhi',state:'Delhi'},          consultationFee:500 },
      { name:'Adv. Priya Nair',    averageRating:4.8, experience:8,  location:{city:'Bangalore',state:'Karnataka'},  consultationFee:1000 },
      { name:'Adv. Suresh Patel',  averageRating:4.3, experience:15, location:{city:'Mumbai',state:'Maharashtra'},   consultationFee:0 },
    ];
  }

  // ── Message tracking — every message added here
  //    is also pushed to state.messages for saving
  function _addUser(text) {
    state.messages.push({ role: 'user', content: text });
    var u = Storage.get('user');
    _append(buildUserBubble(text, getInitials((u&&u.name)||'AV')));
  }

  function _addAI(text, card) {
    _removeTyping();
    // Build full content string for saving
    var fullContent = text;
    if (card) fullContent += '\n\n[CARD:' + card.title + ']';
    state.messages.push({ role: 'assistant', content: fullContent });

    var ch = card ? _buildGuidanceCard(card) : '';
    _append(
      '<div class="msg-row ai"><div class="msg-avatar ai">⚖</div><div>' +
      '<div class="msg-bubble">' + text.replace(/\n/g,'<br>') + ch + '</div>' +
      '<div class="msg-time">' + getTimeString() + '</div>' +
      '</div></div>'
    );
  }

  // Replay versions — just display, don't re-push to state.messages
  function _noMsgReplayAI(text) {
    var el = document.getElementById('chat-messages');
    if (!el) return;
    el.insertAdjacentHTML('beforeend',
      '<div class="msg-row ai"><div class="msg-avatar ai">⚖</div><div>' +
      '<div class="msg-bubble">' + text + '</div>' +
      '<div class="msg-time">Saved</div>' +
      '</div></div>'
    );
    el.scrollTop = el.scrollHeight;
  }
  function _replayUser(text) {
    var u = Storage.get('user');
    _append(buildUserBubble(text, getInitials((u&&u.name)||'AV')));
  }

  function _replayAI(text) {
    // Strip card markers for display
    var clean = text.replace(/\n\n\[CARD:[^\]]*\]/g, '');
    _append(
      '<div class="msg-row ai"><div class="msg-avatar ai">⚖</div><div>' +
      '<div class="msg-bubble">' + clean.replace(/\n/g,'<br>') + '</div>' +
      '<div class="msg-time">Saved</div>' +
      '</div></div>'
    );
  }

  function _buildGuidanceCard(card) {
    var s = card.sections.map(function(s) {
      return '<div style="margin-top:10px;"><div class="legal-card-title">' + s.heading + '</div><ul>' +
        s.items.map(function(i){return '<li>'+escapeHTML(i)+'</li>';}).join('') + '</ul></div>';
    }).join('');
    return '<div class="legal-card"><div style="font-weight:700;color:var(--gold);margin-bottom:4px;">⚖️ ' + escapeHTML(card.title) + '</div>' + s + '</div>';
  }

  function _append(html)    { var m=document.getElementById('chat-messages'); if(!m)return; m.insertAdjacentHTML('beforeend',html); m.scrollTop=m.scrollHeight; }
  function _showTyping()    { if(document.getElementById('typing-row'))return; _append(buildTypingIndicator()); var m=document.getElementById('chat-messages'); if(m)m.scrollTop=99999; }
  function _removeTyping()  { var e=document.getElementById('typing-row'); if(e)e.remove(); }
  function _setStatus(t)    { var e=document.getElementById('chat-status-text'); if(e)e.textContent=t; }
  function _setChatTitle(t) { var e=document.getElementById('chat-title');       if(e)e.textContent=t; }
  function _setPlaceholder(t){ var e=document.getElementById('chat-input');      if(e)e.placeholder=t; }
  function _setSuggestions(chips) {
    var e=document.getElementById('chat-suggestions'); if(!e)return;
    e.innerHTML=chips.map(function(c){
      return '<button class="suggestion-chip" onclick="ChatScreen.sendSuggestion(\''+c.replace(/'/g,"\\'")+'\')">' + c + '</button>';
    }).join('');
  }
  function _clearSuggestions(){ var e=document.getElementById('chat-suggestions'); if(e)e.innerHTML=''; }

  return { render, init, openFresh, openWithQuery, openCategory, openFromHistory, bookConsultation, send, sendSuggestion, handleKeyDown, handleAction };

})();

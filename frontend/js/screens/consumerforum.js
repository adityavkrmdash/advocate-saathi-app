// ================================================
// ADVOCATE SAATHI — CONSUMER FORUM SCREEN
// frontend/js/screens/consumerforum.js
// ================================================

const ConsumerForumScreen = (() => {

  // ── State ─────────────────────────────────────
  let state = {
    step:          'select_type', // select_type → collect_details → done
    complaintType: null,
    details:       {},
    detailStep:    0,
    isBusy:        false,
    done: { saved: false, lawyer: false },
  };

  // ── Complaint type labels ──────────────────────
  const typeLabels = {
    ecommerce: 'E-commerce / Online Shopping',
    product:   'Defective Product',
    medical:   'Hospital / Medical Service',
    banking:   'Bank / Insurance',
    builder:   'Builder / Real Estate',
    telecom:   'Telecom / Internet Service',
  };

  // ── Questions per type ─────────────────────────
  const questions = {
    ecommerce: [
      { key:'platform',  text:'Which platform? (Amazon, Flipkart, Meesho, etc.)' },
      { key:'product',   text:'What did you order?' },
      { key:'amount',    text:'Order amount? (in rupees)' },
      { key:'issue',     text:'What is the issue? (not delivered / wrong item / refund refused / damaged)' },
      { key:'contacted', text:'Did you contact customer support? (Yes / No)' },
    ],
    product: [
      { key:'company',   text:'Brand or company name?' },
      { key:'product',   text:'What product did you purchase?' },
      { key:'amount',    text:'Purchase amount? (in rupees)' },
      { key:'issue',     text:'What is the defect or problem?' },
      { key:'contacted', text:'Did you contact the seller? (Yes / No)' },
    ],
    medical: [
      { key:'hospital',  text:'Name of the hospital or clinic?' },
      { key:'issue',     text:'What is your complaint? (negligence / overcharging / wrong treatment)' },
      { key:'amount',    text:'Amount involved? (in rupees)' },
      { key:'contacted', text:'Did you complain to hospital management? (Yes / No)' },
    ],
    banking: [
      { key:'bank',      text:'Which bank or insurance company?' },
      { key:'issue',     text:'What is the issue? (claim rejected / hidden charges / fraud)' },
      { key:'amount',    text:'Amount involved? (in rupees)' },
      { key:'contacted', text:'Did you raise a complaint with the bank? (Yes / No)' },
    ],
    builder: [
      { key:'builder',   text:'Builder or developer name?' },
      { key:'project',   text:'Project or flat details?' },
      { key:'amount',    text:'Amount paid so far? (in rupees)' },
      { key:'issue',     text:'What is the issue? (possession delayed / defects / registry not done)' },
    ],
    telecom: [
      { key:'company',   text:'Which telecom or internet company?' },
      { key:'issue',     text:'What is the issue? (overcharging / service not working / wrong plan)' },
      { key:'amount',    text:'Amount involved? (in rupees)' },
      { key:'contacted', text:'Did you raise a complaint with the company? (Yes / No)' },
    ],
  };

  // ── Render ─────────────────────────────────────
  // Action bar HIDDEN by default — shown only after guidance is complete
  function render() {
    return `
      <div class="screen" id="consumerforum">
        ${renderStatusBar()}

        <div class="chat-header">
          <div class="chat-back" onclick="Router.navigate('home')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </div>
          <div class="chat-info">
            <div class="chat-title">🏛️ Consumer Forum</div>
            <div class="chat-status" id="cf-status">File your complaint</div>
          </div>
          <!-- Header actions: hidden until guidance done -->
          <div class="chat-header-actions" id="cf-header-actions" style="display:none;">
            <div id="cf-hdr-save" class="chat-action-btn" onclick="ConsumerForumScreen.handleAction('Save')" title="Save Case">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <path d="M17 21v-8H7v8M7 3v5h8"/>
              </svg>
            </div>
            <div class="chat-action-btn" onclick="ConsumerForumScreen.handleAction('Helpline')" title="Helpline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 0116.92 2a2 2 0 012 1.72 12.84 12.84 0 01.07 2.2"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div style="height:3px;background:var(--navy-border);flex-shrink:0;">
          <div id="cf-progress" style="height:100%;background:var(--gold);width:5%;transition:width 0.4s ease;"></div>
        </div>

        <!-- Action bar: HIDDEN until guidance complete -->
        <div class="action-bar" id="cf-action-bar" style="display:none;">
          <button id="cf-chip-save" class="action-chip" onclick="ConsumerForumScreen.handleAction('Save')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <path d="M17 21v-8H7v8M7 3v5h8"/>
            </svg>
            Save Case
          </button>
          <button id="cf-chip-lawyer" class="action-chip" onclick="ConsumerForumScreen.handleAction('Find Lawyer')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Find Lawyer
          </button>
          <button class="action-chip" onclick="ConsumerForumScreen.handleAction('Helpline')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81"/>
            </svg>
            Helpline
          </button>
          <button class="action-chip" onclick="ConsumerForumScreen.handleAction('New Complaint')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            New Complaint
          </button>
        </div>

        <div class="chat-messages" id="cf-messages"></div>

        <div class="chat-input-bar">
          <div class="chat-suggestions" id="cf-suggestions"></div>
          <div class="chat-input-row">
            <textarea id="cf-input" rows="1"
              placeholder="Select complaint type above…"
              oninput="autoResizeTextarea(this)"
              onkeydown="ConsumerForumScreen.handleKeyDown(event)"></textarea>
            <button class="send-btn" onclick="ConsumerForumScreen.send()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── Show action bar after guidance done ─────────
  function _showActionBar() {
    var bar = document.getElementById('cf-action-bar');
    var hdr = document.getElementById('cf-header-actions');
    if (bar) bar.style.display = 'flex';
    if (hdr) hdr.style.display = 'flex';
    _updateChips();
  }

  function _updateChips() {
    var saveChip   = document.getElementById('cf-chip-save');
    var lawyerChip = document.getElementById('cf-chip-lawyer');
    var hdrSave    = document.getElementById('cf-hdr-save');
    if (saveChip)   saveChip.style.display   = state.done.saved  ? 'none' : 'inline-flex';
    if (hdrSave)    hdrSave.style.display    = state.done.saved  ? 'none' : 'flex';
    if (lawyerChip) lawyerChip.style.display = state.done.lawyer ? 'none' : 'inline-flex';
  }

  // ── Init ────────────────────────────────────────
  function init() {
    state = {
      step:'select_type', complaintType:null,
      details:{}, detailStep:0, isBusy:false,
      done:{ saved:false, lawyer:false },
    };
    var msgs = document.getElementById('cf-messages');
    if (msgs) msgs.innerHTML = '';
    _clearSuggestions();
    _setProgress(5);

    var bar = document.getElementById('cf-action-bar');
    var hdr = document.getElementById('cf-header-actions');
    if (bar) bar.style.display = 'none';
    if (hdr) hdr.style.display = 'none';

    setTimeout(function() {
      _addAI(
        'Namaskar! 🏛️ I\'ll guide you through filing a consumer complaint under the <strong>Consumer Protection Act, 2019</strong>.\n\n' +
        '<strong>What type of complaint do you have?</strong>'
      );
      _setSuggestions([
        '🛒 E-commerce / Online Shopping',
        '📱 Defective Product',
        '🏥 Hospital / Medical Service',
        '🏦 Bank / Insurance',
        '🏗️ Builder / Real Estate',
        '📡 Telecom / Internet Service',
      ]);
    }, 350);
  }

  // ── Send ────────────────────────────────────────
  function send() {
    var input = document.getElementById('cf-input');
    var text  = input ? input.value.trim() : '';
    if (!text || state.isBusy) return;
    input.value = '';
    input.style.height = 'auto';
    _clearSuggestions();
    _addUser(text);

    if      (state.step === 'select_type')     _selectType(text);
    else if (state.step === 'collect_details') _collectDetail(text);
    else _addAI('Your guidance is ready above. Use the action bar to save, find a lawyer, or <strong>New Complaint</strong> to start over.');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function handleAction(label) {
    if      (label === 'Save')          _saveCase();
    else if (label === 'Find Lawyer')   _showLawyers();
    else if (label === 'Helpline')      _showHelpline();
    else if (label === 'New Complaint') init();
  }

  function sendSuggestion(text) {
    if (state.isBusy) return;
    _clearSuggestions();
    var input = document.getElementById('cf-input');
    if (input) input.value = '';
    var t = text.toLowerCase();

    if      (state.step === 'select_type')     { _addUser(text); _selectType(text); }
    else if (state.step === 'collect_details') { _addUser(text); _collectDetail(text); }
    else if (t.includes('save'))               _saveCase();
    else if (t.includes('lawyer'))             _showLawyers();
    else if (t.includes('helpline'))           _showHelpline();
    else if (t.includes('new'))                init();
    else { _addUser(text); _addAI('Use the action bar above.'); }
  }

  // ── Select complaint type ───────────────────────
  function _selectType(text) {
    var t = text.toLowerCase();
    if      (t.includes('ecommerce')||t.includes('online')||t.includes('shopping')) state.complaintType='ecommerce';
    else if (t.includes('product')||t.includes('defective'))                        state.complaintType='product';
    else if (t.includes('hospital')||t.includes('medical'))                         state.complaintType='medical';
    else if (t.includes('bank')||t.includes('insurance'))                           state.complaintType='banking';
    else if (t.includes('builder')||t.includes('real estate'))                      state.complaintType='builder';
    else if (t.includes('telecom')||t.includes('internet'))                         state.complaintType='telecom';
    else                                                                             state.complaintType='product';

    state.step = 'collect_details';
    state.details = {};
    state.detailStep = 0;
    _setProgress(15);

    _addAI('Got it — <strong style="color:var(--gold);">' + escapeHTML(typeLabels[state.complaintType]||text) + '</strong> complaint.\n\nI need a few details. Please answer each question:');
    setTimeout(function() { _askDetail(); }, 500);
  }

  // ── Detail questions ────────────────────────────
  function _askDetail() {
    var qs = questions[state.complaintType] || questions.product;
    var q  = qs[state.detailStep];
    if (!q) { _showGuidance(); return; }

    var progress = 15 + Math.round(((state.detailStep+1)/qs.length)*45);
    _setProgress(progress);
    _addAI('<span style="color:var(--text-muted);font-size:12px;">Question ' + (state.detailStep+1) + ' of ' + qs.length + '</span>\n\n' + q.text);

    if (q.text.toLowerCase().includes('yes / no')) _setSuggestions(['Yes', 'No']);
    else _clearSuggestions();
  }

  function _collectDetail(answer) {
    var qs = questions[state.complaintType] || questions.product;
    var q  = qs[state.detailStep];
    if (q) state.details[q.key] = answer;
    state.detailStep++;
    if (state.detailStep < qs.length) _askDetail();
    else _showGuidance();
  }

  // ── Show full guidance ──────────────────────────
  function _showGuidance() {
    state.step   = 'done';
    state.isBusy = true;
    _setStatus('Checking eligibility…');
    _showTyping();
    _setProgress(80);

    setTimeout(function() {
      _removeTyping();
      _setStatus('Guidance ready ✓');
      _setProgress(100);
      state.isBusy = false;

      var d      = state.details;
      var amount = parseFloat(d.amount || '0');

      var forumShort = amount <= 5000000
        ? 'District Consumer Disputes Redressal Commission'
        : amount <= 20000000 ? 'State Consumer Disputes Redressal Commission'
        : 'National Consumer Disputes Redressal Commission (NCDRC)';

      var forumRange = amount <= 5000000 ? 'Claims up to ₹50 Lakhs'
        : amount <= 20000000 ? 'Claims ₹50 Lakhs – ₹2 Crore' : 'Claims above ₹2 Crore';

      // Eligibility card
      _addAI(
        '<div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:16px;">' +
        '<div style="font-size:15px;font-weight:700;color:#10b981;margin-bottom:6px;">✅ Your case is eligible for Consumer Forum</div>' +
        '<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">Under the <strong>Consumer Protection Act, 2019</strong>, you have the right to seek refund, replacement, and compensation.</div></div>'
      );

      // Which forum
      setTimeout(function() {
        _addAI(
          '<strong>🏛️ Which Forum to Approach:</strong>\n\n' +
          '<div style="background:var(--navy-mid);border:1px solid var(--gold);border-radius:12px;padding:14px;margin-top:8px;">' +
          '<div style="color:var(--gold);font-weight:700;font-size:14px;margin-bottom:4px;">' + forumShort + '</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);">' + forumRange + '</div></div>'
        );
      }, 600);

      // Step-by-step guide
      setTimeout(function() {
        _addAI('Here is your complete step-by-step filing guide:', {
          title: 'Consumer Forum — How to File',
          sections: [
            { heading:'📋 Step 1 — Send Legal Notice First', items:['Send written complaint to ' + (d.platform||d.company||d.bank||d.builder||d.hospital||'the company') + ' giving 15-30 days to resolve','Send via Registered Post with Acknowledgement Due','Keep copy of notice and postal receipt'] },
            { heading:'🖥️ Step 2 — File Online', items:['Go to consumerhelpline.gov.in','Register and click "File a Complaint"','Fill in your details and upload documents','Pay filing fee: ₹100 to ₹200'] },
            { heading:'🏢 Step 3 — OR File Offline', items:['Visit your nearest District Consumer Forum office','Carry 3 copies of complaint + all documents','Submit at filing counter and get date-stamped acknowledgement'] },
            { heading:'⏳ Step 4 — After Filing', items:['Forum sends notice to opposite party within 21 days','Opposite party must reply within 30 days','Hearing scheduled — typical resolution: 3-6 months'] },
            { heading:'💰 What You Can Claim', items:['Full refund of ₹' + (d.amount||'[your amount]'),'Compensation for mental harassment','Litigation costs','Interest at 9% per annum'] },
          ]
        });
      }, 1200);

      // Documents
      setTimeout(function() {
        var docs = _getDocs();
        _addAI('<strong>📁 Documents Needed:</strong><br><br>' + docs.map(function(x){ return '• '+x; }).join('<br>'));
      }, 2000);

      // Show action bar + suggestions
      setTimeout(function() {
        _showActionBar();
        var s = [];
        if (!state.done.saved)  s.push('Save This Case');
        if (!state.done.lawyer) s.push('Find Lawyer');
        s.push('Helpline Numbers');
        _setSuggestions(s);
      }, 2600);

    }, 1500);
  }

  // ── Save case to MongoDB ────────────────────────
  async function _saveCase() {
    var user = Storage.get('user');
    if (!user) { Toast.show('Please login to save'); return; }
    if (state.step !== 'done') { Toast.show('Please complete the consultation first'); return; }

    state.done.saved = true;
    _updateChips();

    Toast.show('Saving...');
    try {
      await API.createCase({
        title:         'Consumer Complaint — ' + (typeLabels[state.complaintType]||'General') + ' — ' + new Date().toLocaleDateString('en-IN'),
        category:      'consumer',
        firApplicable: false,
        answers:       state.details || {},
        messages:      [],
      });
      Toast.show('Case saved ✓');
      _addAI('✅ Case saved to your account! View it in <strong>History</strong>.');

      setTimeout(function() {
        var s = [];
        if (!state.done.lawyer) s.push('Find Lawyer');
        s.push('New Complaint');
        _setSuggestions(s);
      }, 500);
    } catch(err) {
      state.done.saved = false;
      _updateChips();
      Toast.show('Could not save. Check your connection.');
    }
  }

  // ── Find Lawyers ─────────────────────────────────
  async function _showLawyers() {
    if (state.step !== 'done') { Toast.show('Please complete the consultation first'); return; }

    state.done.lawyer = true;
    _updateChips();

    _showTyping();
    try {
      var result;
      try { result = await API.findLawyers('consumer'); }
      catch(e) { result = { lawyers: _dummyLawyers() }; }
      _removeTyping();

      var lawyers = (result.lawyers || []).slice(0, 3);
      if (!lawyers.length) { _addAI('No lawyers found. Try Bar Council India website.'); return; }

      var html = lawyers.map(function(l) {
        var lawyerData = JSON.stringify({
          name:l.name, specialisation:'Consumer Rights',
          city:(l.location&&l.location.city)||'', state:(l.location&&l.location.state)||'',
          consultationFee:l.consultationFee||0, experience:l.experience||0,
          averageRating:l.averageRating||4.0, lawyerId:l._id||'',
        }).replace(/'/g,'&apos;');

        return '<div style="border:1px solid var(--navy-border);border-radius:12px;padding:14px;margin-top:10px;background:var(--navy-mid);">' +
          '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;">' +
          '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dim));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--navy-deep);">' + l.name.charAt(0) + '</div>' +
          '<div><div style="font-weight:700;font-size:14px;">' + escapeHTML(l.name) + '</div>' +
          '<div style="font-size:11px;color:var(--gold);">⭐ ' + (l.averageRating||4.0) + ' · ' + l.experience + ' yrs exp</div></div></div>' +
          '<div style="font-size:12px;color:var(--text-secondary);">📍 ' + escapeHTML((l.location&&l.location.city)||'') + ', ' + escapeHTML((l.location&&l.location.state)||'') + '</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">💰 ' + (l.consultationFee===0?'Free first consultation':'₹'+l.consultationFee+' fee') + '</div>' +
          '<button onclick="ConsumerForumScreen.bookConsultation(\'' + lawyerData + '\')" ' +
          'style="margin-top:10px;width:100%;padding:8px;background:linear-gradient(135deg,var(--gold),var(--gold-dim));border:none;border-radius:8px;font-family:var(--font-body);font-size:12px;font-weight:700;color:var(--navy-deep);cursor:pointer;">📅 Book Consultation</button>' +
          '</div>';
      }).join('');

      _addAI('Recommended consumer rights lawyers:' + html);

      setTimeout(function() {
        var s = [];
        if (!state.done.saved) s.push('Save This Case');
        s.push('New Complaint');
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

    Toast.show('Booking...');
    try {
      await API.createConsultation({
        lawyer, caseId: null, caseCategory: 'consumer',
        caseTitle: 'Consumer Complaint — ' + (typeLabels[state.complaintType]||'General'),
        notes: 'Requested from Consumer Forum screen',
      });
      Toast.show('Consultation booked ✓');
      _addAI('✅ Consultation with <strong>' + escapeHTML(lawyer.name) + '</strong> booked! View it in <strong>Profile → My Consultations</strong>.');
    } catch(err) {
      Toast.show('Could not book. Check your connection.');
    }
  }

  // ── Helpline ─────────────────────────────────────
  function _showHelpline() {
    _addAI(
      '<strong>📞 Consumer Helplines:</strong><br><br>' +
      '• National Consumer Helpline: <strong style="color:var(--gold)">1800-11-4000</strong> (Toll Free)<br>' +
      '• SMS Helpline: <strong style="color:var(--gold)">8800001915</strong><br>' +
      '• Online: <strong style="color:var(--gold)">consumerhelpline.gov.in</strong><br>' +
      '• IRDAI (Insurance): <strong style="color:var(--gold)">1800-4254-732</strong><br>' +
      '• RBI (Banking): <strong style="color:var(--gold)">14448</strong>'
    );
  }

  // ── Documents per type ───────────────────────────
  function _getDocs() {
    var docs = {
      ecommerce: ['Order confirmation / invoice','Payment proof (bank statement or screenshot)','Screenshots of product listing','Delivery proof or non-delivery evidence','All communication with seller'],
      product:   ['Purchase receipt or tax invoice','Photos/videos of defective product','Warranty card if applicable','All communication with company'],
      medical:   ['All hospital bills and receipts','Medical records, prescriptions, test reports','Discharge summary','Communication with hospital'],
      banking:   ['Bank statements','Policy documents (for insurance)','Written correspondence with bank','Complaint acknowledgement from bank'],
      builder:   ['Sale deed / allotment letter','All payment receipts','Builder-buyer agreement','RERA registration details'],
      telecom:   ['Bills showing overcharging','Screenshot of wrong plan','Customer care complaint reference number'],
    };
    return docs[state.complaintType] || docs.product;
  }

  // ── Guidance card builder ────────────────────────
  function _buildGuidanceCard(card) {
    var s = card.sections.map(function(sec) {
      return '<div style="margin-top:10px;"><div class="legal-card-title">' + sec.heading + '</div><ul>' +
        sec.items.map(function(i){ return '<li>'+escapeHTML(i)+'</li>'; }).join('') + '</ul></div>';
    }).join('');
    return '<div class="legal-card"><div style="font-weight:700;color:var(--gold);margin-bottom:4px;">🏛️ ' + escapeHTML(card.title) + '</div>' + s + '</div>';
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
  function _addAI(text, card) {
    _removeTyping();
    var ch = card ? _buildGuidanceCard(card) : '';
    _append(
      '<div class="msg-row ai"><div class="msg-avatar ai">🏛</div><div>' +
      '<div class="msg-bubble">' + text.replace(/\n/g,'<br>') + ch + '</div>' +
      '<div class="msg-time">' + getTimeString() + '</div>' +
      '</div></div>'
    );
  }
  function _append(html)      { var m=document.getElementById('cf-messages'); if(!m)return; m.insertAdjacentHTML('beforeend',html); m.scrollTop=m.scrollHeight; }
  function _showTyping()      { if(document.getElementById('typing-row'))return; _append(buildTypingIndicator()); var m=document.getElementById('cf-messages'); if(m)m.scrollTop=99999; }
  function _removeTyping()    { var e=document.getElementById('typing-row'); if(e)e.remove(); }
  function _setStatus(t)      { var e=document.getElementById('cf-status');   if(e)e.textContent=t; }
  function _setProgress(p)    { var e=document.getElementById('cf-progress'); if(e)e.style.width=p+'%'; }
  function _setSuggestions(chips) {
    var e=document.getElementById('cf-suggestions'); if(!e)return;
    e.innerHTML=chips.map(function(c){
      return '<button class="suggestion-chip" onclick="ConsumerForumScreen.sendSuggestion(\''+c.replace(/'/g,"\\'")+'\')">' + c + '</button>';
    }).join('');
  }
  function _clearSuggestions(){ var e=document.getElementById('cf-suggestions'); if(e)e.innerHTML=''; }

  return { render, init, send, sendSuggestion, handleKeyDown, handleAction, bookConsultation };

})();

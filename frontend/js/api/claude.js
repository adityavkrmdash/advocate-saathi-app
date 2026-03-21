// ================================================
// ADVOCATE SAATHI — API MODULE
// frontend/js/api/claude.js
//
// All data goes to MongoDB via backend at port 5000.
// No localStorage for user data — only session token.
// ================================================

const API = (() => {
  const BASE = 'http://localhost:5000/api';

  function _token() {
    const s = Storage.get('session');
    return s && s.token ? s.token : '';
  }

  function _headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + _token()
    };
  }

  async function _post(url, body) {
    const res  = await fetch(BASE + url, { method: 'POST', headers: _headers(), body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function _get(url) {
    const res  = await fetch(BASE + url, { headers: _headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function _patch(url, body) {
    const res  = await fetch(BASE + url, { method: 'PATCH', headers: _headers(), body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function _delete(url) {
    const res  = await fetch(BASE + url, { method: 'DELETE', headers: _headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  // ── AUTH ──────────────────────────────────────
  const signup  = (name, email, password) => _post('/auth/signup', { name, email, password });
  const login   = (email, password)       => _post('/auth/login',  { email, password });
  const getMe   = ()                      => _get('/auth/me');
  const updateMe = (updates)              => _patch('/auth/me', updates);

  // ── ML / CHAT ─────────────────────────────────
  const classifyCase  = (text)                             => _post('/chat/classify',  { text });
  const checkFIR      = (category, answers)                => _post('/chat/fir-check', { category, answers });
  const getGuidance   = (category, firApplicable, answers) => _post('/chat/guidance',  { category, firApplicable, answers });

  // ── CASES — MongoDB ────────────────────────────
  const getCases    = (params = '')   => _get('/cases' + (params ? '?' + params : ''));
  const getCase     = (id)            => _get('/cases/' + id);
  const createCase  = (data)          => _post('/cases', data);
  const updateCase  = (id, data)      => _patch('/cases/' + id, data);
  const deleteCase  = (id)            => _delete('/cases/' + id);
  const getCaseStats = ()             => _get('/cases/stats');

  // ── NOTICES — MongoDB ──────────────────────────
  const getNotices    = ()       => _get('/notices');
  const getNotice     = (id)     => _get('/notices/' + id);
  const createNotice  = (data)   => _post('/notices', data);
  const deleteNotice  = (id)     => _delete('/notices/' + id);
  const updateNoticeStatus = (id, status) => _patch('/notices/' + id + '/status', { status });

  // ── LAWYERS ───────────────────────────────────
  const findLawyers = (category, city, state) => {
    const p = new URLSearchParams({ category: category || '' });
    if (city)  p.append('city',  city);
    if (state) p.append('state', state);
    return _get('/lawyers?' + p.toString());
  };

  // ── NOTIFICATIONS ─────────────────────────────
  const getNotifications  = ()   => _get('/notifications');
  const markAllRead       = ()   => _patch('/notifications/read-all', {});
  const markRead          = (id) => _patch('/notifications/' + id + '/read', {});
  const deleteNotification = (id) => _delete('/notifications/' + id);

  // ── CONSULTATIONS ──────────────────────────────
  const getConsultations    = ()       => _get('/consultations');
  const createConsultation  = (data)   => _post('/consultations', data);
  const updateConsultStatus = (id, status) => _patch('/consultations/' + id + '/status', { status });
  const deleteConsultation  = (id)     => _delete('/consultations/' + id);

  return {
    signup, login, getMe, updateMe,
    classifyCase, checkFIR, getGuidance,
    getCases, getCase, createCase, updateCase, deleteCase, getCaseStats,
    getNotices, getNotice, createNotice, deleteNotice, updateNoticeStatus,
    getNotifications, markAllRead, markRead, deleteNotification,
    getConsultations, createConsultation, updateConsultStatus, deleteConsultation,
    findLawyers
  };
})();


// ════════════════════════════════════════════════
// FALLBACK RESPONSES — when backend/ML is offline
// ════════════════════════════════════════════════
const FallbackResponses = (() => {

  const classifyKeywords = {
    labour:   ['salary', 'wage', 'employer', 'job', 'fired', 'resign', 'labour', 'pf', 'provident', 'gratuity'],
    cyber:    ['fraud', 'upi', 'cyber', 'hack', 'phishing', 'scam', 'otp', 'online', 'banking'],
    consumer: ['consumer', 'refund', 'product', 'defect', 'amazon', 'flipkart', 'return', 'warranty'],
    property: ['landlord', 'rent', 'deposit', 'property', 'tenant', 'flat', 'eviction', 'lease'],
    family:   ['divorce', 'custody', 'marriage', 'dowry', 'domestic', 'wife', 'husband', 'maintenance'],
    criminal: ['assault', 'theft', 'stolen', 'attack', 'harass', 'threat', 'fir', 'police', 'murder'],
  };

  const questions = {
    labour:   ['Do you have a written offer letter or contract?', 'How many months of salary is pending?', 'Did your employer give a written reason?', 'Are you still employed or have you resigned?', 'Does your company have more than 10 employees?'],
    cyber:    ['When did this happen?', 'How much money was lost? (Rs)', 'Do you have screenshots or transaction IDs?', 'Did you receive a suspicious link or call?', 'Have you contacted your bank?'],
    consumer: ['Do you have the purchase receipt?', 'Did you contact the seller first?', 'What was the seller response?', 'What is the product value? (Rs)', 'When did you make the purchase?'],
    property: ['Do you have a signed rental agreement?', 'How long ago did the dispute start?', 'What is the value involved? (Rs)', 'Did the other party give written communication?', 'Is the other party an individual or company?'],
    family:   ['Is this about divorce, maintenance, custody, or domestic violence?', 'Are children involved?', 'How long have you been married?', 'Is there any domestic violence?', 'Have you consulted a lawyer?'],
    criminal: ['Did this happen recently?', 'Do you have any witnesses?', 'Do you have evidence such as photos or messages?', 'Have you approached the police?', 'Do you know the accused?'],
    civil:    ['Is there a written agreement?', 'What is the dispute value? (Rs)', 'Have you tried negotiation?', 'Do you have documentary evidence?', 'How long has this been ongoing?'],
  };

  function classify(text) {
    const t = text.toLowerCase();
    let best = 'civil', bestScore = 0;
    for (const [cat, kws] of Object.entries(classifyKeywords)) {
      const score = kws.filter(kw => t.includes(kw)).length;
      if (score > bestScore) { bestScore = score; best = cat; }
    }
    return {
      category:          best,
      confidence:        Math.min(0.5 + bestScore * 0.1, 0.95),
      followUpQuestions: questions[best] || questions.civil,
    };
  }

  function firCheck(category) {
    const firMap = { labour:true, cyber:true, criminal:true, family:false, consumer:false, property:false, civil:false };
    const auth   = { labour:'District Labour Commissioner / Police', cyber:'Cyber Crime Cell / cybercrime.gov.in', consumer:'District Consumer Forum', property:'Rent Control Court', family:'Family Court', criminal:'Nearest Police Station', civil:'Civil Court' };
    const fir    = firMap[category] ?? false;
    return { firApplicable: fir, reason: fir ? 'FIR applicable under ' + category + ' law.' : 'Civil/consumer forum is appropriate.', recommendedAuthority: auth[category] || 'Civil Court', urgency: fir ? 'high' : 'medium' };
  }

  function guidance(category, firApplicable) {
    const lawsMap  = { labour:['Payment of Wages Act, 1936','IPC Section 406'], cyber:['IT Act 66C','IT Act 66D','IPC 420'], consumer:['Consumer Protection Act, 2019'], property:['Transfer of Property Act, 1882'], family:['Hindu Marriage Act, 1955','DV Act 2005'], criminal:['IPC (relevant sections)','CrPC 154'], civil:['Indian Contract Act, 1872'] };
    const stepsMap = { labour:['Send demand notice','File with Labour Commissioner','Approach Labour Court'], cyber:['Call 1930 immediately','File at cybercrime.gov.in','Contact bank fraud desk','File FIR at Cyber Cell'], consumer:['Send legal notice','File at consumerhelpline.gov.in','Approach District Consumer Forum'], property:['Send demand notice','Approach Rent Control Court','File money recovery suit'], family:['Consult family lawyer','File in Family Court'], criminal:['File FIR at police station','Preserve all evidence'], civil:['Send legal notice','Attempt mediation','File civil suit'] };
    const docsMap  = { labour:['Offer letter','Salary slips','Bank statements'], cyber:['Transaction screenshots','Bank statement'], consumer:['Purchase receipt','Product photos'], property:['Rental agreement','Deposit receipt'], family:['Marriage certificate','ID proofs'], criminal:['Written complaint','Evidence photos'], civil:['Original contract','All correspondence'] };
    const helplines = { cyber:[{name:'Cyber Crime Helpline',number:'1930'}], labour:[{name:'Labour Helpline',number:'1800-11-2200'}], consumer:[{name:'Consumer Helpline',number:'1800-11-4000'}], family:[{name:'Women Helpline',number:'181'}], criminal:[{name:'Police',number:'100'}] };
    return { laws: lawsMap[category]||lawsMap.civil, steps: stepsMap[category]||stepsMap.civil, documents: docsMap[category]||docsMap.civil, firApplicable, helplineNumbers: helplines[category]||[{name:'Police',number:'100'}] };
  }

  return { classify, firCheck, guidance };
})();

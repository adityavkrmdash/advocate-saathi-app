// ================================================
// ADVOCATE SAATHI — CHAT CONTROLLER
// backend/controllers/chatController.js
//
// Calls your Python ML server instead of any
// external AI API. No API key needed.
// ================================================

const axios = require('axios');

const ML_URL = process.env.ML_MODEL_URL || 'http://localhost:8000';

// ── POST /api/chat/classify ───────────────────
// Step 1: User describes problem → ML classifies it
const classifyCase = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 5) {
      return res.status(400).json({ error: 'Please describe your problem.' });
    }

    const mlResponse = await axios.post(`${ML_URL}/classify`, { text });

    const { category, confidence, followUpQuestions } = mlResponse.data;

    res.json({
      category,
      confidence,
      followUpQuestions,
      message: `Case classified as ${category} law.`
    });

  } catch (err) {
    // ML server not running — return fallback
    if (err.code === 'ECONNREFUSED') {
      return res.json(_fallbackClassify(req.body.text));
    }
    next(err);
  }
};

// ── POST /api/chat/fir-check ──────────────────
// Step 2: Based on answers → decide if FIR applicable
const checkFIR = async (req, res, next) => {
  try {
    const { category, answers } = req.body;
    if (!category || !answers) {
      return res.status(400).json({ error: 'category and answers are required.' });
    }

    const mlResponse = await axios.post(`${ML_URL}/fir-check`, { category, answers });

    res.json(mlResponse.data);

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.json(_fallbackFIRCheck(req.body.category, req.body.answers));
    }
    next(err);
  }
};

// ── POST /api/chat/guidance ───────────────────
// Step 3: Return full action plan based on case
const getGuidance = async (req, res, next) => {
  try {
    const { category, firApplicable, answers } = req.body;

    const mlResponse = await axios.post(`${ML_URL}/guidance`, {
      category, firApplicable, answers
    });

    res.json(mlResponse.data);

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.json(_fallbackGuidance(req.body.category, req.body.firApplicable));
    }
    next(err);
  }
};

// ════════════════════════════════════════════════
// FALLBACK RESPONSES (when ML server is offline)
// These are used during development/testing
// ════════════════════════════════════════════════

function _fallbackClassify(text = '') {
  const t = text.toLowerCase();
  let category = 'civil';

  if (/salary|wage|employer|job|fired|resign|labour/.test(t))   category = 'labour';
  else if (/fraud|upi|cyber|hack|phish|scam|otp|online/.test(t)) category = 'cyber';
  else if (/consumer|refund|product|defect|amazon|flipkart/.test(t)) category = 'consumer';
  else if (/landlord|rent|deposit|property|tenant/.test(t))     category = 'property';
  else if (/divorce|custody|marriage|dowry|family/.test(t))     category = 'family';
  else if (/assault|theft|murder|fir|police|criminal/.test(t))  category = 'criminal';

  const questionMap = {
    labour:   ['Do you have a written offer letter or contract?', 'How many months of salary is pending?', 'Did your employer give any written reason for non-payment?', 'Are you still employed or have you resigned?'],
    cyber:    ['When did this happen?', 'How much money was lost?', 'Do you have screenshots or transaction IDs?', 'Did you receive any suspicious link or call?'],
    consumer: ['Do you have the purchase receipt or invoice?', 'Did you contact the seller before this?', 'What was the seller\'s response?', 'How much was the product worth?'],
    property: ['Do you have a signed rental agreement?', 'How long ago did you vacate the property?', 'What is the deposit amount?', 'Did the landlord give any reason for withholding?'],
    family:   ['Is this about divorce, maintenance, or custody?', 'Are there children involved?', 'How long have you been married?', 'Is there any domestic violence involved?'],
    criminal: ['Did this incident happen recently?', 'Do you have any witnesses?', 'Do you have any evidence (photos, messages)?', 'Have you already approached the police?'],
    civil:    ['Can you describe the nature of the dispute?', 'Is there a written agreement involved?', 'What is the approximate value of the dispute?', 'Have you tried resolving this through negotiation?'],
  };

  return {
    category,
    confidence: 0.85,
    followUpQuestions: questionMap[category] || questionMap.civil,
    message: `Case classified as ${category} law.`
  };
}

function _fallbackFIRCheck(category, answers = {}) {
  const firCategories = ['criminal', 'cyber', 'labour'];
  const firApplicable = firCategories.includes(category);

  return {
    firApplicable,
    reason: firApplicable
      ? `Based on your answers, an FIR can be filed under ${category} law provisions.`
      : `This case is better handled through civil/consumer forums rather than a police FIR.`,
    recommendedAuthority: _getAuthority(category, firApplicable)
  };
}

function _fallbackGuidance(category, firApplicable) {
  const guidanceMap = {
    labour: {
      laws: ['Payment of Wages Act, 1936', 'Industrial Disputes Act, 1947', 'IPC Section 406'],
      steps: ['Send a written demand notice to employer via registered post', 'File complaint with District Labour Commissioner', 'Approach Labour Court', 'File FIR under IPC Section 406 if amount is significant'],
      documents: ['Offer letter / employment contract', 'Salary slips', 'Bank statements showing missing credits', 'Resignation letter / termination letter', 'Any written communication with employer'],
    },
    cyber: {
      laws: ['IT Act Section 66C', 'IT Act Section 66D', 'IPC Section 420'],
      steps: ['File complaint at cybercrime.gov.in immediately', 'Call National Cyber Crime Helpline: 1930', 'Block card and contact bank fraud desk', 'File FIR at local Cyber Cell'],
      documents: ['Screenshots of fraud transaction', 'Transaction ID / UTR number', 'Bank statement', 'Any suspicious messages or links received'],
    },
    consumer: {
      laws: ['Consumer Protection Act, 2019', 'Consumer Protection (E-Commerce) Rules, 2020'],
      steps: ['Send legal notice to seller', 'File complaint at consumerhelpline.gov.in', 'Approach District Consumer Forum', 'Claim refund + compensation + litigation costs'],
      documents: ['Purchase receipt / invoice', 'Product photos showing defect', 'Communication with seller', 'Bank / payment proof'],
    },
    property: {
      laws: ['Transfer of Property Act, 1882', 'State Rent Control Act'],
      steps: ['Send formal demand notice via registered post', 'File complaint in Rent Control Court', 'Approach Civil Court for money recovery'],
      documents: ['Signed rental agreement', 'Deposit payment receipt', 'Vacating proof / notice', 'Communication with landlord'],
    },
    family: {
      laws: ['Hindu Marriage Act, 1955', 'Protection of Women from Domestic Violence Act, 2005', 'Hindu Minority and Guardianship Act'],
      steps: ['Consult a family lawyer', 'File petition in Family Court', 'Apply for interim relief if urgent'],
      documents: ['Marriage certificate', 'ID proofs', 'Evidence of dispute', 'Children\'s documents if custody involved'],
    },
    criminal: {
      laws: ['IPC (relevant sections)', 'CrPC Section 154 (FIR)'],
      steps: ['File FIR at nearest police station', 'If police refuses, approach Magistrate under CrPC Section 156(3)', 'Hire a criminal lawyer'],
      documents: ['Written complaint', 'Evidence (photos, videos, messages)', 'Witness details', 'Medical report if applicable'],
    },
  };

  const guide = guidanceMap[category] || guidanceMap.criminal;

  return {
    laws:        guide.laws,
    steps:       guide.steps,
    documents:   guide.documents,
    firApplicable,
    authority:   _getAuthority(category, firApplicable),
  };
}

function _getAuthority(category, firApplicable) {
  const map = {
    labour:   'District Labour Commissioner / Labour Court',
    cyber:    'Cyber Crime Cell / cybercrime.gov.in',
    consumer: 'District Consumer Disputes Redressal Commission',
    property: 'Rent Control Court / Civil Court',
    family:   'Family Court',
    criminal: 'Nearest Police Station / Magistrate Court',
    civil:    'Civil Court',
  };
  return map[category] || 'Civil Court';
}

module.exports = { classifyCase, checkFIR, getGuidance };

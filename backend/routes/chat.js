// ================================================
// ADVOCATE SAATHI — CHAT ROUTES
// backend/routes/chat.js
// ================================================

const express = require('express');
const router  = express.Router();
const { classifyCase, checkFIR, getGuidance } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// All routes protected — user must be logged in
router.post('/classify',  protect, classifyCase);   // Step 1: classify problem
router.post('/fir-check', protect, checkFIR);        // Step 2: FIR applicable?
router.post('/guidance',  protect, getGuidance);     // Step 3: full action plan

module.exports = router;

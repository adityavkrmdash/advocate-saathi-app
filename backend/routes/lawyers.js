// ================================================
// ADVOCATE SAATHI — LAWYER ROUTES
// backend/routes/lawyers.js
// ================================================

const express = require('express');
const router  = express.Router();
const { getLawyers, getLawyer, addReview, seedLawyers } = require('../controllers/lawyerController');
const { protect } = require('../middleware/auth');

router.get('/',              getLawyers);              // public — search lawyers
router.get('/:id',           getLawyer);               // public — get one lawyer
router.post('/:id/review',   protect, addReview);      // protected — add review
router.post('/seed',         seedLawyers);              // dev only — seed dummy data

module.exports = router;

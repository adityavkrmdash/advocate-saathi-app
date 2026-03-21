// ================================================
// ADVOCATE SAATHI — CASE ROUTES
// backend/routes/cases.js
// ================================================

const express = require('express');
const router  = express.Router();
const { getCases, createCase, getCase, updateCase, deleteCase, getStats } = require('../controllers/caseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getStats);
router.route('/').get(getCases).post(createCase);
router.route('/:id').get(getCase).patch(updateCase).delete(deleteCase);

module.exports = router;

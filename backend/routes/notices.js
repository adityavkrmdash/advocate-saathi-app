// ================================================
// ADVOCATE SAATHI — NOTICE ROUTES
// backend/routes/notices.js
// ================================================

const express = require('express');
const router  = express.Router();
const { getNotices, createNotice, getNotice, updateNoticeStatus, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getNotices).post(createNotice);
router.route('/:id').get(getNotice).delete(deleteNotice);
router.patch('/:id/status', updateNoticeStatus);

module.exports = router;

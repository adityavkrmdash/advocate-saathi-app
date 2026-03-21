// ================================================
// ADVOCATE SAATHI — AUTH ROUTES
// backend/routes/auth.js
// ================================================

const express = require('express');
const router  = express.Router();
const { signup, login, getMe, updateMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup',          signup);
router.post('/login',           login);
router.get('/me',               protect, getMe);
router.patch('/me',             protect, updateMe);
router.post('/change-password', protect, changePassword);

module.exports = router;

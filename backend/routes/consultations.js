const express = require('express');
const router  = express.Router();
const { getConsultations, createConsultation, updateStatus, deleteConsultation } = require('../controllers/consultationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getConsultations).post(createConsultation);
router.patch('/:id/status', updateStatus);
router.delete('/:id',       deleteConsultation);

module.exports = router;

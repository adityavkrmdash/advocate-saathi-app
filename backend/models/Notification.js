// ================================================
// ADVOCATE SAATHI — NOTIFICATION MODEL
// backend/models/Notification.js
// ================================================

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['case_saved', 'fir_applicable', 'rights_viewed', 'lawyer_found', 'notice_drafted', 'reminder', 'tip'],
    default: 'tip'
  },
  title:   { type: String, required: true },
  body:    { type: String, required: true },
  icon:    { type: String, default: '🔔' },
  read:    { type: Boolean, default: false },
  caseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Case', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);

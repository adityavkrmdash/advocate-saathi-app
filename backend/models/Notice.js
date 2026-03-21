// ================================================
// ADVOCATE SAATHI — NOTICE MODEL
// backend/models/Notice.js
// ================================================

const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  noticeType: {
    type: String,
    required: true   // e.g. 'Unpaid Salary', 'Security Deposit'
  },
  category: {
    type: String,
    enum: ['labour', 'property', 'consumer', 'cheque', 'civil', 'other'],
    default: 'civil'
  },
  details: {
    type: Map,
    of: String,
    default: {}
  },
  noticeText: {
    type: String,
    default: ''   // full generated notice text
  },
  status: {
    type: String,
    enum: ['drafted', 'sent', 'responded', 'filed'],
    default: 'drafted'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

NoticeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Notice', NoticeSchema);

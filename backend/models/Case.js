// ================================================
// ADVOCATE SAATHI — CASE MODEL
// backend/models/Case.js
// ================================================

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['labour', 'criminal', 'consumer', 'civil', 'family', 'property', 'cyber', 'other'],
    default: 'other'
  },
  firApplicable: {
    type: Boolean,
    default: false
  },
  answers: {
    type: Map,
    of: String,
    default: {}
  },
  messages: [MessageSchema],
  laws: [{ type: String }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'archived'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Case', CaseSchema);

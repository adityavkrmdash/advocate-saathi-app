// ================================================
// ADVOCATE SAATHI — CONSULTATION MODEL
// backend/models/Consultation.js
// ================================================

const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  lawyer: {
    // Stored inline since lawyers may not all be in DB
    name:            { type: String, required: true },
    specialisation:  { type: String, default: '' },
    city:            { type: String, default: '' },
    state:           { type: String, default: '' },
    consultationFee: { type: Number, default: 0 },
    experience:      { type: Number, default: 0 },
    averageRating:   { type: Number, default: 4.0 },
    lawyerId:        { type: String, default: '' }, // MongoDB _id if available
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    default: null
  },
  caseCategory: { type: String, default: '' },
  caseTitle:    { type: String, default: '' },
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'completed', 'cancelled'],
    default: 'requested'
  },
  scheduledAt:  { type: Date, default: null },
  notes:        { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
});

ConsultationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Consultation', ConsultationSchema);

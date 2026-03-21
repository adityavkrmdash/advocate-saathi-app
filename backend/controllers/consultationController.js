// ================================================
// ADVOCATE SAATHI — CONSULTATION CONTROLLER
// backend/controllers/consultationController.js
// ================================================

const Consultation = require('../models/Consultation');
const { createNotification } = require('./notificationController');

// GET /api/consultations
const getConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, consultations });
  } catch (err) { next(err); }
};

// POST /api/consultations — book a consultation
const createConsultation = async (req, res, next) => {
  try {
    const { lawyer, caseId, caseCategory, caseTitle, notes } = req.body;
    if (!lawyer || !lawyer.name) {
      return res.status(400).json({ error: 'Lawyer details are required.' });
    }

    const consultation = await Consultation.create({
      user:         req.user._id,
      lawyer,
      caseId:       caseId       || null,
      caseCategory: caseCategory || '',
      caseTitle:    caseTitle    || '',
      notes:        notes        || '',
    });

    // Auto notification
    await createNotification(
      req.user._id,
      'case_saved',
      'Consultation Requested',
      'Your consultation with ' + lawyer.name + ' has been requested. They will contact you shortly.',
      '👨‍⚖️',
      caseId || null
    );

    res.status(201).json({ success: true, consultation });
  } catch (err) { next(err); }
};

// PATCH /api/consultations/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const c = await Consultation.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!c) return res.status(404).json({ error: 'Consultation not found.' });
    res.json({ success: true, consultation: c });
  } catch (err) { next(err); }
};

// DELETE /api/consultations/:id
const deleteConsultation = async (req, res, next) => {
  try {
    const c = await Consultation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!c) return res.status(404).json({ error: 'Consultation not found.' });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getConsultations, createConsultation, updateStatus, deleteConsultation };

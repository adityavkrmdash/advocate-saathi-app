// ================================================
// ADVOCATE SAATHI — CASE CONTROLLER
// backend/controllers/caseController.js
// ================================================

const Case  = require('../models/Case');
const { createNotification } = require('./notificationController');

// GET /api/cases
const getCases = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id };
    if (status)   filter.status   = status;
    if (category) filter.category = category;

    const cases = await Case.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-messages');

    const total = await Case.countDocuments(filter);
    res.json({ success: true, cases, total, page: Number(page) });
  } catch (err) { next(err); }
};

// POST /api/cases
const createCase = async (req, res, next) => {
  try {
    const { title, category, firApplicable, answers, messages, laws } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const newCase = await Case.create({
      user: req.user._id,
      title,
      category:      category      || 'other',
      firApplicable: firApplicable || false,
      answers:       answers       || {},
      messages:      messages      || [],
      laws:          laws          || [],
    });

    // Auto-create notification for case saved
    await createNotification(
      req.user._id,
      'case_saved',
      'Case Saved — ' + (category || 'Legal'),
      '"' + title + '" has been saved to your history. Tap to view.',
      '✅',
      newCase._id
    );

    // If FIR applicable — create urgent notification
    if (firApplicable) {
      await createNotification(
        req.user._id,
        'fir_applicable',
        'FIR Applicable — Action Required',
        'Your ' + (category || 'legal') + ' case qualifies for an FIR. File it within 7 days for best results.',
        '🚨',
        newCase._id
      );
    }

    res.status(201).json({ success: true, case: newCase });
  } catch (err) { next(err); }
};

// GET /api/cases/:id — with full messages
const getCase = async (req, res, next) => {
  try {
    const c = await Case.findOne({ _id: req.params.id, user: req.user._id });
    if (!c) return res.status(404).json({ error: 'Case not found.' });
    res.json({ success: true, case: c });
  } catch (err) { next(err); }
};

// PATCH /api/cases/:id
const updateCase = async (req, res, next) => {
  try {
    const allowed = ['title', 'status', 'messages', 'laws', 'firApplicable'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    updates.updatedAt = Date.now();

    const c = await Case.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!c) return res.status(404).json({ error: 'Case not found.' });
    res.json({ success: true, case: c });
  } catch (err) { next(err); }
};

// DELETE /api/cases/:id
const deleteCase = async (req, res, next) => {
  try {
    const c = await Case.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!c) return res.status(404).json({ error: 'Case not found.' });
    res.json({ success: true, message: 'Case deleted.' });
  } catch (err) { next(err); }
};

// GET /api/cases/stats
const getStats = async (req, res, next) => {
  try {
    const total    = await Case.countDocuments({ user: req.user._id });
    const active   = await Case.countDocuments({ user: req.user._id, status: 'active' });
    const resolved = await Case.countDocuments({ user: req.user._id, status: 'resolved' });
    const byCategory = await Case.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, stats: { total, active, resolved, byCategory } });
  } catch (err) { next(err); }
};

module.exports = { getCases, createCase, getCase, updateCase, deleteCase, getStats };

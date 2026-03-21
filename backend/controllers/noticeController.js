// ================================================
// ADVOCATE SAATHI — NOTICE CONTROLLER
// backend/controllers/noticeController.js
// ================================================

const Notice = require('../models/Notice');
const { createNotification } = require('./notificationController');

// GET /api/notices — get all notices for user
const getNotices = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const notices = await Notice.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-noticeText');  // exclude full text in list

    const total = await Notice.countDocuments(filter);
    res.json({ success: true, notices, total, page: Number(page) });
  } catch (err) { next(err); }
};

// POST /api/notices — save a new notice
const createNotice = async (req, res, next) => {
  try {
    const { title, noticeType, category, details, noticeText } = req.body;
    if (!title || !noticeType) return res.status(400).json({ error: 'Title and notice type are required.' });

    const notice = await Notice.create({
      user: req.user._id,
      title,
      noticeType,
      category: category || 'civil',
      details:  details  || {},
      noticeText: noticeText || '',
    });

    // Auto-create notification
    await createNotification(
      req.user._id, 'notice_drafted',
      'Legal Notice Drafted',
      '"' + title + '" is ready to send via registered post.',
      '✉️', null
    );

    res.status(201).json({ success: true, notice });
  } catch (err) { next(err); }
};

// GET /api/notices/:id — get single notice with full text
const getNotice = async (req, res, next) => {
  try {
    const n = await Notice.findOne({ _id: req.params.id, user: req.user._id });
    if (!n) return res.status(404).json({ error: 'Notice not found.' });
    res.json({ success: true, notice: n });
  } catch (err) { next(err); }
};

// PATCH /api/notices/:id/status — update notice status
const updateNoticeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const n = await Notice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!n) return res.status(404).json({ error: 'Notice not found.' });
    res.json({ success: true, notice: n });
  } catch (err) { next(err); }
};

// DELETE /api/notices/:id
const deleteNotice = async (req, res, next) => {
  try {
    const n = await Notice.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!n) return res.status(404).json({ error: 'Notice not found.' });
    res.json({ success: true, message: 'Notice deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getNotices, createNotice, getNotice, updateNoticeStatus, deleteNotice };

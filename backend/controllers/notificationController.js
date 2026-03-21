// ================================================
// ADVOCATE SAATHI — NOTIFICATION CONTROLLER
// backend/controllers/notificationController.js
// ================================================

const Notification = require('../models/Notification');

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    const unread = notifications.filter(n => !n.read).length;
    res.json({ success: true, notifications, unread });
  } catch (err) { next(err); }
};

// POST /api/notifications/create (internal use — called after events)
const createNotification = async (userId, type, title, body, icon, caseId = null) => {
  try {
    await Notification.create({ user: userId, type, title, body, icon, caseId });
  } catch (err) {
    console.error('Could not create notification:', err.message);
  }
};

// PATCH /api/notifications/read-all
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// PATCH /api/notifications/:id/read
const markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) { next(err); }
};

// DELETE /api/notifications/:id
const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getNotifications, createNotification, markAllRead, markRead, deleteNotification };

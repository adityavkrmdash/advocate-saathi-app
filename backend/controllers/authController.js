// ================================================
// ADVOCATE SAATHI — AUTH CONTROLLER
// backend/controllers/authController.js
// ================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Generate JWT token ────────────────────────
const signToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

// ── POST /api/auth/signup ─────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Create user
    const user  = await User.create({ name, email, password });
    const token = signToken(user._id);

    console.log(`✅ New user registered: ${email}`);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        plan:  user.plan,
        role:  user.role,
      }
    });

  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact support.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    console.log(`✅ User logged in: ${email}`);

    res.json({
      success: true,
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        plan:  user.plan,
        role:  user.role,
      }
    });

  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me (protected) ──────────────
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// ── PATCH /api/auth/me (protected) ────────────
const updateMe = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'language', 'state'];
    const updates = {};
    allowed.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/change-password (protected) ─
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    const token = signToken(user._id);
    res.json({ success: true, token, message: 'Password changed successfully.' });

  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe, updateMe, changePassword };

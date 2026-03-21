// ================================================
// ADVOCATE SAATHI — LAWYER MODEL
// backend/models/Lawyer.js
// ================================================

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating:    { type: Number, min: 1, max: 5, required: true },
  comment:   { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const LawyerSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true
  },
  photo: {
    type: String, default: ''  // URL to profile photo
  },
  email: {
    type: String, required: true, unique: true, lowercase: true
  },
  phone: {
    type: String, default: ''
  },
  barCouncilId: {
    type: String, required: true, unique: true
  },
  specialisations: [{
    type: String,
    enum: ['labour', 'criminal', 'consumer', 'civil', 'family', 'property', 'cyber', 'corporate', 'tax']
  }],
  experience: {
    type: Number,  // years of experience
    required: true, min: 0
  },
  location: {
    city:  { type: String, required: true },
    state: { type: String, required: true },
  },
  languages: [{
    type: String,  // e.g. ['Hindi', 'English', 'Marathi']
  }],
  consultationFee: {
    type: Number, default: 0  // in INR, 0 = free first consultation
  },
  bio: {
    type: String, maxlength: 1000, default: ''
  },
  reviews: [ReviewSchema],
  averageRating: {
    type: Number, default: 0, min: 0, max: 5
  },
  totalCases: {
    type: Number, default: 0
  },
  isVerified: {
    type: Boolean, default: false
  },
  isAvailable: {
    type: Boolean, default: true
  },
  createdAt: {
    type: Date, default: Date.now
  }
});

// Auto-calculate average rating when reviews change
LawyerSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.averageRating = 0; return; }
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
};

module.exports = mongoose.model('Lawyer', LawyerSchema);

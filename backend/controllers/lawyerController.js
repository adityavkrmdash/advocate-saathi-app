// ================================================
// ADVOCATE SAATHI — LAWYER CONTROLLER
// backend/controllers/lawyerController.js
// ================================================

const Lawyer = require('../models/Lawyer');

// GET /api/lawyers
// Find lawyers by specialisation + location
const getLawyers = async (req, res, next) => {
  try {
    const {
      category,   // case category e.g. 'labour'
      city,
      state,
      minRating = 0,
      maxFee,
      page  = 1,
      limit = 10
    } = req.query;

    const filter = { isAvailable: true };

    if (category)  filter.specialisations = category;
    if (city)      filter['location.city']  = new RegExp(city, 'i');
    if (state)     filter['location.state'] = new RegExp(state, 'i');
    if (minRating) filter.averageRating     = { $gte: Number(minRating) };
    if (maxFee)    filter.consultationFee   = { $lte: Number(maxFee) };

    const lawyers = await Lawyer.find(filter)
      .sort({ averageRating: -1, experience: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-reviews');  // don't return full reviews in list

    const total = await Lawyer.countDocuments(filter);

    res.json({ lawyers, total, page: Number(page) });

  } catch (err) { next(err); }
};

// GET /api/lawyers/:id
const getLawyer = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found.' });
    res.json({ lawyer });
  } catch (err) { next(err); }
};

// POST /api/lawyers/:id/review  (protected)
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required.' });

    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found.' });

    // Remove existing review by this user if any
    lawyer.reviews = lawyer.reviews.filter(
      r => r.user?.toString() !== req.user._id.toString()
    );

    lawyer.reviews.push({ user: req.user._id, rating, comment });
    lawyer.updateRating();
    await lawyer.save();

    res.json({ message: 'Review added.', averageRating: lawyer.averageRating });
  } catch (err) { next(err); }
};

// POST /api/lawyers/seed  — seed dummy lawyer data for testing
const seedLawyers = async (req, res, next) => {
  try {
    await Lawyer.deleteMany({});

    const dummyLawyers = [
      {
        name: 'Adv. Rajesh Sharma', email: 'rajesh@example.com', phone: '9876543210',
        barCouncilId: 'BAR001', specialisations: ['labour', 'civil'],
        experience: 12, location: { city: 'Delhi', state: 'Delhi' },
        languages: ['Hindi', 'English'], consultationFee: 500,
        bio: '12 years experience in labour disputes and civil matters.',
        averageRating: 4.5, totalCases: 340, isVerified: true
      },
      {
        name: 'Adv. Priya Nair', email: 'priya@example.com', phone: '9876543211',
        barCouncilId: 'BAR002', specialisations: ['cyber', 'criminal'],
        experience: 8, location: { city: 'Bangalore', state: 'Karnataka' },
        languages: ['English', 'Kannada', 'Malayalam'], consultationFee: 1000,
        bio: 'Specialist in cyber crime and criminal defence cases.',
        averageRating: 4.8, totalCases: 210, isVerified: true
      },
      {
        name: 'Adv. Suresh Patel', email: 'suresh@example.com', phone: '9876543212',
        barCouncilId: 'BAR003', specialisations: ['consumer', 'property'],
        experience: 15, location: { city: 'Mumbai', state: 'Maharashtra' },
        languages: ['Hindi', 'English', 'Gujarati', 'Marathi'], consultationFee: 800,
        bio: 'Consumer rights and property law specialist with 15 years experience.',
        averageRating: 4.3, totalCases: 520, isVerified: true
      },
      {
        name: 'Adv. Meena Krishnan', email: 'meena@example.com', phone: '9876543213',
        barCouncilId: 'BAR004', specialisations: ['family', 'civil'],
        experience: 10, location: { city: 'Chennai', state: 'Tamil Nadu' },
        languages: ['Tamil', 'English'], consultationFee: 600,
        bio: 'Family law expert handling divorce, custody, and maintenance cases.',
        averageRating: 4.6, totalCases: 290, isVerified: true
      },
      {
        name: 'Adv. Amit Gupta', email: 'amit@example.com', phone: '9876543214',
        barCouncilId: 'BAR005', specialisations: ['labour', 'criminal', 'cyber'],
        experience: 6, location: { city: 'Pune', state: 'Maharashtra' },
        languages: ['Hindi', 'English', 'Marathi'], consultationFee: 0,
        bio: 'Young lawyer offering free first consultation for labour and cyber cases.',
        averageRating: 4.1, totalCases: 95, isVerified: true
      },
    ];

    await Lawyer.insertMany(dummyLawyers);
    res.json({ message: `${dummyLawyers.length} lawyers seeded successfully.` });

  } catch (err) { next(err); }
};

module.exports = { getLawyers, getLawyer, addReview, seedLawyers };

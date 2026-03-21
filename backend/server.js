require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB               = require('./config/db');
const authRoutes              = require('./routes/auth');
const chatRoutes              = require('./routes/chat');
const caseRoutes              = require('./routes/cases');
const noticeRoutes            = require('./routes/notices');
const notificationRoutes      = require('./routes/notifications');
const lawyerRoutes            = require('./routes/lawyers');
const consultationRoutes      = require('./routes/consultations');
const errorHandler            = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use('/api/', rateLimit({ windowMs:15*60*1000, max:300, message:{ error:'Too many requests.' } }));
app.use('/api/auth', rateLimit({ windowMs:15*60*1000, max:20, message:{ error:'Too many auth attempts.' } }));
app.use(express.json({ limit:'50kb' }));
app.use(express.urlencoded({ extended:true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status:'ok', app:'Advocate Saathi', version:'4.0.0' }));

app.use('/api/auth',          authRoutes);
app.use('/api/chat',          chatRoutes);
app.use('/api/cases',         caseRoutes);
app.use('/api/notices',       noticeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/lawyers',       lawyerRoutes);
app.use('/api/consultations', consultationRoutes);

app.use((req, res) => res.status(404).json({ error: `Route ${req.originalUrl} not found` }));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n✅ Advocate Saathi backend running on port ${PORT}`);
  console.log(`   Env: ${process.env.NODE_ENV}`);
  console.log(`   DB:  ${process.env.MONGO_URI?.split('@')[1] || 'connected'}\n`);
});

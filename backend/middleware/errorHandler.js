// ================================================
// ADVOCATE SAATHI — GLOBAL ERROR HANDLER
// backend/middleware/errorHandler.js
// ================================================

const errorHandler = (err, req, res, next) => {
  let status  = err.statusCode || 500;
  let message = err.message    || 'Internal server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    status  = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    status  = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { status = 401; message = 'Invalid token.'; }
  if (err.name === 'TokenExpiredError')  { status = 401; message = 'Token expired.'; }

  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', err);
  }

  res.status(status).json({ error: message });
};

module.exports = errorHandler;

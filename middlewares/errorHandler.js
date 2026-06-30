// middlewares/errorHandler.js

// 404 handler — must be registered after all routes.
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Final error handler — catches anything thrown/passed via next(err).
function errorHandler(err, req, res, next) {
  console.error('🔥 Unhandled error:', err.message);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: Object.values(err.errors)[0].message });
  }

  // Mongoose duplicate key (e.g. duplicate email on unique field)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `This ${field} is already registered.` });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong. Please try again.'
  });
}

module.exports = { notFound, errorHandler };

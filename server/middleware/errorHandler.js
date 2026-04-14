/**
 * Error Handler Middleware
 * Centralized error handling for all routes
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.validation) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation error',
      errors: err.errors,
    });
  }

  // Authentication errors
  if (err.status === 401) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  // Firebase/Firestore errors
  if (err.code === 'permission-denied') {
    return res.status(403).json({
      success: false,
      message: 'Permission denied',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;

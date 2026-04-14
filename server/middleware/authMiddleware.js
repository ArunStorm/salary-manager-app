/**
 * Authentication Middleware
 * Validates JWT token in Authorization header
 * To be implemented later - currently a placeholder
 */

const authMiddleware = (req, res, next) => {
  // For MVP: Skip token validation
  // In production: Validate JWT token from Authorization header
  
  const token = req.headers.authorization?.split(' ')[1];
  
  // TODO: Validate token and set req.user
  // if (!token) {
  //   return res.status(401).json({ success: false, message: 'Unauthorized' });
  // }
  
  next();
};

module.exports = authMiddleware;

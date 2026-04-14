/**
 * Authorization Middleware
 * Role-based access control (RBAC) for protected routes
 */

const authorizationMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Missing or invalid authorization header',
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Decode token (Base64: userId:role:username)
      let decodedToken;
      try {
        decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format',
        });
      }

      const [userId, role, username] = decodedToken.split(':');

      if (!userId || !role || !username) {
        return res.status(401).json({
          success: false,
          message: 'Token contains invalid data',
        });
      }

      // Attach user to request object
      req.user = {
        id: userId,
        role,
        username,
      };

      // Check if user has required role (unless user is ADMIN)
      if (requiredRole && role !== requiredRole && role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${requiredRole}`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authorization check failed',
        error: error.message,
      });
    }
  };
};

module.exports = authorizationMiddleware;

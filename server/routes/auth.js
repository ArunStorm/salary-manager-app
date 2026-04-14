/**
 * Authentication Routes
 * Login and session management
 */

const express = require('express');
const router = express.Router();

/**
 * POST /api/auth/login
 * Mock authentication - accepts any username/password
 * In production: Validate against database and return JWT
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Mock authentication - accept any credentials
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'employee';
    
    const token = `mock_token_${Date.now()}`;
    
    const user = {
      id: `user_${Date.now()}`,
      username,
      role,
      loginTime: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout (clearance on client side)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;

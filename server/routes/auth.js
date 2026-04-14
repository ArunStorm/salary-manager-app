/**
 * Authentication Routes
 * Login and session management
 */

const express = require('express');
const router = express.Router();
const db = require('../firebase');

/**
 * POST /api/auth/login
 * Authenticate user against Firestore and return Bearer token
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

    // Query Firestore for user with matching username
    const userSnapshot = await db
      .collection('users')
      .where('username', '==', username)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Validate password
    if (userData.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Generate Bearer token (Base64 encoded: userId:role:username)
    const tokenData = `${userDoc.id}:${userData.role}:${username}`;
    const token = Buffer.from(tokenData).toString('base64');

    const user = {
      id: userDoc.id,
      username,
      role: userData.role,
      userGroup: userData.userGroup,
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

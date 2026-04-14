/**
 * Users Routes
 * User credentials and user management (admin-only operations)
 */

const express = require('express');
const router = express.Router();
const db = require('../firebase');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

/**
 * GET /api/users
 * Fetch all users (admin only)
 */
router.get('/', authorizationMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const snapshot = await db.collection('users').get();

    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username,
        role: data.role,
        userGroup: data.userGroup,
        createdAt: data.createdAt,
        // Do NOT return password in list
      };
    });

    res.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users
 * Create new user (admin only)
 */
router.post('/', authorizationMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { username, password, userGroup } = req.body;

    // Validation
    if (!username || !password || !userGroup) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and userGroup are required',
      });
    }

    if (!['ADMIN', 'REGULAR'].includes(userGroup)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userGroup. Must be ADMIN or REGULAR',
      });
    }

    // Check if username already exists
    const existingUser = await db
      .collection('users')
      .where('username', '==', username)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Create user document
    const userData = {
      username,
      password, // In production: hash the password
      userGroup,
      role: userGroup === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
      createdAt: new Date(),
    };

    const docRef = await db.collection('users').add(userData);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: docRef.id,
        username: userData.username,
        userGroup: userData.userGroup,
        role: userData.role,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/:id
 * Update user details (admin only)
 */
router.put('/:id', authorizationMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, userGroup } = req.body;

    if (!userGroup || !['ADMIN', 'REGULAR'].includes(userGroup)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userGroup. Must be ADMIN or REGULAR',
      });
    }

    const updateData = {
      userGroup,
      role: userGroup === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
      updatedAt: new Date(),
    };

    if (password) {
      updateData.password = password; // In production: hash the password
    }

    await db.collection('users').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id,
        userGroup: updateData.userGroup,
        role: updateData.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/users/:id
 * Delete user (admin only)
 */
router.delete('/:id', authorizationMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await db.collection('users').doc(id).delete();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

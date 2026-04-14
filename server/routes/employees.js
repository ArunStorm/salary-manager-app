/**
 * Employee Routes
 * CRUD operations for employee management
 */

const express = require('express');
const router = express.Router();
const db = require('../firebase');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

/**
 * GET /api/employees
 * Fetch all employees with pagination
 */
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', department = '' } = req.query;
    
    let query = db.collection('employees');

    // TODO: Add search and filter logic
    // if (search) { ... }
    // if (department) { ... }

    const snapshot = await query.get();

    const employees = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: employees,
      total: employees.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/employees
 * Create new employee (admin only)
 */
router.post('/', authorizationMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { name, email, phone, role, department, joinDate, basicSalary } = req.body;

    // TODO: Add validation
    if (!name || !email || !role || !department) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, role, department',
      });
    }

    const employeeData = {
      name,
      email,
      phone: phone || '',
      role,
      department,
      joinDate: new Date(joinDate),
      basicSalary: parseInt(basicSalary) || 0,
      status: 'active',
      createdAt: new Date(),
    };

    const docRef = await db.collection('employees').add(employeeData);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: {
        id: docRef.id,
        ...employeeData,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/employees/:id
 * Get employee details with salary history
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const empDoc = await db.collection('employees').doc(id).get();

    if (!empDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const salarySnapshot = await db
      .collection('employees')
      .doc(id)
      .collection('salaryRecords')
      .orderBy('processedDate', 'desc')
      .limit(12)
      .get();

    const salaryHistory = salarySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: {
        id: empDoc.id,
        ...empDoc.data(),
        salaryHistory,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/employees/:id
 * Update employee details (admin only)
 */
router.put('/:id', authorizationMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, department, basicSalary, status } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (basicSalary !== undefined) updateData.basicSalary = parseInt(basicSalary);
    if (status !== undefined) updateData.status = status;
    updateData.updatedAt = new Date();

    await db.collection('employees').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: { id, ...updateData },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/employees/:id
 * Soft delete employee (mark as inactive) - admin only
 */
router.delete('/:id', authorizationMiddleware('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.collection('employees').doc(id).update({
      status: 'inactive',
      deletedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

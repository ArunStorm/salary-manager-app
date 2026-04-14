/**
 * Salary Routes
 * Salary structure, salary records, and payroll management
 */

const express = require('express');
const router = express.Router();
const db = require('../firebase');

/**
 * POST /api/salary/:employeeId/monthly
 * Create/process salary record for a specific month
 */
router.post('/:employeeId/monthly', async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { 
      monthYear,
      basicSalary,
      allowances = {},
      deductions = {},
      advanceDeduction = 0,
      presentDays = 0,
      totalDays = 22,
    } = req.body;

    // TODO: Add validation
    if (!monthYear || !basicSalary) {
      return res.status(400).json({
        success: false,
        message: 'monthYear and basicSalary are required',
      });
    }

    // Calculate salary
    const grossSalary = basicSalary + Object.values(allowances).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0) + advanceDeduction;
    const netSalary = grossSalary - totalDeductions;

    const salaryData = {
      monthYear,
      basicSalary,
      allowances,
      deductions,
      advanceDeduction,
      grossSalary,
      totalDeductions,
      netSalary,
      presentDays,
      totalDays,
      status: 'Processed',
      processedDate: new Date(),
    };

    const docRef = await db
      .collection('employees')
      .doc(employeeId)
      .collection('salaryRecords')
      .add(salaryData);

    res.status(201).json({
      success: true,
      message: 'Salary record created successfully',
      data: {
        id: docRef.id,
        ...salaryData,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/salary/:employeeId/history
 * Get salary history for an employee
 */
router.get('/:employeeId/history', async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { months = 12 } = req.query;

    const snapshot = await db
      .collection('employees')
      .doc(employeeId)
      .collection('salaryRecords')
      .orderBy('processedDate', 'desc')
      .limit(parseInt(months))
      .get();

    const salaryHistory = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: salaryHistory,
      total: salaryHistory.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/salary/:employeeId/:recordId
 * Update salary record (only if not processed)
 */
router.put('/:employeeId/:recordId', async (req, res, next) => {
  try {
    const { employeeId, recordId } = req.params;
    const { 
      basicSalary, 
      allowances = {}, 
      deductions = {}, 
      advanceDeduction = 0 
    } = req.body;

    // Check if record exists and status is Pending
    const recordDoc = await db
      .collection('employees')
      .doc(employeeId)
      .collection('salaryRecords')
      .doc(recordId)
      .get();

    if (!recordDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found',
      });
    }

    if (recordDoc.data().status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only update pending records',
      });
    }

    // Recalculate
    const grossSalary = basicSalary + Object.values(allowances).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0) + advanceDeduction;
    const netSalary = grossSalary - totalDeductions;

    const updateData = {
      basicSalary,
      allowances,
      deductions,
      advanceDeduction,
      grossSalary,
      totalDeductions,
      netSalary,
      updatedAt: new Date(),
    };

    await db
      .collection('employees')
      .doc(employeeId)
      .collection('salaryRecords')
      .doc(recordId)
      .update(updateData);

    res.json({
      success: true,
      message: 'Salary record updated successfully',
      data: { id: recordId, ...updateData },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

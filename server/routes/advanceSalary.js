/**
 * Advance Salary Routes
 * Manage employee advance salary requests and approvals
 */

const express = require('express');
const router = express.Router();
const db = require('../firebase');

/**
 * POST /api/advance-salary
 * Create new advance salary request (Admin only)
 */
router.post('/', async (req, res, next) => {
  try {
    const { employeeId, amount, reason } = req.body;

    if (!employeeId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'employeeId and amount are required',
      });
    }

    const requestData = {
      employeeId,
      amount: parseInt(amount),
      reason: reason || '',
      status: 'Pending',
      requestedDate: new Date(),
    };

    const docRef = await db
      .collection('employees')
      .doc(employeeId)
      .collection('advanceRequests')
      .add(requestData);

    res.status(201).json({
      success: true,
      message: 'Advance request created successfully',
      data: {
        id: docRef.id,
        ...requestData,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/advance-salary/all
 * List all advance requests (Admin only)
 */
router.get('/all', async (req, res, next) => {
  try {
    const { status, employeeId } = req.query;

    let query = db.collectionGroup('advanceRequests');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.orderBy('requestedDate', 'desc').get();

    let requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by employeeId if provided
    if (employeeId) {
      requests = requests.filter(r => r.employeeId === employeeId);
    }

    res.json({
      success: true,
      data: requests,
      total: requests.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/advance-salary/:employeeId
 * Get employee's own advance requests
 */
router.get('/:employeeId', async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const snapshot = await db
      .collection('employees')
      .doc(employeeId)
      .collection('advanceRequests')
      .orderBy('requestedDate', 'desc')
      .get();

    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: requests,
      total: requests.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/advance-salary/:employeeId/:requestId/approve
 * Approve advance request (Admin only)
 */
router.put('/:employeeId/:requestId/approve', async (req, res, next) => {
  try {
    const { employeeId, requestId } = req.params;
    const { approvedAmount, deductionMonth, approvedBy } = req.body;

    if (!approvedAmount || !deductionMonth) {
      return res.status(400).json({
        success: false,
        message: 'approvedAmount and deductionMonth are required',
      });
    }

    const updateData = {
      status: 'Approved',
      adminApprovedAmount: parseInt(approvedAmount),
      deductionMonth,
      approvalDate: new Date(),
      approvedBy: approvedBy || 'admin',
    };

    await db
      .collection('employees')
      .doc(employeeId)
      .collection('advanceRequests')
      .doc(requestId)
      .update(updateData);

    res.json({
      success: true,
      message: 'Advance request approved successfully',
      data: { id: requestId, ...updateData },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/advance-salary/:employeeId/:requestId/reject
 * Reject advance request (Admin only)
 */
router.put('/:employeeId/:requestId/reject', async (req, res, next) => {
  try {
    const { employeeId, requestId } = req.params;
    const { rejectionReason } = req.body;

    const updateData = {
      status: 'Rejected',
      rejectionReason: rejectionReason || '',
      rejectionDate: new Date(),
    };

    await db
      .collection('employees')
      .doc(employeeId)
      .collection('advanceRequests')
      .doc(requestId)
      .update(updateData);

    res.json({
      success: true,
      message: 'Advance request rejected successfully',
      data: { id: requestId, ...updateData },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/advance-salary/pending/:employeeId/month/:monthYear
 * Get approved advance deduction amount for a specific month
 * (Used during payroll generation)
 */
router.get('/pending/:employeeId/month/:monthYear', async (req, res, next) => {
  try {
    const { employeeId, monthYear } = req.params;

    const snapshot = await db
      .collection('employees')
      .doc(employeeId)
      .collection('advanceRequests')
      .where('status', '==', 'Approved')
      .where('deductionMonth', '==', monthYear)
      .get();

    let totalDeduction = 0;
    const advances = snapshot.docs.map(doc => {
      const data = doc.data();
      totalDeduction += data.adminApprovedAmount || 0;
      return {
        id: doc.id,
        ...data,
      };
    });

    res.json({
      success: true,
      data: {
        advances,
        totalDeduction,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

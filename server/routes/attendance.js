/**
 * Attendance Routes
 * Mark and track employee attendance
 */

const express = require('express');
const router = express.Router();
const db = require('../firebase');

/**
 * POST /api/attendance/:employeeId/:monthYear
 * Mark/update attendance for a day
 */
router.post('/:employeeId/:monthYear', async (req, res, next) => {
  try {
    const { employeeId, monthYear } = req.params;
    const { day, status, notes } = req.body;

    if (!day || !status) {
      return res.status(400).json({
        success: false,
        message: 'day and status are required',
      });
    }

    const attendanceData = {
      [day]: {
        status,
        notes: notes || '',
        updatedAt: new Date(),
      },
    };

    await db
      .collection('employees')
      .doc(employeeId)
      .collection('attendanceRecords')
      .doc(monthYear)
      .set(attendanceData, { merge: true });

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendanceData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/attendance/:employeeId/:monthYear
 * Get monthly attendance record
 */
router.get('/:employeeId/:monthYear', async (req, res, next) => {
  try {
    const { employeeId, monthYear } = req.params;

    const doc = await db
      .collection('employees')
      .doc(employeeId)
      .collection('attendanceRecords')
      .doc(monthYear)
      .get();

    if (!doc.exists) {
      return res.json({
        success: true,
        data: {},
        message: 'No attendance records found',
      });
    }

    res.json({
      success: true,
      data: doc.data(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/attendance/:employeeId/summary
 * Get attendance summary (present, absent, leaves)
 */
router.get('/:employeeId/summary', async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { monthYear } = req.query;

    if (!monthYear) {
      return res.status(400).json({
        success: false,
        message: 'monthYear query parameter is required',
      });
    }

    const doc = await db
      .collection('employees')
      .doc(employeeId)
      .collection('attendanceRecords')
      .doc(monthYear)
      .get();

    const record = doc.data() || {};

    const summary = {
      present: 0,
      absent: 0,
      leave: 0,
      holiday: 0,
      total: 0,
    };

    Object.values(record).forEach(entry => {
      if (entry?.status) {
        summary[entry.status.toLowerCase()]++;
        summary.total++;
      }
    });

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

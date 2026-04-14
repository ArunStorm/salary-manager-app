/**
 * Payslip Routes
 * Generate and manage PDF payslips
 */

const express = require('express');
const router = express.Router();
const db = require('../firebase');
const PDFDocument = require('pdfkit');

/**
 * GET /api/payslip/:employeeId/:monthYear
 * Generate PDF payslip for employee
 */
router.get('/:employeeId/:monthYear', async (req, res, next) => {
  try {
    const { employeeId, monthYear } = req.params;

    // Get employee data
    const empDoc = await db.collection('employees').doc(employeeId).get();
    if (!empDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Get salary record
    const salaryDoc = await db
      .collection('employees')
      .doc(employeeId)
      .collection('salaryRecords')
      .where('monthYear', '==', monthYear)
      .limit(1)
      .get();

    if (salaryDoc.empty) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found for this month',
      });
    }

    const employee = empDoc.data();
    const salary = salaryDoc.docs[0].data();

    // Generate PDF
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="payslip_${employeeId}_${monthYear}.pdf"`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('SALARY PAYSLIP', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text('═'.repeat(80), { align: 'center' });
    doc.moveDown(0.5);

    // Employee Info
    doc.fontSize(11).font('Helvetica-Bold').text('Employee Information', { underline: true });
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${employee.name}`, { width: 200 });
    doc.text(`Email: ${employee.email}`, { width: 200 });
    doc.text(`Department: ${employee.department}`, { width: 200 });
    doc.text(`Designation: ${employee.role}`, { width: 200 });
    doc.moveDown(0.3);

    doc.text(`Month: ${salary.monthYear}`, { width: 200 });
    doc.text(`Processed Date: ${new Date(salary.processedDate).toLocaleDateString()}`, { width: 200 });
    doc.moveDown(0.5);

    // Salary Breakdown Table
    doc.fontSize(11).font('Helvetica-Bold').text('Salary Breakdown', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(9).font('Helvetica');

    const tableData = [
      ['Description', 'Amount (₹)'],
      ['Basic Salary', salary.basicSalary.toLocaleString('en-IN')],
    ];

    // Add allowances
    if (salary.allowances && Object.keys(salary.allowances).length > 0) {
      Object.entries(salary.allowances).forEach(([key, value]) => {
        tableData.push([key.charAt(0).toUpperCase() + key.slice(1), value.toLocaleString('en-IN')];
      });
    }

    tableData.push(['Gross Salary', salary.grossSalary.toLocaleString('en-IN')]);
    doc.moveDown(0.3);

    // Deductions
    doc.fontSize(10).font('Helvetica-Bold').text('Deductions:', { underline: false });
    doc.fontSize(9).font('Helvetica');
    if (salary.deductions && Object.keys(salary.deductions).length > 0) {
      Object.entries(salary.deductions).forEach(([key, value]) => {
        doc.text(`${key.toUpperCase()}: -₹${value.toLocaleString('en-IN')}`);
      });
    }

    if (salary.advanceDeduction && salary.advanceDeduction > 0) {
      doc.text(`Advance Deduction: -₹${salary.advanceDeduction.toLocaleString('en-IN')}`);
    }

    doc.moveDown(0.5);

    // Net Salary
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`NET SALARY: ₹${salary.netSalary.toLocaleString('en-IN')}`, { align: 'right' });
    doc.moveDown(1);

    // Footer
    doc.fontSize(9).font('Helvetica').text('═'.repeat(80), { align: 'center' });
    doc.text('This is an electronically generated document. No signature is required.', { align: 'center' });

    doc.end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

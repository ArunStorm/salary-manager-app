/**
 * Salary Management HRMS - Backend Server
 * Express.js server with modular routes and Firebase Firestore integration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./firebase');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');
const salaryRoutes = require('./routes/salary');
const payslipRoutes = require('./routes/payslip');
const advanceSalaryRoutes = require('./routes/advanceSalary');

// Initialize Express app
const app = express();

/* ==================== MIDDLEWARE ==================== */

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Middleware (to be applied to protected routes)
// app.use(authMiddleware);

/* ==================== HEALTH CHECK ROUTE ==================== */

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Salary Management API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

/* ==================== API ROUTES ==================== */

// Authentication Routes
app.use('/api/auth', authRoutes);

// Users Routes
app.use('/api/users', usersRoutes);

// Employee Routes
app.use('/api/employees', employeeRoutes);

// Attendance Routes
app.use('/api/attendance', attendanceRoutes);

// Salary Routes
app.use('/api/salary', salaryRoutes);

// Payslip Routes
app.use('/api/payslip', payslipRoutes);

// Advance Salary Routes
app.use('/api/advance-salary', advanceSalaryRoutes);

/* ==================== ERROR HANDLING ==================== */

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error Handler (must be last)
app.use(errorHandler);

/* ==================== SERVER STARTUP ==================== */

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║     Salary Management HRMS Backend - Running        ║
╚══════════════════════════════════════════════════════╝

📍 Server: http://localhost:${PORT}
🌍 Environment: ${NODE_ENV}
🔌 CORS Origin: ${corsOptions.origin}

✨ Ready to accept connections...
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
  });
});
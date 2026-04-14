/**
 * Application Constants
 * Centralized configuration for roles, salary components, statuses, etc.
 */

// ==================== ROLES ====================
export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  EMPLOYEE: 'employee',
};

export const ROLE_LABELS = {
  admin: 'Administrator',
  hr: 'HR Manager',
  employee: 'Employee',
};

// ==================== ATTENDANCE STATUSES ====================
export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LEAVE: 'Leave',
  HOLIDAY: 'Holiday',
};

export const ATTENDANCE_COLORS = {
  Present: '#10B981',   // Green
  Absent: '#EF4444',    // Red
  Leave: '#3B82F6',     // Blue
  Holiday: '#9CA3AF',   // Gray
};

// ==================== SALARY COMPONENTS ====================
export const ALLOWANCES = [
  { id: 'hra', label: 'HRA (House Rent Allowance)', percentage: 10 },
  { id: 'da', label: 'DA (Dearness Allowance)', percentage: 5 },
  { id: 'conveyance', label: 'Conveyance Allowance', percentage: 0 },
  { id: 'medical', label: 'Medical Allowance', percentage: 0 },
  { id: 'other', label: 'Other Allowances', percentage: 0 },
];

export const DEDUCTIONS = [
  { id: 'pf', label: 'PF (Provident Fund)', percentage: 12 },
  { id: 'esi', label: 'ESI (Employee State Insurance)', percentage: 0 },
  { id: 'tds', label: 'TDS (Tax Deducted at Source)', percentage: 0 },
  { id: 'insurance', label: 'Insurance', percentage: 0 },
  { id: 'loan', label: 'Loan Deduction', percentage: 0 },
];

// ==================== PAYROLL STATUSES ====================
export const PAYROLL_STATUS = {
  PENDING: 'Pending',
  PROCESSED: 'Processed',
  PAID: 'Paid',
};

export const PAYROLL_STATUS_COLORS = {
  Pending: '#F59E0B',    // Amber
  Processed: '#3B82F6',  // Blue
  Paid: '#10B981',       // Green
};

// ==================== ADVANCE REQUEST STATUSES ====================
export const ADVANCE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const ADVANCE_STATUS_COLORS = {
  Pending: '#F59E0B',    // Amber
  Approved: '#10B981',   // Green
  Rejected: '#EF4444',   // Red
};

// ==================== DEPARTMENTS ====================
export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Support',
  'Admin',
];

// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',

  // Employees
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: (id) => `/employees/${id}`,
  EMPLOYEE_UPDATE: (id) => `/employees/${id}`,
  EMPLOYEE_DELETE: (id) => `/employees/${id}`,

  // Attendance
  ATTENDANCE: '/attendance',
  ATTENDANCE_RECORD: (employeeId, month) => `/attendance/${employeeId}/${month}`,
  ATTENDANCE_SUMMARY: (employeeId) => `/attendance/${employeeId}/summary`,

  // Salary
  SALARY: '/salary',
  SALARY_HISTORY: (employeeId) => `/salary/${employeeId}`,
  SALARY_RECORD: (employeeId, recordId) => `/salary/${employeeId}/${recordId}`,

  // Payslip
  PAYSLIP: (employeeId, monthYear) => `/payslip/${employeeId}/${monthYear}`,

  // Advance Salary
  ADVANCE_REQUESTS: '/advance-salary',
  ADVANCE_REQUEST_DETAIL: (requestId) => `/advance-salary/${requestId}`,
  ADVANCE_APPROVE: (requestId) => `/advance-salary/${requestId}/approve`,
  ADVANCE_REJECT: (requestId) => `/advance-salary/${requestId}/reject`,
  ADVANCE_EMPLOYEE: (employeeId) => `/advance-salary/${employeeId}`,
  ADVANCE_PENDING: (employeeId, monthYear) => `/advance-salary/pending/${employeeId}/month/${monthYear}`,

  // Salary Increment
  SALARY_INCREMENT: '/salary-increment',
};

// ==================== DESIGN SYSTEM ====================
export const COLORS = {
  // Primary
  primary: '#4F46E5',     // Indigo
  primaryLight: '#E0E7FF',
  primaryDark: '#3730A3',

  // Secondary
  secondary: '#7C3AED',    // Violet
  secondaryLight: '#EDE9FE',
  secondaryDark: '#5B21B6',

  // Status Colors
  success: '#10B981',     // Green
  danger: '#EF4444',      // Red
  warning: '#F59E0B',     // Amber
  info: '#3B82F6',        // Blue

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Dark Mode
  darkBg: '#1F2937',
  darkText: '#F9FAFB',
  darkBorder: '#374151',
};

export const SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};

export const TYPOGRAPHY = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'Fira Code, Courier New, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
};

// ==================== PAGINATION ====================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// ==================== DATE FORMAT ====================
export const DATE_FORMAT = {
  DISPLAY: 'DD MMM YYYY',           // 14 Apr 2026
  API: 'YYYY-MM-DD',                 // 2026-04-14
  MONTH_YEAR: 'YYYY-MM',             // 2026-04
  FULL_DATE: 'DD MMMM YYYY',         // 14 April 2026
};

// ==================== VALIDATION ====================
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  AMOUNT_MIN: 0,
  AMOUNT_MAX: 9999999,
};

// ==================== MESSAGES ====================
export const MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred. Please try again.',
  CONFIRM_DELETE: 'Are you sure you want to delete this item?',
  UNSAVED_CHANGES: 'You have unsaved changes. Do you want to leave?',
};

export default {
  ROLES,
  ROLE_LABELS,
  ATTENDANCE_STATUS,
  ATTENDANCE_COLORS,
  ALLOWANCES,
  DEDUCTIONS,
  PAYROLL_STATUS,
  PAYROLL_STATUS_COLORS,
  ADVANCE_STATUS,
  ADVANCE_STATUS_COLORS,
  DEPARTMENTS,
  API_ENDPOINTS,
  COLORS,
  SPACING,
  TYPOGRAPHY,
  PAGINATION,
  DATE_FORMAT,
  VALIDATION,
  MESSAGES,
};

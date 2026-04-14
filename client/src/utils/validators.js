/**
 * Validation Utilities
 * Centralized validation functions for forms and data
 */

import { VALIDATION } from './constants';

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email.trim());
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return VALIDATION.PHONE_REGEX.test(phone.replace(/\D/g, ''));
};

/**
 * Validate amount is within range
 * @param {number} amount
 * @returns {boolean}
 */
export const isValidAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num >= VALIDATION.AMOUNT_MIN && num <= VALIDATION.AMOUNT_MAX;
};

/**
 * Validate date is not in future
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isNotFutureDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate <= today;
};

/**
 * Validate date is not in past
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isNotPastDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

/**
 * Validate that joinDate is before today
 * @param {Date|string} joinDate
 * @returns {object} { valid: boolean, error: string }
 */
export const validateJoinDate = (joinDate) => {
  if (!joinDate) {
    return { valid: false, error: 'Join date is required' };
  }
  
  if (!isNotFutureDate(joinDate)) {
    return { valid: false, error: 'Join date cannot be in the future' };
  }
  
  return { valid: true, error: '' };
};

/**
 * Validate salary amount
 * @param {number} amount
 * @returns {object} { valid: boolean, error: string }
 */
export const validateSalaryAmount = (amount) => {
  if (!amount && amount !== 0) {
    return { valid: false, error: 'Amount is required' };
  }
  
  const num = parseFloat(amount);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Amount must be a number' };
  }
  
  if (num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (num > VALIDATION.AMOUNT_MAX) {
    return { valid: false, error: `Amount cannot exceed ₹${VALIDATION.AMOUNT_MAX}` };
  }
  
  return { valid: true, error: '' };
};

/**
 * Validate employee form
 * @param {object} data
 * @returns {object} { valid: boolean, errors: {} }
 */
export const validateEmployeeForm = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }

  if (!data.role || !data.role.trim()) {
    errors.role = 'Role is required';
  }

  if (!data.department) {
    errors.department = 'Department is required';
  }

  if (!data.joinDate) {
    errors.joinDate = 'Join date is required';
  } else {
    const dateValidation = validateJoinDate(data.joinDate);
    if (!dateValidation.valid) {
      errors.joinDate = dateValidation.error;
    }
  }

  if (data.basicSalary !== null && data.basicSalary !== undefined && data.basicSalary !== '') {
    const salaryValidation = validateSalaryAmount(data.basicSalary);
    if (!salaryValidation.valid) {
      errors.basicSalary = salaryValidation.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate salary structure form
 * @param {object} data
 * @returns {object} { valid: boolean, errors: {} }
 */
export const validateSalaryStructure = (data) => {
  const errors = {};

  if (!data.basicSalary || data.basicSalary <= 0) {
    errors.basicSalary = 'Basic salary must be greater than 0';
  }

  // Validate allowances
  const allowances = data.allowances || {};
  Object.keys(allowances).forEach(key => {
    if (allowances[key] < 0) {
      errors[`allowance_${key}`] = 'Allowance cannot be negative';
    }
  });

  // Validate deductions
  const deductions = data.deductions || {};
  Object.keys(deductions).forEach(key => {
    if (deductions[key] < 0) {
      errors[`deduction_${key}`] = 'Deduction cannot be negative';
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate advance request form
 * @param {object} data
 * @returns {object} { valid: boolean, errors: {} }
 */
export const validateAdvanceRequest = (data) => {
  const errors = {};

  if (!data.employeeId) {
    errors.employeeId = 'Employee is required';
  }

  const amountValidation = validateSalaryAmount(data.amount);
  if (!amountValidation.valid) {
    errors.amount = amountValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login form
 * @param {object} data
 * @returns {object} { valid: boolean, errors: {} }
 */
export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.username || !data.username.trim()) {
    errors.username = 'Username is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get error message for a field
 * @param {object} errors
 * @param {string} fieldName
 * @returns {string|null}
 */
export const getFieldError = (errors, fieldName) => {
  return errors?.[fieldName] || null;
};

/**
 * Check if field has error
 * @param {object} errors
 * @param {string} fieldName
 * @returns {boolean}
 */
export const hasFieldError = (errors, fieldName) => {
  return !!errors?.[fieldName];
};

export default {
  isValidEmail,
  isValidPhone,
  isValidAmount,
  isNotFutureDate,
  isNotPastDate,
  validateJoinDate,
  validateSalaryAmount,
  validateEmployeeForm,
  validateSalaryStructure,
  validateAdvanceRequest,
  validateLoginForm,
  getFieldError,
  hasFieldError,
};

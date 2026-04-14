/**
 * Formatter Utilities
 * Centralized functions for formatting dates, currency, and other data types
 */

/**
 * Format date to readable string
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - Format type: 'short', 'long', 'monthYear'
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },      // 14 Apr 2026
    long: { year: 'numeric', month: 'long', day: 'numeric' },        // 14 April 2026
    monthYear: { year: 'numeric', month: 'short' },                  // Apr 2026
    fullDate: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };

  return d.toLocaleDateString('en-IN', options[format] || options.short);
};

/**
 * Format date to YYYY-MM format (for month selector)
 * @param {Date|string} date
 * @returns {string} YYYY-MM format
 */
export const formatDateToMonth = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Format currency value in INR
 * @param {number} amount
 * @returns {string} Formatted currency (₹10,000)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency without symbol (for inputs/display)
 * @param {number} amount
 * @returns {string} Formatted number (10,000)
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined) return '0';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 * @param {number} value
 * @returns {string} Percentage string (15.5%)
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  return `${parseFloat(value).toFixed(2)}%`;
};

/**
 * Get month name from date
 * @param {Date|string} date
 * @returns {string} Month name
 */
export const getMonthName = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

/**
 * Get month year string from YYYY-MM format
 * @param {string} monthYear
 * @returns {string} Month name and year
 */
export const displayMonthYear = (monthYear) => {
  if (!monthYear) return '';
  const [year, month] = monthYear.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

/**
 * Truncate string to specified length
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncateString = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Capitalize first letter of string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format name (capitalize each word)
 * @param {string} name
 * @returns {string}
 */
export const formatName = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => capitalize(word.toLowerCase()))
    .join(' ');
};

/**
 * Format email (lowercase)
 * @param {string} email
 * @returns {string}
 */
export const formatEmail = (email) => {
  return email?.toLowerCase().trim() || '';
};

/**
 * Get working days in a month (exclude weekends)
 * @param {number} year
 * @param {number} month (1-12)
 * @returns {number} Working days count
 */
export const getWorkingDays = (year, month) => {
  let count = 0;
  const date = new Date(year, month - 1, 1);
  
  while (date.getMonth() === month - 1) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
      count++;
    }
    date.addDate(1);
  }
  
  return count;
};

/**
 * Get number of days in a month
 * @param {number} year
 * @param {number} month (1-12)
 * @returns {number}
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export default {
  formatDate,
  formatDateToMonth,
  formatCurrency,
  formatNumber,
  formatPercentage,
  getMonthName,
  displayMonthYear,
  truncateString,
  capitalize,
  formatName,
  formatEmail,
  getWorkingDays,
  getDaysInMonth,
};

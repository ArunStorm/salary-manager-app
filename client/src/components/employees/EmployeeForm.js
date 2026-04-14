/**
 * Employee Form Component
 * Create or edit employee information
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Alert } from '../common';
import { DEPARTMENTS, VALIDATION } from '../../utils/constants';
import { validateEmployeeForm } from '../../utils/validators';

const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits'),
  role: yup.string().required('Role is required'),
  department: yup.string().required('Department is required'),
  joinDate: yup.date().required('Join date is required').typeError('Invalid date'),
  basicSalary: yup.number().min(0, 'Salary must be positive').typeError('Salary must be a number'),
});

function EmployeeForm({ initialData, onSubmit, onCancel, loading = false, error = null }) {
  const [submitError, setSubmitError] = useState(error);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      basicSalary: '',
    },
  });

  const handleFormSubmit = async (data) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
      reset();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-3">
      {submitError && (
        <Alert type="danger" message={submitError} onClose={() => setSubmitError(null)} dismissible />
      )}

      {/* Name */}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Employee Name *
        </label>
        <input
          id="name"
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          placeholder="Enter full name"
          {...register('name')}
        />
        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="employee@company.com"
          {...register('email')}
        />
        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
      </div>

      {/* Phone */}
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          placeholder="10-digit number"
          {...register('phone')}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
      </div>

      {/* Role */}
      <div className="mb-3">
        <label htmlFor="role" className="form-label">
          Role/Designation *
        </label>
        <input
          id="role"
          type="text"
          className={`form-control ${errors.role ? 'is-invalid' : ''}`}
          placeholder="e.g., Developer, Manager"
          {...register('role')}
        />
        {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
      </div>

      {/* Department */}
      <div className="mb-3">
        <label htmlFor="department" className="form-label">
          Department *
        </label>
        <select
          id="department"
          className={`form-control ${errors.department ? 'is-invalid' : ''}`}
          {...register('department')}
        >
          <option value="">Select Department</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && <div className="invalid-feedback">{errors.department.message}</div>}
      </div>

      {/* Join Date */}
      <div className="mb-3">
        <label htmlFor="joinDate" className="form-label">
          Joining Date *
        </label>
        <input
          id="joinDate"
          type="date"
          className={`form-control ${errors.joinDate ? 'is-invalid' : ''}`}
          {...register('joinDate')}
        />
        {errors.joinDate && <div className="invalid-feedback">{errors.joinDate.message}</div>}
      </div>

      {/* Basic Salary */}
      <div className="mb-4">
        <label htmlFor="basicSalary" className="form-label">
          Basic Salary (₹)
        </label>
        <input
          id="basicSalary"
          type="number"
          className={`form-control ${errors.basicSalary ? 'is-invalid' : ''}`}
          placeholder="0"
          {...register('basicSalary')}
        />
        {errors.basicSalary && <div className="invalid-feedback">{errors.basicSalary.message}</div>}
      </div>

      {/* Actions */}
      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" loading={loading}>
          {initialData ? 'Update Employee' : 'Add Employee'}
        </Button>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default EmployeeForm;

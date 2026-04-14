import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Alert } from '../common';
import { api } from '../../services/api';
import { API_ENDPOINTS, ROLES, DEPARTMENTS, EMPLOYMENT_TYPE } from '../../utils/constants';

const employeeSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().required('Email is required').email('Invalid email'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  department: yup.string().required('Department is required'),
  designation: yup.string().required('Designation is required'),
  role: yup.string().required('Role is required'),
  employmentType: yup.string().required('Employment type is required'),
  baseSalary: yup.number().required('Base salary is required').positive('Salary must be positive'),
  dateOfJoining: yup.string().required('Date of joining is required'),
});

function EmployeeForm({ employee, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      department: employee?.department || '',
      designation: employee?.designation || '',
      role: employee?.role || ROLES.EMPLOYEE,
      employmentType: employee?.employmentType || EMPLOYMENT_TYPE.PERMANENT,
      baseSalary: employee?.baseSalary || 0,
      dateOfJoining: employee?.dateOfJoining || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (employee?.id) {
        await api.put(`${API_ENDPOINTS.EMPLOYEES}/${employee.id}`, data);
      } else {
        await api.post(API_ENDPOINTS.EMPLOYEES, data);
      }

      setSuccess(true);
      reset();
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-form">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message={employee ? 'Employee updated successfully' : 'Employee created successfully'} dismissible />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Name *</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input {...field} type="text" className="form-control" placeholder="Full name" />
                )}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Email *</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input {...field} type="email" className="form-control" placeholder="email@example.com" />
                )}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Phone *</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input {...field} type="tel" className="form-control" placeholder="10-digit phone number" />
                )}
              />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Department *</label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-control">
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                )}
              />
              {errors.department && <p className="form-error">{errors.department.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Designation *</label>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <input {...field} type="text" className="form-control" placeholder="Job title" />
                )}
              />
              {errors.designation && <p className="form-error">{errors.designation.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Base Salary *</label>
              <Controller
                name="baseSalary"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className="form-control" placeholder="0.00" />
                )}
              />
              {errors.baseSalary && <p className="form-error">{errors.baseSalary.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Date of Joining *</label>
              <Controller
                name="dateOfJoining"
                control={control}
                render={({ field }) => (
                  <input {...field} type="date" className="form-control" />
                )}
              />
              {errors.dateOfJoining && <p className="form-error">{errors.dateOfJoining.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Role *</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-control">
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                )}
              />
              {errors.role && <p className="form-error">{errors.role.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label">Employment Type *</label>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-control">
                    {Object.values(EMPLOYMENT_TYPE).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                )}
              />
              {errors.employmentType && <p className="form-error">{errors.employmentType.message}</p>}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;

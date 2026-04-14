import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, Alert } from '../common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import moment from 'moment';

const salarySchema = yup.object({
  month: yup.string().required('Month is required'),
  year: yup.number().required('Year is required'),
  workingDays: yup.number().positive('Must be positive'),
  daysPresent: yup.number().positive('Must be positive'),
});

function SalaryForm({ employee, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [salaryPreview, setSalaryPreview] = useState(null);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(salarySchema),
    defaultValues: {
      month: moment().format('MM'),
      year: moment().year(),
      workingDays: 26,
      daysPresent: 26,
    },
  });

  const workingDays = watch('workingDays') || 26;
  const daysPresent = watch('daysPresent') || 26;

  const handlePreview = (data) => {
    const baseSalary = employee?.baseSalary || 0;
    const allowances = employee?.allowances || [];
    const deductions = employee?.deductions || [];

    const totalAllowances = allowances.reduce((sum, a) => sum + (a?.amount || 0), 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + (d?.amount || 0), 0);

    const grossSalary = baseSalary + totalAllowances;
    const attendancePercentage = (daysPresent / workingDays) * 100;
    const calculatedSalary = (grossSalary * attendancePercentage) / 100;
    const netSalary = calculatedSalary - totalDeductions;

    setSalaryPreview({
      baseSalary,
      totalAllowances,
      grossSalary,
      attendancePercentage: attendancePercentage.toFixed(2),
      calculatedSalary,
      totalDeductions,
      netSalary,
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        employeeId: employee.id,
        month: data.month,
        year: data.year,
        workingDays: data.workingDays,
        daysPresent: data.daysPresent,
        ...salaryPreview,
        status: 'pending',
      };

      await api.post(API_ENDPOINTS.SALARY, payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create salary record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-form">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message="Salary record created successfully" dismissible />}

      <form onSubmit={handleSubmit((data) => {
        handlePreview(data);
        onSubmit(data);
      })}>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Month *</label>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-control">
                    {moment.months().map((month, idx) => (
                      <option key={idx} value={String(idx + 1).padStart(2, '0')}>
                        {month}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.month && <p className="form-error">{errors.month.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Year *</label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className="form-control" />
                )}
              />
              {errors.year && <p className="form-error">{errors.year.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Working Days *</label>
              <Controller
                name="workingDays"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className="form-control" />
                )}
              />
              {errors.workingDays && <p className="form-error">{errors.workingDays.message}</p>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Days Present *</label>
              <Controller
                name="daysPresent"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className="form-control" />
                )}
              />
              {errors.daysPresent && <p className="form-error">{errors.daysPresent.message}</p>}
            </div>
          </div>
        </div>

        {salaryPreview && (
          <Card className="mb-4 bg-light">
            <h5 className="mb-3">Salary Breakdown</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <small className="text-muted">Base Salary</small>
                  <div className="h6">{formatCurrency(salaryPreview.baseSalary)}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Allowances</small>
                  <div className="h6">{formatCurrency(salaryPreview.totalAllowances)}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Gross Salary</small>
                  <div className="h6 fw-bold">{formatCurrency(salaryPreview.grossSalary)}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <small className="text-muted">Attendance %</small>
                  <div className="h6">{salaryPreview.attendancePercentage}%</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Calculated Salary</small>
                  <div className="h6">{formatCurrency(salaryPreview.calculatedSalary)}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Deductions</small>
                  <div className="h6">-{formatCurrency(salaryPreview.totalDeductions)}</div>
                </div>
              </div>
              <div className="col-12 border-top pt-3 mt-3">
                <div className="d-flex justify-content-between">
                  <strong>Net Salary</strong>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981' }}>
                    {formatCurrency(salaryPreview.netSalary)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="d-flex gap-2 justify-content-end">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Salary Record'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalaryForm;

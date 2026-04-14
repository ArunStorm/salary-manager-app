import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert } from '../common';
import { API_ENDPOINTS, PAYROLL_STATUS } from '../../utils/constants';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import moment from 'moment';

const salaryFormSchema = yup.object({
  month: yup.string().required('Month is required'),
  year: yup.number().required('Year is required').min(2020).max(2100),
  workingDays: yup.number().required('Working days required').min(0).max(31),
  daysPresent: yup.number().required('Days present required').min(0).max(31),
  notes: yup.string(),
});

function SalaryForm({ employeeId, onSuccess, onCancel, existingRecord }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(salaryFormSchema),
    defaultValues: {
      month: existingRecord?.month || moment().format('MM'),
      year: existingRecord?.year || moment().year(),
      workingDays: existingRecord?.workingDays || 22,
      daysPresent: existingRecord?.daysPresent || 22,
      notes: existingRecord?.notes || '',
    },
  });

  const workingDays = watch('workingDays');
  const daysPresent = watch('daysPresent');

  useEffect(() => {
    if (employeeId) {
      loadSalaryStructure();
    }
  }, [employeeId]);

  const loadSalaryStructure = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SALARY}/structure/${employeeId}`);
      setSalaryDetails(response?.data);
    } catch (err) {
      console.error('Error loading salary structure:', err);
    }
  };

  const calculateSalary = (values) => {
    if (!salaryDetails) return null;

    const basicPerDay = (salaryDetails.basicSalary || 0) / (workingDays || 22);
    const earnedBasic = daysPresent * basicPerDay;

    const allowances = Object.values(salaryDetails.allowances || {}).reduce((sum, v) => sum + (v || 0), 0);
    const grossSalary = earnedBasic + allowances;

    const deductions = Object.values(salaryDetails.deductions || {}).reduce((sum, v) => sum + (v || 0), 0);
    const netSalary = grossSalary - deductions;

    return {
      basicSalary: salaryDetails.basicSalary,
      earnedBasic,
      allowances,
      grossSalary,
      deductions,
      netSalary,
    };
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const salaryCalc = calculateSalary(data);

      const payload = {
        employeeId,
        month: parseInt(data.month),
        year: data.year,
        workingDays: data.workingDays,
        daysPresent: data.daysPresent,
        basicSalary: salaryCalc.basicSalary,
        earnedBasic: salaryCalc.earnedBasic,
        allowances: salaryCalc.allowances,
        deductions: salaryCalc.deductions,
        grossSalary: salaryCalc.grossSalary,
        netSalary: salaryCalc.netSalary,
        status: PAYROLL_STATUS.PENDING,
        notes: data.notes,
      };

      if (existingRecord?.id) {
        await api.put(`${API_ENDPOINTS.SALARY}/${existingRecord.id}`, payload);
      } else {
        await api.post(API_ENDPOINTS.SALARY, payload);
      }

      setSuccess(true);
      reset();
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save salary record');
    } finally {
      setLoading(false);
    }
  };

  const salary = calculateSalary();
  const attendancePercentage = workingDays > 0 ? Math.round((daysPresent / workingDays) * 100) : 0;

  return (
    <div className="salary-form">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message="Salary record saved successfully" dismissible />}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Month & Year */}
        <div className="row gap-3 mb-4">
          <div className="col-12 col-sm-6">
            <div className="form-group">
              <label className="form-label">Month *</label>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-control">
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {moment().month(i).format('MMMM')}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.month && <p className="form-error">{errors.month.message}</p>}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="form-group">
              <label className="form-label">Year *</label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className="form-control" min="2020" max="2100" />
                )}
              />
              {errors.year && <p className="form-error">{errors.year.message}</p>}
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="row gap-3 mb-4">
          <div className="col-12 col-sm-6">
            <div className="form-group">
              <label className="form-label">Working Days *</label>
              <Controller
                name="workingDays"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className="form-control" min="0" max="31" />
                )}
              />
              {errors.workingDays && <p className="form-error">{errors.workingDays.message}</p>}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="form-group">
              <label className="form-label">Days Present *</label>
              <Controller
                name="daysPresent"
                control={control}
                render={({ field }) => (
                  <input {...field} type="number" className="form-control" min="0" max="31" />
                )}
              />
              {errors.daysPresent && <p className="form-error">{errors.daysPresent.message}</p>}
            </div>
          </div>
        </div>

        {/* Attendance Percentage Info */}
        {workingDays > 0 && (
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <p className="m-0 text-small">
              Attendance: <strong>{attendancePercentage}%</strong> ({daysPresent}/{workingDays} days)
            </p>
          </div>
        )}

        {/* Salary Breakdown */}
        {salary && salaryDetails && (
          <>
            <div className="mb-4">
              <h6 className="text-secondary mb-3">Salary Breakdown</h6>
              <div className="row gap-3">
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <p className="text-secondary small mb-1">Basic Salary/Day</p>
                    <h6 className="m-0">{formatCurrency((salaryDetails.basicSalary || 0) / (workingDays || 22))}</h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="p-3 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <p className="text-secondary small mb-1">Earned Basic</p>
                    <h6 className="m-0" style={{ color: '#10B981' }}>{formatCurrency(salary.earnedBasic)}</h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="p-3 rounded" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                    <p className="text-secondary small mb-1">Allowances</p>
                    <h6 className="m-0" style={{ color: '#4F46E5' }}>{formatCurrency(salary.allowances)}</h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 p-4 rounded" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', border: '2px solid var(--color-primary)' }}>
              <div className="row text-center gap-3">
                <div className="col-12 col-sm-4">
                  <p className="text-secondary small mb-1">Gross Salary</p>
                  <h5 className="m-0" style={{ color: '#4F46E5' }}>{formatCurrency(salary.grossSalary)}</h5>
                </div>
                <div className="col-12 col-sm-4">
                  <p className="text-secondary small mb-1">Deductions</p>
                  <h5 className="m-0" style={{ color: '#EF4444' }}>−{formatCurrency(salary.deductions)}</h5>
                </div>
                <div className="col-12 col-sm-4">
                  <p className="text-secondary small mb-1">Net Salary</p>
                  <h5 className="m-0" style={{ color: '#10B981', fontWeight: '700' }}>{formatCurrency(salary.netSalary)}</h5>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        <div className="form-group mb-4">
          <label className="form-label">Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="form-control"
                rows={2}
                placeholder="Optional notes for this salary record"
                style={{ borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="d-flex gap-2 justify-content-end">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
              style={{ padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            {loading ? 'Saving...' : existingRecord ? 'Update Salary' : 'Create Salary Record'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalaryForm;

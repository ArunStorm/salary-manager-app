import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, Button, Alert } from '../common';
import { api } from '../../services/api';
import { API_ENDPOINTS, ALLOWANCES, DEDUCTIONS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const salaryStructureSchema = yup.object({
  baseSalary: yup.number().positive('Must be positive'),
  allowances: yup.array().of(
    yup.object({
      name: yup.string().required('Name required'),
      amount: yup.number().positive('Must be positive'),
    })
  ),
  deductions: yup.array().of(
    yup.object({
      name: yup.string().required('Name required'),
      amount: yup.number().positive('Must be positive'),
    })
  ),
});

function SalaryStructure({ employee, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(salaryStructureSchema),
    defaultValues: {
      baseSalary: employee?.baseSalary || 0,
      allowances: employee?.allowances || [{ name: ALLOWANCES.HRA, amount: 0 }],
      deductions: employee?.deductions || [{ name: DEDUCTIONS.PROVIDENT_FUND, amount: 0 }],
    },
  });

  const allowances = watch('allowances') || [];
  const deductions = watch('deductions') || [];
  const baseSalary = watch('baseSalary') || 0;

  const totalAllowances = allowances.reduce((sum, a) => sum + (a?.amount || 0), 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + (d?.amount || 0), 0);
  const grossSalary = baseSalary + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...data,
        grossSalary,
        netSalary,
      };

      await api.put(`${API_ENDPOINTS.EMPLOYEES}/${employee.id}/salary-structure`, payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save salary structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-structure">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message="Salary structure updated successfully" dismissible />}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Base Salary */}
        <Card className="mb-4">
          <h5 className="mb-3">Base Salary</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Monthly Base Salary *</label>
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
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input type="text" className="form-control" value={formatCurrency(baseSalary)} disabled />
              </div>
            </div>
          </div>
        </Card>

        {/* Allowances */}
        <Card className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">Allowances</h5>
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={() => {
                allowances.push({ name: '', amount: 0 });
              }}
            >
              <FiPlus className="me-2" /> Add Allowance
            </Button>
          </div>

          {allowances.map((allowance, idx) => (
            <div key={idx} className="row mb-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Type</label>
                <Controller
                  name={`allowances.${idx}.name`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="form-control">
                      <option>Select allowance</option>
                      {ALLOWANCES && Object.values(ALLOWANCES).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Amount</label>
                <Controller
                  name={`allowances.${idx}.amount`}
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="number" className="form-control" placeholder="0.00" />
                  )}
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-outline-danger w-100"
                  onClick={() => allowances.splice(idx, 1)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          <div className="row mt-3 pt-2 border-top">
            <div className="col-md-6">
              <strong>Total Allowances:</strong>
            </div>
            <div className="col-md-4">
              <strong>{formatCurrency(totalAllowances)}</strong>
            </div>
          </div>
        </Card>

        {/* Deductions */}
        <Card className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">Deductions</h5>
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={() => {
                deductions.push({ name: '', amount: 0 });
              }}
            >
              <FiPlus className="me-2" /> Add Deduction
            </Button>
          </div>

          {deductions.map((deduction, idx) => (
            <div key={idx} className="row mb-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Type</label>
                <Controller
                  name={`deductions.${idx}.name`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="form-control">
                      <option>Select deduction</option>
                      {DEDUCTIONS && Object.values(DEDUCTIONS).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Amount</label>
                <Controller
                  name={`deductions.${idx}.amount`}
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="number" className="form-control" placeholder="0.00" />
                  )}
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-outline-danger w-100"
                  onClick={() => deductions.splice(idx, 1)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          <div className="row mt-3 pt-2 border-top">
            <div className="col-md-6">
              <strong>Total Deductions:</strong>
            </div>
            <div className="col-md-4">
              <strong>{formatCurrency(totalDeductions)}</strong>
            </div>
          </div>
        </Card>

        {/* Salary Summary */}
        <Card className="mb-4 bg-light">
          <div className="row">
            <div className="col-md-4">
              <div className="text-center">
                <small className="text-muted">Gross Salary</small>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '5px' }}>
                  {formatCurrency(grossSalary)}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <small className="text-muted">Total Deductions</small>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '5px', color: '#EF4444' }}>
                  -{formatCurrency(totalDeductions)}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <small className="text-muted">Net Salary</small>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '5px', color: '#10B981' }}>
                  {formatCurrency(netSalary)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={() => reset()} disabled={loading}>
            Reset
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Structure'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SalaryStructure;

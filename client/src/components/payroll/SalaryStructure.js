import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Alert, Modal } from '../common';
import { ALLOWANCES, DEDUCTIONS, API_ENDPOINTS } from '../../utils/constants';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const salaryStructureSchema = yup.object({
  basicSalary: yup.number().required('Basic salary is required').min(0, 'Must be positive'),
  allowances: yup.object().test('has-values', 'At least one allowance required', (obj) => {
    return obj && Object.values(obj).some(v => v > 0);
  }),
});

function SalaryStructure({ employeeId, onSave }) {
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deductionsState, setDeductionsState] = useState({});

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(salaryStructureSchema),
    defaultValues: {
      basicSalary: 0,
      allowances: {},
    },
  });

  const basicSalary = watch('basicSalary');
  const allowancesValues = watch('allowances');

  useEffect(() => {
    loadSalaryStructure();
  }, [employeeId]);

  const loadSalaryStructure = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const response = await api.get(`${API_ENDPOINTS.SALARY}/structure/${employeeId}`);
      const data = response?.data;
      if (data) {
        setStructure(data);
        reset({
          basicSalary: data.basicSalary || 0,
          allowances: data.allowances || {},
        });
        setDeductionsState(data.deductions || {});
      }
    } catch (err) {
      console.error('Error loading salary structure:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        employeeId,
        basicSalary: data.basicSalary,
        allowances: data.allowances,
        deductions: deductionsState,
      };

      let response;
      if (structure?.id) {
        response = await api.put(`${API_ENDPOINTS.SALARY}/structure/${structure.id}`, payload);
      } else {
        response = await api.post(`${API_ENDPOINTS.SALARY}/structure`, payload);
      }

      setStructure(response?.data);
      setSuccess(true);
      if (onSave) onSave(response?.data);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save salary structure');
    } finally {
      setSaving(false);
    }
  };

  const handleAllowanceChange = (field, value) => {
    control._formValues.allowances = {
      ...control._formValues.allowances,
      [field]: Math.max(0, value),
    };
  };

  const handleDeductionChange = (field, value) => {
    setDeductionsState({
      ...deductionsState,
      [field]: Math.max(0, value),
    });
  };

  const calculateGrossSalary = () => {
    const allowancesSum = Object.values(allowancesValues || {}).reduce((sum, v) => sum + (v || 0), 0);
    return (basicSalary || 0) + allowancesSum;
  };

  const calculateNetSalary = () => {
    const deductionsSum = Object.values(deductionsState || {}).reduce((sum, v) => sum + (v || 0), 0);
    return calculateGrossSalary() - deductionsSum;
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-4">
          <p className="text-secondary">Loading salary structure...</p>\n        </div>
      </Card>
    );
  }

  const grossSalary = calculateGrossSalary();
  const netSalary = calculateNetSalary();

  return (
    <div className="salary-structure">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message="Salary structure saved successfully" dismissible />}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Salary */}
        <Card className="mb-4">
          <h5 className="mb-4">Basic Information</h5>

          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="form-group">
                <label className="form-label">Basic Salary *</label>
                <Controller
                  name="basicSalary"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="form-control"
                      placeholder="Enter basic salary"
                      min="0"
                      step="100"
                    />
                  )}
                />
                {errors.basicSalary && (
                  <p className="form-error" style={{ color: '#EF4444', marginTop: '8px', fontSize: '12px' }}>
                    {errors.basicSalary.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Allowances */}
        <Card className="mb-4">
          <h5 className="mb-4">Allowances</h5>

          <div className="row gap-3">
            {ALLOWANCES.map(allowance => (
              <div key={allowance.id} className="col-12 col-sm-6 col-lg-4">
                <div className="form-group">
                  <label className="form-label">{allowance.label}</label>
                  <Controller
                    name={`allowances.${allowance.id}`}
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <div className="input-group">
                        <input
                          {...field}
                          type="number"
                          className="form-control"
                          placeholder="0"
                          min="0"
                          step="100"
                          onChange={(e) => {
                            field.onChange(e);
                            handleAllowanceChange(allowance.id, parseFloat(e.target.value) || 0);
                          }}
                        />
                        <span className="input-group-text">₹</span>
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Total Allowances:</span>
              <strong>{formatCurrency(Object.values(allowancesValues || {}).reduce((sum, v) => sum + (v || 0), 0))}</strong>
            </div>
          </div>
        </Card>

        {/* Deductions */}
        <Card className="mb-4">
          <h5 className="mb-4">Deductions</h5>

          <div className="row gap-3">
            {DEDUCTIONS.map(deduction => (
              <div key={deduction.id} className="col-12 col-sm-6 col-lg-4">
                <div className="form-group">
                  <label className="form-label">{deduction.label}</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      step="100"
                      value={deductionsState[deduction.id] || 0}
                      onChange={(e) => handleDeductionChange(deduction.id, parseFloat(e.target.value) || 0)}
                    />
                    <span className="input-group-text">₹</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Total Deductions:</span>
              <strong>{formatCurrency(Object.values(deductionsState || {}).reduce((sum, v) => sum + (v || 0), 0))}</strong>
            </div>
          </div>
        </Card>

        {/* Salary Summary */}
        <Card className="mb-4">
          <h5 className="mb-4">Salary Summary</h5>

          <div className="row gap-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                <p className="text-secondary small mb-1">Basic Salary</p>
                <h5 className="m-0">{formatCurrency(basicSalary)}</h5>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <p className="text-secondary small mb-1">Gross Salary</p>
                <h5 className="m-0" style={{ color: '#10B981' }}>{formatCurrency(grossSalary)}</h5>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <p className="text-secondary small mb-1">Total Deductions</p>
                <h5 className="m-0" style={{ color: '#EF4444' }}>
                  {formatCurrency(Object.values(deductionsState || {}).reduce((sum, v) => sum + (v || 0), 0))}
                </h5>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <p className="text-secondary small mb-1">Net Salary</p>
                <h5 className="m-0" style={{ color: '#3B82F6' }}>{formatCurrency(netSalary)}</h5>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="d-flex gap-2 justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            {saving ? 'Saving...' : 'Save Salary Structure'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalaryStructure;

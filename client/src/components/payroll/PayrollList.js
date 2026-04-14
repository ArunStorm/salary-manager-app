import { useState, useEffect } from 'react';
import { Card, Table, Badge, Alert } from '../common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { formatCurrency, displayMonthYear } from '../../utils/formatters';
import { FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';

function PayrollList({ employeeId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadPayroll();
  }, [employeeId]);

  const loadPayroll = async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_ENDPOINTS.SALARY}?employeeId=${employeeId}`);
      const data = response?.data || [];
      setRecords(data);
      calculateStats(data);
    } catch (err) {
      setError('Failed to load payroll records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      pending: data.filter(r => r.status === 'pending').length,
      processed: data.filter(r => r.status === 'processed').length,
      paid: data.filter(r => r.status === 'paid').length,
      totalAmount: data.reduce((sum, r) => sum + (r.netSalary || 0), 0),
    };
    setStats(stats);
  };

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await api.put(`${API_ENDPOINTS.SALARY}/${recordId}`, { status: newStatus });
      loadPayroll();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDownloadPayslip = (record) => {
    // This would trigger payslip generation/download
    console.log('Downloading payslip for:', record);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await api.delete(`${API_ENDPOINTS.SALARY}/${id}`);
        loadPayroll();
      } catch (err) {
        setError('Failed to delete record');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processed: 'info',
      paid: 'success',
    };
    return colors[status] || 'secondary';
  };

  const columns = [
    {
      key: 'monthYear',
      label: 'Month',
      width: '15%',
      render: (_, rec) => displayMonthYear(rec.month, rec.year),
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      width: '15%',
      render: (val) => formatCurrency(val),
    },
    {
      key: 'grossSalary',
      label: 'Gross',
      width: '12%',
      render: (val) => formatCurrency(val),
     },
    {
      key: 'totalDeductions',
      label: 'Deductions',
      width: '12%',
      render: (val) => formatCurrency(val),
    },
    {
      key: 'netSalary',
      label: 'Net Salary',
      width: '15%',
      render: (val) => <strong>{formatCurrency(val)}</strong>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (val, rec) => (
        <select
          className="form-select form-select-sm"
          value={val}
          onChange={(e) => handleStatusChange(rec.id, e.target.value)}
          style={{ borderColor: `var(--${getStatusColor(val)}-color)` }}
        >
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="paid">Paid</option>
        </select>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '16%',
      render: (_, rec) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            title="Download Payslip"
            onClick={() => handleDownloadPayslip(rec)}
          >
            <FiDownload size={16} />
          </button>
          <button className="btn btn-sm btn-outline-secondary" title="Edit">
            <FiEdit2 size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(rec.id)}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="payroll-list">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {stats && (
        <div className="row gap-2 mb-4">
          <Card className="col-12">
            <div className="d-flex justify-content-around">
              <div className="text-center">
                <div className="text-warning" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.pending}
                </div>
                <small className="text-muted">Pending</small>
              </div>
              <div className="text-center">
                <div className="text-info" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.processed}
                </div>
                <small className="text-muted">Processed</small>
              </div>
              <div className="text-center">
                <div className="text-success" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.paid}
                </div>
                <small className="text-muted">Paid</small>
              </div>
              <div className="text-center">
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                  {formatCurrency(stats.totalAmount)}
                </div>
                <small className="text-muted">Total Amount</small>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Table
        columns={columns}
        data={records}
        loading={loading}
        emptyMessage="No salary records found"
      />
    </div>
  );
}

export default PayrollList;

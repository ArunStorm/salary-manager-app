import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { Card, Table, Badge, Modal, LoadingSpinner, EmptyState, Alert } from '../common';
import { API_ENDPOINTS, PAYROLL_STATUS, COLORS } from '../../utils/constants';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import moment from 'moment';

function PayrollList({ employeeId, month, onEdit, onRefresh }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [processConfirm, setProcessConfirm] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);

  useEffect(() => {
    loadPayroll();
  }, [employeeId, month]);

  const loadPayroll = async () => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `${API_ENDPOINTS.SALARY}?employeeId=${employeeId}${month ? `&month=${month.format('YYYY-MM')}` : ''}`
      );
      setRecords(response?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    if (onEdit) onEdit(record);
  };

  const handleProcess = async () => {
    if (!processConfirm) return;
    setProcessLoading(true);
    try {
      await api.put(`${API_ENDPOINTS.SALARY}/${processConfirm.id}/process`, {
        status: PAYROLL_STATUS.PROCESSED,
      });
      setProcessConfirm(null);
      loadPayroll();
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to process payroll');
    } finally {
      setProcessLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await api.delete(`${API_ENDPOINTS.SALARY}/${deleteConfirm.id}`);
      setRecords(records.filter(r => r.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to delete salary record');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownloadPayslip = async (record) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.PAYSLIP(employeeId, record.month)}/download`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${moment().format('YYYY-MM-DD')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Failed to download payslip');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case PAYROLL_STATUS.PENDING:
        return 'warning';
      case PAYROLL_STATUS.PROCESSED:
        return 'info';
      case PAYROLL_STATUS.PAID:
        return 'success';
      default:
        return 'primary';
    }
  };

  const calculateTotalPayroll = () => {
    return records.reduce((sum, record) => sum + (record.netSalary || 0), 0);
  };

  if (loading) return <LoadingSpinner text="Loading payroll records..." />;

  return (
    <div className="payroll-list">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {records.length > 0 && (
        <Card className="mb-4">
          <h6 className="text-secondary mb-3">Payroll Summary</h6>
          <div className="row gap-3">
            <div className="col-12 col-sm-6">
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                <p className="text-secondary small mb-1">Records Count</p>
                <h5 className="m-0">{records.length}</h5>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <p className="text-secondary small mb-1">Total Payroll</p>
                <h5 className="m-0" style={{ color: '#10B981' }}>{formatCurrency(calculateTotalPayroll())}</h5>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0">Salary Records</h5>
        </div>

        {records.length === 0 ? (
          <EmptyState
            icon="💰"
            title="No Records"
            description="No salary records found. Create one to get started."
          />
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Working Days</th>
                  <th>Days Present</th>
                  <th>Gross Salary</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    <td>
                      <strong>
                        {moment().month(record.month - 1).format('MMM')} {record.year}
                      </strong>
                    </td>
                    <td>{record.workingDays}</td>
                    <td>
                      <span className="text-secondary small">
                        {record.daysPresent} ({record.workingDays > 0 ? Math.round((record.daysPresent / record.workingDays) * 100) : 0}%)
                      </span>
                    </td>
                    <td>{formatCurrency(record.grossSalary)}</td>
                    <td>
                      <strong style={{ color: COLORS.success }}>{formatCurrency(record.netSalary)}</strong>
                    </td>
                    <td>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {record.status === PAYROLL_STATUS.PENDING && (
                        <button
                          className="btn btn-sm btn-ghost text-info"
                          onClick={() => setProcessConfirm(record)}
                          title="Process Payroll"
                        >
                          <FiCheckCircle size={16} />
                        </button>
                      )}
                      {record.status === PAYROLL_STATUS.PROCESSED && (
                        <button
                          className="btn btn-sm btn-ghost text-primary"
                          onClick={() => handleDownloadPayslip(record)}
                          title="Download Payslip"
                        >
                          <FiDownload size={16} />
                        </button>
                      )}
                      {record.status === PAYROLL_STATUS.PENDING && (
                        <button
                          className="btn btn-sm btn-ghost text-primary"
                          onClick={() => handleEdit(record)}
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )}
                      {record.status === PAYROLL_STATUS.PENDING && (
                        <button
                          className="btn btn-sm btn-ghost text-danger"
                          onClick={() => setDeleteConfirm(record)}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Process Confirmation Modal */}
      {processConfirm && (
        <Modal
          title="Process Payroll"
          onClose={() => setProcessConfirm(null)}
        >
          <p className="mb-4">
            Process payroll for <strong>{moment().month(processConfirm.month - 1).format('MMMM')} {processConfirm.year}</strong>?
          </p>
          <p className="text-secondary small mb-4">
            Once processed, the payslip will be generated and marked as ready for payment.
          </p>
          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={() => setProcessConfirm(null)}
              disabled={processLoading}
              style={{ padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleProcess}
              disabled={processLoading}
              style={{ padding: '10px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              {processLoading ? 'Processing...' : 'Process Payroll'}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          title="Delete Salary Record"
          onClose={() => setDeleteConfirm(null)}
        >
          <p className="mb-4">
            Are you sure you want to delete the salary record for <strong>{moment().month(deleteConfirm.month - 1).format('MMMM')} {deleteConfirm.year}</strong>?
          </p>
          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleteLoading}
              style={{ padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{ padding: '10px 16px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PayrollList;

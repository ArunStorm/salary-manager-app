import { useState, useEffect } from 'react';
import { Card, Table, Badge, Alert } from '../common';
import { api } from '../../services/api';
import { API_ENDPOINTS, ATTENDANCE_STATUS } from '../../utils/constants';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import moment from 'moment';

function AttendanceList({ employeeId, month, onRefresh }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAttendance();
  }, [employeeId, month]);

  const loadAttendance = async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);
    try {
      const monthYear = month.format('YYYY-MM');
      const response = await api.get(
        `${API_ENDPOINTS.ATTENDANCE}?employeeId=${employeeId}&month=${monthYear}`
      );
      const data = response?.data || [];
      setRecords(data);
      calculateStats(data);
    } catch (err) {
      setError('Failed to load attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      present: data.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length,
      absent: data.filter(r => r.status === ATTENDANCE_STATUS.ABSENT).length,
      leave: data.filter(r => r.status === ATTENDANCE_STATUS.LEAVE).length,
      holiday: data.filter(r => r.status === ATTENDANCE_STATUS.HOLIDAY).length,
      total: data.length,
    };
    stats.percentage = stats.total > 0 ? ((stats.present / (stats.total - stats.holiday)) * 100).toFixed(2) : 0;
    setStats(stats);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`${API_ENDPOINTS.ATTENDANCE}/${id}`);
        loadAttendance();
        if (onRefresh) onRefresh();
      } catch (err) {
        setError('Failed to delete record');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [ATTENDANCE_STATUS.PRESENT]: 'success',
      [ATTENDANCE_STATUS.ABSENT]: 'danger',
      [ATTENDANCE_STATUS.LEAVE]: 'warning',
      [ATTENDANCE_STATUS.HOLIDAY]: 'info',
    };
    return colors[status] || 'secondary';
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      width: '20%',
      render: (val) => moment(val).format('DD/MM/YYYY'),
    },
    {
      key: 'status',
      label: 'Status',
      width: '20%',
      render: (val) => <Badge text={val} color={getStatusColor(val)} />,
    },
    {
      key: 'notes',
      label: 'Notes',
      width: '40%',
      render: (val) => val || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '20%',
      render: (_, record) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary">
            <FiEdit2 size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(record.id)}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="attendance-list">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {stats && (
        <div className="row gap-2 mb-4">
          <Card className="col-12">
            <div className="d-flex justify-content-around">
              <div className="text-center">
                <div className="text-success" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.present}
                </div>
                <small className="text-muted">Present</small>
              </div>
              <div className="text-center">
                <div className="text-danger" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.absent}
                </div>
                <small className="text-muted">Absent</small>
              </div>
              <div className="text-center">
                <div className="text-warning" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.leave}
                </div>
                <small className="text-muted">Leave</small>
              </div>
              <div className="text-center">
                <div className="text-info" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.percentage}%
                </div>
                <small className="text-muted">Attendance %</small>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Table
        columns={columns}
        data={records}
        loading={loading}
        emptyMessage="No attendance records"
      />
    </div>
  );
}

export default AttendanceList;

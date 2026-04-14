import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert } from '../common';
import { api } from '../../services/api';
import { API_ENDPOINTS, ATTENDANCE_STATUS } from '../../utils/constants';
import moment from 'moment';

const attendanceSchema = yup.object({
  status: yup.string().required('Status is required').oneOf(Object.values(ATTENDANCE_STATUS)),
  notes: yup.string().max(500, 'Notes cannot exceed 500 characters'),
  date: yup.string().required('Date is required'),
});

function AttendanceForm({ employeeId, date, onSuccess, onCancel, existingRecord }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm({
    resolver: yupResolver(attendanceSchema),
    defaultValues: {
      status: existingRecord?.status || ATTENDANCE_STATUS.PRESENT,
      notes: existingRecord?.notes || '',
      date: date?.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD'),
    },
  });

  const currentStatus = watch('status');

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        employeeId,
        date: data.date,
        status: data.status,
        notes: data.notes,
      };

      if (existingRecord?.id) {
        await api.put(`${API_ENDPOINTS.ATTENDANCE}/${existingRecord.id}`, payload);
      } else {
        await api.post(API_ENDPOINTS.ATTENDANCE, payload);
      }

      setSuccess(true);
      reset();
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [ATTENDANCE_STATUS.PRESENT]: '#10B981',
      [ATTENDANCE_STATUS.ABSENT]: '#EF4444',
      [ATTENDANCE_STATUS.LEAVE]: '#F59E0B',
      [ATTENDANCE_STATUS.HOLIDAY]: '#3B82F6',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="attendance-form">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}
      {success && <Alert type="success" message="Attendance marked successfully" dismissible />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mb-4">
          <label className="form-label">Date</label>
          <input
            type="text"
            className="form-control"
            value={date?.format('DD/MM/YYYY') || moment().format('DD/MM/YYYY')}
            disabled
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Attendance Status *</label>
          <div className="status-buttons d-flex gap-2 flex-wrap mb-3">
            {Object.values(ATTENDANCE_STATUS).map(status => (
              <Controller
                key={status}
                name="status"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(status)}
                    className="status-btn"
                    style={{
                      backgroundColor: currentStatus === status ? getStatusColor(status) : 'var(--bg-secondary)',
                      color: currentStatus === status ? 'white' : 'var(--text-primary)',
                      border: `2px solid ${getStatusColor(status)}`,
                      padding: '10px 15px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: currentStatus === status ? '600' : '400',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )}
              />
            ))}
          </div>
          {errors.status && <p className="form-error">{errors.status.message}</p>}
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="form-control"
                rows={3}
                placeholder="Optional notes for this attendance"
              />
            )}
          />
          {errors.notes && <p className="form-error">{errors.notes.message}</p>}
        </div>

        <div className="d-flex gap-2 justify-content-end">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : existingRecord ? 'Update Attendance' : 'Mark Attendance'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AttendanceForm;

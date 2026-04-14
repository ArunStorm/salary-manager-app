import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert } from '../common';
import { ATTENDANCE_STATUS, API_ENDPOINTS } from '../../utils/constants';
import { api } from '../../services/api';
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

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
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
        {/* Date Field (Read-only) */}
        <div className="form-group mb-4">
          <label className="form-label">Date</label>
          <input
            type="text"
            className="form-control"
            value={date?.format('DD/MM/YYYY') || moment().format('DD/MM/YYYY')}
            disabled
          />
        </div>

        {/* Status Field */}
        <div className="form-group mb-4">
          <label className="form-label">Attendance Status *</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="status-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {Object.values(ATTENDANCE_STATUS).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => field.onChange(status)}
                    style={{
                      backgroundColor: currentStatus === status ? getStatusColor(status) : 'var(--bg-secondary)',
                      color: currentStatus === status ? 'white' : 'var(--text-primary)',
                      border: `2px solid ${getStatusColor(status)}`,
                      padding: '10px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 200ms',
                      flex: '1',
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.status && <p className="form-error" style={{ color: '#EF4444', marginTop: '8px', fontSize: '12px' }}>{errors.status.message}</p>}
        </div>

        {/* Notes Field */}
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
                style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit', resize: 'vertical' }}
              />
            )}
          />
          {errors.notes && <p className="form-error" style={{ color: '#EF4444', marginTop: '8px', fontSize: '12px' }}>{errors.notes.message}</p>}
        </div>

        {/* Form Actions */}
        <div className="d-flex gap-2 justify-content-end">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
              style={{ padding: '10px 16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            {loading ? 'Saving...' : existingRecord ? 'Update Attendance' : 'Mark Attendance'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AttendanceForm;\n\nconst attendanceSchema = yup.object({\n  status: yup.string().required('Status is required').oneOf(Object.values(ATTENDANCE_STATUS)),\n  notes: yup.string().max(500, 'Notes cannot exceed 500 characters'),\n  date: yup.string().required('Date is required'),\n});\n\nfunction AttendanceForm({ employeeId, date, onSuccess, onCancel, existingRecord }) {\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n  const [success, setSuccess] = useState(false);\n\n  const { control, handleSubmit, reset, formState: { errors } } = useForm({\n    resolver: yupResolver(attendanceSchema),\n    defaultValues: {\n      status: existingRecord?.status || ATTENDANCE_STATUS.PRESENT,\n      notes: existingRecord?.notes || '',\n      date: date?.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD'),\n    },\n  });\n\n  const onSubmit = async (data) => {\n    setLoading(true);\n    setError(null);\n    setSuccess(false);\n\n    try {\n      const payload = {\n        employeeId,\n        date: data.date,\n        status: data.status,\n        notes: data.notes,\n      };\n\n      if (existingRecord?.id) {\n        await api.put(`${API_ENDPOINTS.ATTENDANCE}/${existingRecord.id}`, payload);\n      } else {\n        await api.post(API_ENDPOINTS.ATTENDANCE, payload);\n      }\n\n      setSuccess(true);\n      reset();\n      setTimeout(() => {\n        if (onSuccess) onSuccess();\n      }, 1000);\n    } catch (err) {\n      setError(err.message || 'Failed to save attendance');\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  const getStatusColor = (status) => {\n    const colors = {\n      [ATTENDANCE_STATUS.PRESENT]: '#10B981',\n      [ATTENDANCE_STATUS.ABSENT]: '#EF4444',\n      [ATTENDANCE_STATUS.LEAVE]: '#F59E0B',\n      [ATTENDANCE_STATUS.HOLIDAY]: '#3B82F6',\n    };\n    return colors[status] || '#999';\n  };\n\n  return (\n    <div className=\"attendance-form\">\n      {error && <Alert type=\"error\" message={error} onDismiss={() => setError(null)} />}\n      {success && <Alert type=\"success\" message=\"Attendance marked successfully\" dismissible />}\n\n      <form onSubmit={handleSubmit(onSubmit)}>\n        {/* Date Field (Read-only) */}\n        <div className=\"form-group mb-4\">\n          <label className=\"form-label\">Date</label>\n          <input\n            type=\"text\"\n            className=\"form-control\"\n            value={date?.format('DD/MM/YYYY') || moment().format('DD/MM/YYYY')}\n            disabled\n          />\n        </div>\n\n        {/* Status Field */}\n        <div className=\"form-group mb-4\">\n          <label className=\"form-label\">Attendance Status *</label>\n          <div className=\"status-buttons\">\n            {Object.values(ATTENDANCE_STATUS).map(status => (\n              <button\n                key={status}\n                type=\"button\"\n                className={`status-btn ${control._formValues.status === status ? 'active' : ''}`}\n                onClick={() => {\n                  control._formValues.status = status;\n                  // Trigger re-render by updating form value\n                  document.querySelector(`input[value=\"${status}\"]`)?.click();\n                }}\n                style={{\n                  backgroundColor: control._formValues.status === status ? getStatusColor(status) : 'var(--bg-secondary)',\n                  color: control._formValues.status === status ? 'white' : 'var(--text-primary)',\n                  border: `2px solid ${getStatusColor(status)}`,\n                }}\n              >\n                {status.charAt(0).toUpperCase() + status.slice(1)}\n              </button>\n            ))}\n            <input type=\"hidden\" name=\"status\" />\n          </div>\n          <Controller\n            name=\"status\"\n            control={control}\n            render={({ field }) => (\n              <select {...field} style={{ display: 'none' }}>\n                {Object.values(ATTENDANCE_STATUS).map(status => (\n                  <option key={status} value={status}>\n                    {status}\n                  </option>\n                ))}\n              </select>\n            )}\n          />\n          {errors.status && <p className=\"form-error\">{errors.status.message}</p>}\n        </div>\n\n        {/* Notes Field */}\n        <div className=\"form-group mb-4\">\n          <label className=\"form-label\">Notes</label>\n          <Controller\n            name=\"notes\"\n            control={control}\n            render={({ field }) => (\n              <textarea\n                {...field}\n                className=\"form-control\"\n                rows={3}\n                placeholder=\"Optional notes for this attendance\"\n              />\n            )}\n          />\n          {errors.notes && <p className=\"form-error\">{errors.notes.message}</p>}\n        </div>\n\n        {/* Form Actions */}\n        <div className=\"d-flex gap-2 justify-content-end\">\n          {onCancel && (\n            <button\n              type=\"button\"\n              className=\"btn btn-secondary\"\n              onClick={onCancel}\n              disabled={loading}\n            >\n              Cancel\n            </button>\n          )}\n          <button\n            type=\"submit\"\n            className=\"btn btn-primary\"\n            disabled={loading}\n          >\n            {loading ? 'Saving...' : existingRecord ? 'Update Attendance' : 'Mark Attendance'}\n          </button>\n        </div>\n      </form>\n    </div>\n  );\n}\n\nexport default AttendanceForm;

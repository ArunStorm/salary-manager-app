import React from 'react';
import { Card, Badge } from '../common';
import { ATTENDANCE_STATUS, COLORS } from '../../utils/constants';
import moment from 'moment';
import './Calendar.css';

function Calendar({ attendanceData, onDateSelect, selectedMonth }) {
  const startOfMonth = selectedMonth.clone().startOf('month');
  const endOfMonth = selectedMonth.clone().endOf('month');
  const startDate = startOfMonth.clone().startOf('week');
  const endDate = endOfMonth.clone().endOf('week');

  const days = [];
  let current = startDate.clone();

  while (current.isBefore(endDate) || current.isSame(endDate)) {
    days.push(current.clone());
    current.add(1, 'day');
  }

  const getAttendanceRecord = (date) => {
    return attendanceData.find(record =>
      moment(record.date).isSame(date, 'day')
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      [ATTENDANCE_STATUS.PRESENT]: '#10B981',
      [ATTENDANCE_STATUS.ABSENT]: '#EF4444',
      [ATTENDANCE_STATUS.LEAVE]: '#F59E0B',
      [ATTENDANCE_STATUS.HOLIDAY]: '#3B82F6',
    };
    return colors[status] || '#E5E7EB';
  };

  const getStatusLabel = (status) => {
    const labels = {
      [ATTENDANCE_STATUS.PRESENT]: 'P',
      [ATTENDANCE_STATUS.ABSENT]: 'A',
      [ATTENDANCE_STATUS.LEAVE]: 'L',
      [ATTENDANCE_STATUS.HOLIDAY]: 'H',
    };
    return labels[status] || '-';
  };

  return (
    <Card>
      <div className="calendar-wrapper">
        <h4 className="mb-3">{selectedMonth.format('MMMM YYYY')}</h4>

        {/* Legend */}
        <div className="calendar-legend mb-3 d-flex gap-2 flex-wrap">
          {[
            { status: ATTENDANCE_STATUS.PRESENT, label: 'Present' },
            { status: ATTENDANCE_STATUS.ABSENT, label: 'Absent' },
            { status: ATTENDANCE_STATUS.LEAVE, label: 'Leave' },
            { status: ATTENDANCE_STATUS.HOLIDAY, label: 'Holiday' },
          ].map(({ status, label }) => (
            <div key={status} className="d-flex align-items-center gap-2">
              <div
                className="legend-box"
                style={{ backgroundColor: getStatusColor(status) }}
              />
              <small>{label}</small>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map(date => {
            const record = getAttendanceRecord(date);
            const isCurrentMonth = date.isSame(selectedMonth, 'month');
            const isToday = date.isSame(moment(), 'day');

            return (
              <button
                key={date.format('YYYY-MM-DD')}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${
                  record ? 'marked' : ''
                }`}
                onClick={() => onDateSelect(date, record)}
                style={{
                  backgroundColor:
                    record && isCurrentMonth ? getStatusColor(record.status) : 'transparent',
                  borderColor: isToday ? '#3B82F6' : 'transparent',
                  opacity: isCurrentMonth ? 1 : 0.5,
                }}
              >
                <div className="date-number">{date.date()}</div>
                {record && (
                  <div className="date-status" style={{ color: 'white', fontWeight: 'bold' }}>
                    {getStatusLabel(record.status)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default Calendar;

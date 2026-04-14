import { useState } from 'react';
import moment from 'moment';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ATTENDANCE_STATUS, COLORS } from '../../utils/constants';
import './Calendar.css';

function Calendar({ attendanceData, onDateSelect, selectedMonth }) {
  const [currentMonth, setCurrentMonth] = useState(selectedMonth || moment());

  const getDaysInMonth = () => {
    return currentMonth.daysInMonth();
  };

  const getFirstDayOfMonth = () => {
    return currentMonth.clone().startOf('month').day();
  };

  const getAttendanceForDate = (date) => {
    if (!attendanceData) return null;
    const dateStr = date.format('YYYY-MM-DD');
    return attendanceData.find(record => record.date === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return COLORS.SUCCESS;
      case ATTENDANCE_STATUS.ABSENT:
        return COLORS.DANGER;
      case ATTENDANCE_STATUS.LEAVE:
        return COLORS.WARNING;
      case ATTENDANCE_STATUS.HOLIDAY:
        return COLORS.INFO;
      default:
        return '#ccc';
    }
  };

  const getStatusAbbr = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return 'P';
      case ATTENDANCE_STATUS.ABSENT:
        return 'A';
      case ATTENDANCE_STATUS.LEAVE:
        return 'L';
      case ATTENDANCE_STATUS.HOLIDAY:
        return 'H';
      default:
        return '';
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));\n  };\n\n  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };\n\n  const handleDateClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date, getAttendanceForDate(date));
    }
  };\n\n  const renderCalendarDays = () => {
    const days = [];\n    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();\n\n    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className=\"calendar-cell empty\"></div>);\n    }\n\n    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const dayDate = currentMonth.clone().date(date);\n      const isToday = dayDate.isSame(moment(), 'day');\n      const isWeekend = dayDate.day() === 0 || dayDate.day() === 6;
      const attendance = getAttendanceForDate(dayDate);\n      const status = attendance?.status;\n\n      days.push(\n        <button\n          key={`day-${date}`}\n          className={`calendar-cell ${\n            isToday ? 'today' : ''\n          } ${status ? 'has-attendance' : ''}`}\n          onClick={() => handleDateClick(dayDate)}\n          style={{\n            backgroundColor: status ? getStatusColor(status) : isWeekend ? 'var(--bg-tertiary)' : 'transparent',\n            color: status ? 'white' : 'var(--text-primary)',\n            borderColor: isToday ? 'var(--color-primary)' : 'var(--border-color)',\n          }}\n          title={dayDate.format('YYYY-MM-DD')}\n        >\n          <span className=\"calendar-date\">{date}</span>\n          {status && <span className=\"calendar-status\">{getStatusAbbr(status)}</span>}\n        </button>\n      );\n    }\n\n    return days;\n  };\n\n  const isCurrentMonth = currentMonth.isSame(moment(), 'month');\n\n  return (\n    <div className=\"calendar-container\">\n      {/* Calendar Header */}\n      <div className=\"calendar-header\">\n        <button className=\"btn btn-ghost\" onClick={handlePrevMonth}>\n          <FiChevronLeft size={20} />\n        </button>\n        <h5 className=\"calendar-title\">\n          {currentMonth.format('MMMM YYYY')}\n        </h5>\n        <button className=\"btn btn-ghost\" onClick={handleNextMonth}>\n          <FiChevronRight size={20} />\n        </button>\n      </div>\n\n      {/* Day Names */}\n      <div className=\"calendar-weekdays\">\n        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (\n          <div key={day} className=\"calendar-weekday\">\n            {day}\n          </div>\n        ))}\n      </div>\n\n      {/* Calendar Grid */}\n      <div className=\"calendar-grid\">\n        {renderCalendarDays()}\n      </div>\n\n      {/* Legend */}\n      <div className=\"calendar-legend\">\n        <div className=\"legend-item\">\n          <span className=\"legend-color\" style={{ backgroundColor: COLORS.SUCCESS }}></span>\n          <span className=\"legend-label\">Present</span>\n        </div>\n        <div className=\"legend-item\">\n          <span className=\"legend-color\" style={{ backgroundColor: COLORS.DANGER }}></span>\n          <span className=\"legend-label\">Absent</span>\n        </div>\n        <div className=\"legend-item\">\n          <span className=\"legend-color\" style={{ backgroundColor: COLORS.WARNING }}></span>\n          <span className=\"legend-label\">Leave</span>\n        </div>\n        <div className=\"legend-item\">\n          <span className=\"legend-color\" style={{ backgroundColor: COLORS.INFO }}></span>\n          <span className=\"legend-label\">Holiday</span>\n        </div>\n        <div className=\"legend-item\">\n          <span className=\"legend-color\" style={{ backgroundColor: 'var(--bg-tertiary)' }}></span>\n          <span className=\"legend-label\">Weekend</span>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default Calendar;

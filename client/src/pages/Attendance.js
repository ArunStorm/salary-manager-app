import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Card, LoadingSpinner, Modal } from '../components/common';
import { Calendar, AttendanceForm, AttendanceList } from '../components/attendance';
import { API_ENDPOINTS } from '../utils/constants';
import moment from 'moment';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateRecord, setSelectedDateRecord] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const employeesFetch = useFetch();
  const attendanceFetch = useFetch();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeesFetch.execute('GET', API_ENDPOINTS.EMPLOYEES);
      const emps = response?.data || [];
      setEmployees(emps);
      if (emps.length > 0) {
        setSelectedEmployee(emps[0]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  useEffect(() => {
    if (selectedEmployee) {
      loadAttendanceForMonth();
    }
  }, [selectedEmployee, selectedMonth]);

  const loadAttendanceForMonth = async () => {
    if (!selectedEmployee) return;
    try {
      const monthYear = selectedMonth.format('YYYY-MM');
      const response = await attendanceFetch.execute(
        'GET',
        `${API_ENDPOINTS.ATTENDANCE}?employeeId=${selectedEmployee.id}&month=${monthYear}`
      );
      setAttendanceData(response?.data || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handleDateSelect = (date, record) => {
    setSelectedDate(date);
    setSelectedDateRecord(record);
    setShowAttendanceForm(true);
  };

  const handleFormSuccess = () => {
    setShowAttendanceForm(false);
    setSelectedDate(null);
    setSelectedDateRecord(null);
    loadAttendanceForMonth();
  };

  if (employeesFetch.loading && employees.length === 0) {
    return <LoadingSpinner text="Loading employees..." />;
  }

  return (
    <div className="attendance-page">
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="m-0">Attendance Management</h3>
          <p className="text-secondary small mt-1">Mark and track employee attendance</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-lg-6">
          <Card>
            <label className="form-label">Select Employee</label>
            <select
              className="form-control"
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const emp = employees.find(emp => emp.id === e.target.value);
                setSelectedEmployee(emp);
              }}
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </Card>
        </div>
      </div>

      {selectedEmployee && (
        <div className="row gap-4">
          <div className="col-12 col-lg-6">
            <Calendar
              attendanceData={attendanceData}
              onDateSelect={handleDateSelect}
              selectedMonth={selectedMonth}
            />
          </div>

          <div className="col-12 col-lg-6">
            <AttendanceList
              key={refreshKey}
              employeeId={selectedEmployee.id}
              month={selectedMonth}
              onRefresh={() => setRefreshKey(refreshKey + 1)}
            />
          </div>
        </div>
      )}

      {showAttendanceForm && selectedDate && (
        <Modal
          title={selectedDateRecord ? 'Edit Attendance' : 'Mark Attendance'}
          onClose={() => {
            setShowAttendanceForm(false);
            setSelectedDate(null);
            setSelectedDateRecord(null);
          }}
          size="lg"
        >
          <AttendanceForm
            employeeId={selectedEmployee.id}
            date={selectedDate}
            existingRecord={selectedDateRecord}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowAttendanceForm(false);
              setSelectedDate(null);
              setSelectedDateRecord(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default Attendance;

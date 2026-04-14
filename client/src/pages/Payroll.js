import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Card, Modal, Alert } from '../components/common';
import { SalaryStructure, SalaryForm, PayrollList } from '../components/payroll';
import { API_ENDPOINTS } from '../utils/constants';
import moment from 'moment';
import { FiPlus, FiSettings } from 'react-icons/fi';

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showSalaryFormModal, setShowSalaryFormModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState(null);
  const employeesFetch = useFetch();

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
      setError('Failed to load employees');
    }
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setShowSalaryFormModal(true);
  };

  const handleSalaryFormSuccess = () => {
    setShowSalaryFormModal(false);
    setSelectedRecord(null);
    setRefreshKey(refreshKey + 1);
  };

  const handleStructureSave = () => {
    setShowStructureModal(false);
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setSelectedMonth(selectedMonth.clone().subtract(1, 'month'));
    } else {
      setSelectedMonth(selectedMonth.clone().add(1, 'month'));
    }
  };

  return (
    <div className="payroll-page">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="m-0">Payroll Management</h3>
          <p className="text-secondary small mt-1">Process salaries and manage payroll</p>
        </div>
      </div>

      {/* Employee Selection & Controls */}
      <div className="row mb-4 gap-3">
        <div className="col-12 col-lg-8">
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
                  {emp.name} ({emp.department}) - {emp.email}
                </option>
              ))}
            </select>
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card>
            <label className="form-label">Month</label>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handleMonthChange('prev')}
                style={{ padding: '8px 10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                ←
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={selectedMonth.format('MMMM YYYY')}
                disabled
                style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', cursor: 'pointer' }}
              />
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handleMonthChange('next')}
                style={{ padding: '8px 10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                →
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Controls */}
      {selectedEmployee && (
        <div className="row mb-4">
          <div className="col-12">
            <Card>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn d-flex align-items-center gap-2"
                  onClick={() => setShowSalaryFormModal(true)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                  }}
                >
                  <FiPlus size={18} /> Create Salary Record
                </button>
                <button
                  className="btn d-flex align-items-center gap-2"
                  onClick={() => setShowStructureModal(true)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                  }}
                >
                  <FiSettings size={18} /> Salary Structure
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedEmployee && (
        <div className="row gap-4">
          {/* Left: Salary Structure Modal */}
          {showStructureModal && (
            <Modal
              title="Manage Salary Structure"
              onClose={() => setShowStructureModal(false)}
              size="lg"
            >
              <SalaryStructure
                employeeId={selectedEmployee.id}
                onSave={handleStructureSave}
              />
            </Modal>
          )}

          {/* Right: Payroll List & Form */}
          <div className="col-12">
            <PayrollList
              key={refreshKey}
              employeeId={selectedEmployee.id}
              month={selectedMonth}
              onEdit={handleEditRecord}
              onRefresh={() => setRefreshKey(refreshKey + 1)}
            />
          </div>
        </div>
      )}

      {/* Salary Form Modal */}
      {showSalaryFormModal && selectedEmployee && (
        <Modal
          title={selectedRecord ? 'Edit Salary Record' : 'Create Salary Record'}
          onClose={() => {
            setShowSalaryFormModal(false);
            setSelectedRecord(null);
          }}
          size="lg"
        >
          <SalaryForm
            employeeId={selectedEmployee.id}
            existingRecord={selectedRecord}
            onSuccess={handleSalaryFormSuccess}
            onCancel={() => {
              setShowSalaryFormModal(false);
              setSelectedRecord(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default Payroll;
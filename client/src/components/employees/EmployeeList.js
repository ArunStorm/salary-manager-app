import { useState, useEffect } from 'react';
import { Modal, Table, Button, Badge, Alert, Pagination } from '../common';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import EmployeeForm from './EmployeeForm';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES);
      setEmployees(response?.data || []);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    loadEmployees();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const columns = [
    { key: 'name', label: 'Name', width: '20%' },
    { key: 'email', label: 'Email', width: '20%' },
    { key: 'department', label: 'Department', width: '15%' },
    { key: 'designation', label: 'Designation', width: '15%' },
    { key: 'baseSalary', label: 'Salary', width: '15%', render: (val) => formatCurrency(val) },
    { key: 'role', label: 'Role', width: '10%', render: (val) => <Badge text={val} color="info" /> },
    {
      key: 'actions',
      label: 'Actions',
      width: '5%',
      render: (_, emp) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setSelectedEmployee(emp);
              setShowForm(true);
            }}
          >
            <FiEdit2 size={16} />
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(emp.id)}>
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="employee-list">
      {error && <Alert type="error" message={error} onDismiss={() => setError(null)} />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 me-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedEmployee(null);
            setShowForm(true);
          }}
        >
          <FiPlus className="me-2" /> Add Employee
        </Button>
      </div>

      <Table
        columns={columns}
        data={paginatedEmployees}
        loading={loading}
        emptyMessage="No employees found"
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {showForm && (
        <Modal
          title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
          onClose={() => {
            setShowForm(false);
            setSelectedEmployee(null);
          }}
          size="lg"
        >
          <EmployeeForm
            employee={selectedEmployee}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setSelectedEmployee(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default EmployeeList;

/**
 * Employee List Component
 * Display employees with search, filter, and pagination
 */

import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { Card, Button, Table, Pagination, EmptyState, LoadingSpinner, Modal, Alert, Avatar } from '../common';
import EmployeeForm from './EmployeeForm';
import { api } from '../../services/api';
import { DEPARTMENTS, PAGINATION } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/formatters';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/employees');
      if (response.success) {
        setEmployees(response.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      !search || 
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      (emp.email && emp.email.toLowerCase().includes(search.toLowerCase()));
    
    const matchesDept = !department || emp.department === department;
    return matchesSearch && matchesDept;
  });

  // Paginate
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle add employee
  const handleAddEmployee = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/employees', data);
      if (response.success) {
        setEmployees([...employees, response.data]);
        setShowModal(false);
        setError(null);
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  // Handle update employee
  const handleUpdateEmployee = async (data) => {
    try {
      setLoading(true);
      const response = await api.put(`/employees/${editingEmployee.id}`, data);
      if (response.success) {
        setEmployees(employees.map(emp =>
          emp.id === editingEmployee.id ? { ...emp, ...data } : emp
        ));
        setShowModal(false);
        setEditingEmployee(null);
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(`/employees/${id}`);
      if (response.success) {
        setEmployees(employees.filter(emp => emp.id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (value, row) => (
        <div className="d-flex align-items-center gap-2">
          <Avatar name={value} size="sm" />
          <div>
            <div className="fw-semibold">{value}</div>
            <small className="text-secondary">{row.email}</small>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Designation' },
    { key: 'department', label: 'Department' },
    {
      key: 'basicSalary',
      label: 'Salary',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value, row) => (
        <div className="btn-group btn-group-sm">
          <Button
            variant="info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditingEmployee(row);
              setShowModal(true);
            }}
          >
            <FiEdit2 />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm(row);
            }}
          >
            <FiTrash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid p-0">
      {error && (
        <Alert type="danger" message={error} onClose={() => setError(null)} />
      )}

      {/* Header */}
      <Card header={<h4 className="m-0">Employees</h4>} className="mb-4">
        <div className="row align-items-end gap-3">
          {/* Search */}
          <div className="col-md-3">
            <label className="form-label">Search</label>
            <div className="input-group">
              <span className="input-group-text">
                <FiSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="col-md-3">
            <label className="form-label">Department</label>
            <select
              className="form-control"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <div className="col-md-auto">
            <Button
              variant="primary"
              onClick={() => {
                setEditingEmployee(null);
                setShowModal(true);
              }}
              className="w-100"
            >
              <FiPlus className="me-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading && filteredEmployees.length === 0 ? (
          <LoadingSpinner />
        ) : paginatedEmployees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description={search || department ? 'Try adjusting your search filters' : 'Start by adding your first employee'}
            action={
              !search && !department ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingEmployee(null);
                    setShowModal(true);
                  }}
                >
                  <FiPlus className="me-2" />
                  Add First Employee
                </Button>
              ) : null
            }
          />
        ) : (
          <>
            <Table columns={columns} data={paginatedEmployees} loading={loading} />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEmployee(null);
        }}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="md"
      >
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          onCancel={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Employee"
        size="sm"
        footer={
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={loading}
              onClick={() => handleDeleteEmployee(deleteConfirm.id)}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default EmployeeList;

import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Alert from './Alert';

function UserManagement() {
  const { user, hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userGroup: 'REGULAR',
  });

  // Fetch users on component mount
  useEffect(() => {
    if (hasRole('ADMIN')) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [hasRole]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/users');
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authorization - render denial message if not admin
  if (!hasRole('ADMIN')) {
    return (
      <div className="p-4">
        <Alert
          type="warning"
          message="Access Denied. Only admin users can manage users."
        />
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }

    try {
      setError(null);
      const response = await api.post('/users', formData);

      if (response.success) {
        // Add new user to list
        setUsers(prev => [...prev, response.data]);
        
        // Reset form
        setFormData({
          username: '',
          password: '',
          userGroup: 'REGULAR',
        });
        setShowForm(false);
      } else {
        setError(response.message || 'Failed to create user');
      }
    } catch (err) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/users/${userId}`);

      if (response.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="user-management">
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">User Management</h5>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus className="me-2" />
            Add User
          </button>
        </div>

        {error && (
          <Alert
            type="danger"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {showForm && (
          <div className="card-body border-bottom">
            <h6 className="mb-3">Create New User</h6>
            <form onSubmit={handleAddUser}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">User Group</label>
                  <select
                    className="form-select"
                    name="userGroup"
                    value={formData.userGroup}
                    onChange={handleInputChange}
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm">
                  Create User
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ username: '', password: '', userGroup: 'REGULAR' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card-body">
          {isLoading ? (
            <p className="text-center text-muted">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-muted">No users found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>User Group</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(userItem => (
                    <tr key={userItem.id}>
                      <td className="fw-medium">{userItem.username}</td>
                      <td>
                        <span className={`badge bg-${userItem.role === 'ADMIN' ? 'danger' : 'info'}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td>{userItem.userGroup}</td>
                      <td className="text-muted small">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(userItem.id)}
                          title="Delete user"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;

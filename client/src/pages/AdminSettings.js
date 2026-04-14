import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';
import UserManagement from '../components/common/UserManagement';

function AdminSettings() {
  const { user, hasRole } = useAuth();

  // Only ADMIN users can access this page
  if (!hasRole('ADMIN')) {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <Alert
              type="danger"
              message="Access Denied. Only admin users can access the Admin Settings page."
            />
            <p className="text-center mt-4">
              Current user: <strong>{user?.username}</strong> ({user?.role})
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Admin Settings</h2>
        <p className="text-muted">Manage system users and configurations</p>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <UserManagement />
        </div>

        <div className="col-lg-4">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title mb-3">Admin Information</h6>
              <p className="small mb-2">
                <strong>Current User:</strong> {user?.username}
              </p>
              <p className="small mb-2">
                <strong>Role:</strong> {user?.role}
              </p>
              <p className="small mb-2">
                <strong>User Group:</strong> {user?.userGroup}
              </p>
              <hr />
              <h6 className="card-title mb-2 mt-3">User Groups</h6>
              <ul className="small list-unstyled">
                <li>
                  <strong>ADMIN</strong> - Full system access
                </li>
                <li>
                  <strong>REGULAR</strong> - Limited access (employees only)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;

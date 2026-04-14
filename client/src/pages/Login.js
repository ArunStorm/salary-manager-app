import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username || !password) {
      setLocalError('Username and password are required');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setLocalError(result.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">💼 Salary HRMS</h1>
          <p className="login-subtitle">Employee & Payroll Management System</p>
        </div>

        {(error || localError) && (
          <Alert
            type="danger"
            message={error || localError}
            onClose={() => setLocalError(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-divider mt-4 mb-4">
          <span>Demo Credentials</span>
        </div>

        <div className="demo-credentials">
          <p className="small mb-1">
            <strong>Username:</strong> <code>ARUN</code>
          </p>
          <p className="small">
            <strong>Password:</strong> <code>welcome</code>
          </p>
        </div>

        <div className="login-footer mt-4 pt-4 border-top">
          <p className="text-muted text-center small m-0">
            © 2026 Salary Management HRMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

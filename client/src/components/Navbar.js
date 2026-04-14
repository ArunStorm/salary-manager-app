import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from './common';

function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="app-navbar">
      <button className="btn btn-ghost d-md-none">
        <FiMenu size={24} />
      </button>

      <h5 className="m-0 fw-bold text-primary flex-grow-1">💼 Salary HRMS</h5>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-ghost" onClick={toggleTheme} title="Toggle theme">
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <div className="position-relative">
          <button
            className="btn btn-ghost p-1"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title={user?.username}
          >
            <Avatar name={user?.username || 'User'} size="sm" />
          </button>

          {showProfileMenu && (
            <div
              className="position-absolute end-0 mt-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-lg)',
                minWidth: '200px',
                zIndex: 1000,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="p-2">
                <p className="small mb-1 text-secondary">Logged in as</p>
                <p className="small fw-bold mb-3">{user?.username || 'User'}</p>
              </div>
              <hr className="m-2" />
              <button
                className="btn btn-ghost w-100 d-flex align-items-center gap-2 justify-content-start px-3 py-2 text-danger"
                onClick={() => {
                  handleLogout();
                  setShowProfileMenu(false);
                }}
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
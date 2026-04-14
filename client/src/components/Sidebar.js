import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiFileText,
} from 'react-icons/fi';

function Sidebar() {
  const location = useLocation();

  const navigation = [
    { path: '/', label: 'Dashboard', icon: <FiHome /> },
    { path: '/employees', label: 'Employees', icon: <FiUsers /> },
    { path: '/attendance', label: 'Attendance', icon: <FiCalendar /> },
    { path: '/payroll', label: 'Payroll', icon: <FiDollarSign /> },
    { path: '/payslips', label: 'Payslips', icon: <FiFileText /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="app-sidebar">
      <div className="p-3 border-bottom border-color">
        <h6 className="m-0 fw-bold text-primary d-flex align-items-center gap-2">
          💼 <span>Salary HRMS</span>
        </h6>
      </div>

      <nav className="p-3">
        <ul className="list-unstyled">
          {navigation.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-secondary'
                }`}
                style={{
                  backgroundColor: isActive(item.path) ? 'var(--color-primary)' : 'transparent',
                  color: isActive(item.path) ? 'white' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span className="flex-grow-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-top border-color">
        <p className="text-secondary small m-0">v1.0.0-alpha</p>
      </div>
    </aside>
  );
}

export default Sidebar;
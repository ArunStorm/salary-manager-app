import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Card, Badge, LoadingSpinner, EmptyState } from '../components/common';
import { FiUsers, FiDollarSign, FiCalendar, FiTrendingUp, FiAlert } from 'react-icons/fi';
import { API_ENDPOINTS, ATTENDANCE_STATUS, COLORS } from '../utils/constants';
import { formatCurrency, displayMonthYear } from '../utils/formatters';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const employeesFetch = useFetch();
  const salaryFetch = useFetch();
  const advanceFetch = useFetch();
  const attendanceFetch = useFetch();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [empRes, salaryRes, advanceRes, attendanceRes] = await Promise.all([
        employeesFetch.execute('GET', API_ENDPOINTS.EMPLOYEES),
        salaryFetch.execute('GET', API_ENDPOINTS.SALARY),
        advanceFetch.execute('GET', API_ENDPOINTS.ADVANCE_SALARY),
        attendanceFetch.execute('GET', API_ENDPOINTS.ATTENDANCE),
      ]);

      const employees = empRes?.data || [];
      const salaries = salaryRes?.data || [];
      const advances = advanceRes?.data || [];
      const attendance = attendanceRes?.data || [];

      const pendingAdvances = advances.filter(a => a.status === 'pending').length;
      const totalPayroll = salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
      const presentToday = attendance.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;

      setStats({
        totalEmployees: employees.length,
        totalPayroll,
        pendingAdvances,
        presentToday,
        employees,
        salaries,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  if (!stats) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="m-0">Dashboard</h3>
          <p className="text-secondary small mt-1">Welcome to Salary Management System</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row gap-3 mb-4">
        {/* Total Employees Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <Card className="stat-card">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-secondary small m-0">Total Employees</p>
                <h4 className="m-0 mt-2 text-primary fw-bold">{stats.totalEmployees}</h4>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <FiUsers size={24} color={COLORS.PRIMARY} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>↑ 12% from last month</div>
          </Card>
        </div>

        {/* Total Payroll Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <Card className="stat-card">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-secondary small m-0">Total Payroll</p>
                <h4 className="m-0 mt-2 text-success fw-bold">{formatCurrency(stats.totalPayroll)}</h4>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <FiDollarSign size={24} color={COLORS.SUCCESS} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current month</div>
          </Card>
        </div>

        {/* Present Today Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <Card className="stat-card">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-secondary small m-0">Present Today</p>
                <h4 className="m-0 mt-2 text-info fw-bold">
                  {stats.presentToday}/{stats.totalEmployees}
                </h4>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <FiCalendar size={24} color={COLORS.INFO} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}% attendance
            </div>
          </Card>
        </div>

        {/* Pending Advances Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <Card className={`stat-card ${stats.pendingAdvances > 0 ? 'border-warning' : ''}`}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-secondary small m-0">Pending Advances</p>
                <h4 className="m-0 mt-2 text-warning fw-bold">{stats.pendingAdvances}</h4>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <FiAlert size={24} color={COLORS.WARNING} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Awaiting approval</div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="row">
        <div className="col-12">
          <Card>
            <h5 className="mb-4">Quick Actions</h5>
            <div className="d-flex flex-wrap gap-3">
              <a
                href="/employees"
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'opacity var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                Manage Employees
              </a>
              <a
                href="/payroll"
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--color-success)',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'opacity var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                View Payroll
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
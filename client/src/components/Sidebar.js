import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3" style={{ width: "220px", height: "100vh" }}>
      <h4>💼 HRMS</h4>
      <hr />

      <Link to="/" className="d-block text-white mb-2">Dashboard</Link>
      <Link to="/employees" className="d-block text-white mb-2">Employees</Link>
      <Link to="/payroll" className="d-block text-white mb-2">Payroll</Link>
    </div>
  );
}

export default Sidebar;
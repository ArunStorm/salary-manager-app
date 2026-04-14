import { useEffect, useState } from "react";

function Dashboard() {
  const API = "https://salary-manager-app.onrender.com";
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch(`${API}/employees`)
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  return (
    <div>
      <h3>Dashboard</h3>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h5>Total Employees</h5>
            <h2>{employees.length}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
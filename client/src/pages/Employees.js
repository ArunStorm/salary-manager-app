import { useEffect, useState } from "react";

function Employees() {
  const API = "https://salary-manager-app.onrender.com";

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", role: "" });

  const fetchEmployees = async () => {
    const res = await fetch(`${API}/employees`);
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async () => {
    await fetch(`${API}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name: "", role: "" });
    fetchEmployees();
  };

  return (
    <div>
      <h3>Employees</h3>

      <div className="card p-3 mb-3">
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Role"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        />

        <button className="btn btn-primary" onClick={addEmployee}>
          Add Employee
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
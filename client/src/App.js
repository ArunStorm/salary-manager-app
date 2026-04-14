import { useEffect, useState } from "react";

function App() {
  const API = "https://salary-manager-app.onrender.com";   
  console.log("API URL:", API);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", role: "" });
  const [salaryForm, setSalaryForm] = useState({});

  // ================= LOGIN =================

  const handleLogin = () => {
    fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginForm)
    })
      .then(res => {
        if (!res.ok) throw new Error("Invalid login");
        return res.json();
      })
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        alert("Invalid username or password");
      });
  };

  // ================= FETCH =================

  const fetchEmployees = () => {
    fetch(`${API}/employees`)
      .then(res => res.json())
      .then(setEmployees);
  };

  useEffect(() => {
    if (isLoggedIn) fetchEmployees();
  }, [isLoggedIn]);

  // ================= EMPLOYEE =================

  const addEmployee = () => {
    fetch(`${API}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ name: "", role: "" });
      fetchEmployees();
    });
  };

  const handleSalaryChange = (id, field, value) => {
    setSalaryForm({
      ...salaryForm,
      [id]: {
        ...salaryForm[id],
        [field]: value
      }
    });
  };

  const addSalary = (id) => {
    fetch(`${API}/employees/${id}/salary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(salaryForm[id])
    });
  };

  const downloadPayslip = async (empId) => {
    const res = await fetch(`${API}/employees/${empId}/salary`);
    const data = await res.json();

    if (data.length > 0) {
      const salaryId = data[0].id;
      window.open(`${API}/employees/${empId}/payslip/${salaryId}`);
    }
  };

  // ================= UI =================

  // 🔐 LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="card p-4 shadow" style={{ width: "350px" }}>
          <h4 className="text-center mb-3">Login</h4>

          <input
            className="form-control mb-2"
            placeholder="Username"
            onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
          />

          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // 💼 MAIN APP
  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between mb-3">
        <h2>💼 Salary Manager</h2>
        <button className="btn btn-danger" onClick={() => setIsLoggedIn(false)}>
          Logout
        </button>
      </div>

      {/* Add Employee */}
      <div className="card p-3 mb-4 shadow">
        <h5>Add Employee</h5>

        <div className="row">
          <div className="col">
            <input
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              placeholder="Role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            />
          </div>

          <div className="col">
            <button className="btn btn-primary w-100" onClick={addEmployee}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card p-3 shadow">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Month</th>
              <th>Salary</th>
              <th>Advance</th>
              <th>Days</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.role}</td>

                <td>
                  <input className="form-control"
                    onChange={e => handleSalaryChange(emp.id, "month", e.target.value)} />
                </td>

                <td>
                  <input type="number" className="form-control"
                    onChange={e => handleSalaryChange(emp.id, "salary", e.target.value)} />
                </td>

                <td>
                  <input type="number" className="form-control"
                    onChange={e => handleSalaryChange(emp.id, "advance", e.target.value)} />
                </td>

                <td>
                  <input type="number" className="form-control"
                    onChange={e => handleSalaryChange(emp.id, "presentDays", e.target.value)} />
                </td>

                <td>
                  <button className="btn btn-success me-2"
                    onClick={() => addSalary(emp.id)}>Save</button>

                  <button className="btn btn-warning"
                    onClick={() => downloadPayslip(emp.id)}>Payslip</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
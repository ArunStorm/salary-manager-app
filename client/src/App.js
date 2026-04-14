import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Payroll from "./pages/Payroll";

function App() {
  return (
    <Router>
      <div className="d-flex">

        <Sidebar />

        <div className="flex-grow-1">
          <Navbar />

          <div className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/payroll" element={<Payroll />} />
            </Routes>
          </div>
        </div>

      </div>
    </Router>
  );
}

export default App;
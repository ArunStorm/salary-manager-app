import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app-layout">
            <Sidebar />

            <div className="app-content">
              <Navbar />

              <main className="app-main">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/admin-settings" element={<AdminSettings />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
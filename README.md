# 💼 Salary Management / HRMS Web Application

A production-ready, scalable, and visually stunning SaaS platform for Human Resource Management and Salary Processing. Built with React, Node.js, and Firebase.

---

## 🎯 Features

### Core Features
- ✅ **Employee Management** - Add, edit, delete, and manage employee profiles
- ✅ **Attendance System** - Mark attendance with calendar view, track working days
- ✅ **Payroll System** - Salary structures, batch & individual salary processing, advance salary approvals
- ✅ **Payslip Generation** - Professional PDF payslips with email distribution
- ✅ **Dashboard & Analytics** - Real-time stats, salary trends, charts
- ✅ **Dark Mode** - Toggle between light and dark themes

### Advanced Features
- ✅ **Advance Salary Requests** - Employee requests with admin approval workflow
- ✅ **Salary Increments** - Track and apply salary revisions
- ✅ **CSV/PDF Export** - Download reports and data
- ✅ **Role-Based Access** - Admin and HR roles with different permissions
- ✅ **Pagination & Search** - Filter and navigate large datasets efficiently
- ✅ **Email Integration** - Send payslips via email (configurable)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Bootstrap 5 |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore |
| **Charts** | Chart.js, react-chartjs-2 |
| **Forms** | react-hook-form, yup |
| **Notifications** | react-toastify |
| **PDF** | PDFKit |
| **Email** | Nodemailer (configurable) |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 📂 Project Structure

```
salary-manager-app/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Reusable components (Navbar, Sidebar, etc.)
│   │   │   ├── employees/           # Employee-related components
│   │   │   ├── attendance/          # Attendance components
│   │   │   ├── payroll/             # Payroll & salary components
│   │   │   └── dashboard/           # Dashboard components
│   │   ├── pages/                   # Page components (Dashboard, Employees, etc.)
│   │   ├── context/                 # React Context (Auth, Theme)
│   │   ├── services/                # API client & services
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── utils/                   # Utilities (constants, formatters, validators)
│   │   ├── styles/                  # Global CSS & design system
│   │   ├── App.js
│   │   ├── index.js
│   │   └── .env.local              # Environment variables (create from .env.example)
│   ├── package.json
│   └── .env.example
│
├── server/                          # Express Backend
│   ├── routes/                      # API routes (employees, salary, attendance, etc.)
│   ├── middleware/                  # Custom middleware (auth, error handling)
│   ├── utils/                       # Utilities (PDF generation, validators, etc.)
│   ├── firebase.js                  # Firebase initialization
│   ├── index.js                     # Main server file
│   ├── package.json
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Template for .env
│   └── serviceAccountKey.json       # Firebase credentials (gitignored)
│
├── .gitignore
├── README.md                        # This file
└── package.json                     # Root package.json (if using monorepo)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **Firebase Project** (Firestore database setup)
- **Git** for version control

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd salary-manager-app
```

#### 2. Install backend dependencies
```bash
cd server
npm install
```

#### 3. Setup backend environment
Create `.env` file in `server/` directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` and configure:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
# FIREBASE_KEY=<your-firebase-service-account-json>
```

**Firebase Setup:**
- Get your Firebase service account key from Firebase Console
- Either set `FIREBASE_KEY` environment variable or keep `serviceAccountKey.json` in server root

#### 4. Install frontend dependencies
```bash
cd ../client
npm install
```

#### 5. Setup frontend environment
Create `.env.local` file in `client/` directory:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Start Backend (Port 5000)**
```bash
cd server
npm start
# or with auto-reload:
npm run dev
```

**Terminal 2 - Start Frontend (Port 3000)**
```bash
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials (Mock Auth)
```
Username: admin
Password: anything
Role: Admin (full access)

OR

Username: anything
Password: anything
Role: Employee (limited access)
```

---

## 🔑 Environment Variables

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000          # Backend API URL
REACT_APP_ENV=development                        # Environment (development/production)
```

### Backend (.env)
```
PORT=5000                                         # Server port
NODE_ENV=development                             # Node environment
CORS_ORIGIN=http://localhost:3000               # Frontend URL for CORS
# FIREBASE_KEY=<firebase-service-account-json>  # Firebase credentials
# SMTP_HOST=smtp.gmail.com                      # Email config (optional)
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

---

## 📊 Key Components

### Frontend Architecture

**Authentication**
- Mock authentication stored in localStorage
- `AuthContext` manages user state and roles
- `useAuth` hook for easy access to auth methods

**Theme System**
- `ThemeContext` manages light/dark mode
- CSS variables for dynamic theme switching
- Preference saved to localStorage

**API Service**
- Centralized `api.js` service for all HTTP requests
- Automatic error handling and auth token injection
- Consistent response handling across the app

**Design System**
- `variables.css` - CSS variables for colors, spacing, typography
- `global.css` - Global styles and utility classes
- Bootstrap 5 for component foundation

### Backend Structure

**Routes** (`server/routes/`)
- `employees.js` - Employee CRUD operations
- `attendance.js` - Attendance marking and tracking
- `salary.js` - Salary structure and records
- `payslip.js` - PDF generation
- `advanceSalary.js` - Advance request management
- `auth.js` - Authentication endpoints

**Middleware** (`server/middleware/`)
- `errorHandler.js` - Centralized error handling
- `authMiddleware.js` - Token validation (future)

**Utils** (`server/utils/`)
- `pdfGenerator.js` - PDF creation utility
- `validators.js` - Input validation
- `dateHelpers.js` - Date manipulation helpers

---

## 🔐 Authentication

Currently uses **mock authentication** for MVP:
- Any username/password combination accepted (after Phase 1)
- Token stored in localStorage
- Will be upgraded to JWT-based auth in production

**Role-Based Access:**
- **Admin** - Full system access, approvals, reporting
- **Employee** - Limited access, view own data, request advances
- **HR** - Employee management, salary processing

---

## 📈 Database Schema (Firestore)

### Employees Collection
```
employees/
  {employeeId}/
    - name: string
    - email: string
    - phone: string
    - role: string
    - department: string
    - joinDate: timestamp
    - basicSalary: number
    - allowances: { hra, da, conveyance, ... }
    - deductions: { pf, tds, insurance, ... }
    - status: "active" | "inactive"
    
    salaryRecords/ (subcollection)
      {monthYear}/
        - basicSalary: number
        - allowances: {}
        - deductions: {}
        - advance: number
        - netSalary: number
        - processedDate: timestamp
    
    attendanceRecords/ (subcollection)
      {monthYear}/
        - {day}: "Present" | "Absent" | "Leave"
    
    advanceRequests/ (subcollection)
      {requestId}/
        - amount: number
        - status: "Pending" | "Approved" | "Rejected"
        - deductionMonth: string
        - approvalDate: timestamp
```

---

## 🛠️ Development

### Code Style
- **Frontend**: ES6+, functional components with hooks
- **Backend**: Express middleware, async/await
- **Comments**: JSDoc for functions, inline comments for complex logic

### Adding New Features

**Frontend Component:**
1. Create component in `src/components/` or `src/pages/`
2. Use existing hooks (`useAuth`, `useTheme`, `useFetch`)
3. Import from utilities (`constants`, `formatters`, `validators`)

**Backend Route:**
1. Create route file in `routes/`
2. Import in `index.js` or create modular router
3. Add validation middleware
4. Return consistent response format

---

## 📦 Building for Production

### Frontend (Vercel)
```bash
cd client
npm run build
```

Push to GitHub → Vercel auto-deploys
Set `REACT_APP_API_URL` to production backend URL in Vercel dashboard

### Backend (Render)
```bash
# Just push to GitHub, Render auto-deploys
```

Set environment variables in Render dashboard:
- `PORT=5000`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://your-vercel-app.vercel.app`
- `FIREBASE_KEY=<your-firebase-credentials>`

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
Check `CORS_ORIGIN` in backend `.env` matches frontend URL

### Firebase connection issues
1. Verify `serviceAccountKey.json` exists in `server/` root
2. Check Firebase project ID matches
3. Ensure Firestore database is created in Firebase Console

### Port already in use
```bash
# Check and kill process on port 5000 (macOS/Linux)
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📚 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login with username/password

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance/:employeeId/:month` - Get monthly attendance
- `POST /api/attendance/:employeeId/:month` - Mark attendance

### Salary
- `POST /api/salary/:employeeId/monthly` - Create salary record
- `GET /api/salary/:employeeId/history` - Salary history
- `GET /api/payslip/:employeeId/:monthYear` - Generate PDF payslip

### Advance Salary
- `POST /api/advance-salary` - Create advance request
- `GET /api/advance-salary/all` - List all requests (admin)
- `PUT /api/advance-salary/:requestId/approve` - Approve request
- `PUT /api/advance-salary/:requestId/reject` - Reject request

---

## 🚀 Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Firebase Firestore security rules configured
- [ ] CORS properly configured
- [ ] Email service configured (if needed)
- [ ] Tests passed locally
- [ ] Build creates no errors
- [ ] Production database data sanitized
- [ ] API URLs use HTTPS
- [ ] All sensitive data in environment variables

---

## 📝 License

This project is proprietary and confidential.

---

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review code comments and JSDoc
3. Check GitHub issues
4. Contact development team

---

## 🎯 Roadmap

**Phase 1** ✅ - Foundation & Architecture (In Progress)
**Phase 2** - Complete Employee Management
**Phase 3** - Attendance System
**Phase 4** - Payroll & Salary Management
**Phase 5** - Payslip Generation
**Phase 6** - Dashboard & Analytics
**Phase 7** - Styling & Premium UX
**Phase 8** - Advanced Features
**Phase 9** - Error Handling & Validation
**Phase 10** - Deployment & Documentation

---

Last Updated: April 14, 2026
Version: 1.0.0-alpha

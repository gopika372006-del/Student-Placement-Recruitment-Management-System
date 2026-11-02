import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
  Navigate
} from "react-router-dom";
import Students from "./Students.jsx";
import Companies from "./Companies.jsx";
import Placements from "./placements.jsx";
import Requirements from "./Requirements.jsx";
// import Reports from "./Reports.jsx";
import Interviews from "./Interviews.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

import "./App.css";

// ================= HOME PAGE =================

function Home() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    // Students
    fetch("http://127.0.0.1:8000/students/api/")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });

    // Companies
    fetch("http://127.0.0.1:8000/companies/api/")
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });

    // Placements
    fetch("http://127.0.0.1:8000/placements/api/")
      .then((response) => response.json())
      .then((data) => {
        setPlacements(data);
      })
      .catch((error) => {
        console.error("Error fetching placements:", error);
      });

    // Job Requirements
    fetch("http://127.0.0.1:8000/placements/requirements/api/")
      .then((response) => response.json())
      .then((data) => {
       setRequirements(data);
      })
      .catch((error) => {
        console.error("Error fetching requirements:", error);
      });
  }, []);

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="logo">
          🎓
          <span>
            Placement
            <small>Management System</small>
          </span>
        </div>

        <div className="nav-links">
          {/* <a href="http://127.0.0.1:8000/">Home</a> */}

         {/* <Link to="/students">
            Students
         </Link>

          <Link to="/companies">Companies</Link>

          <Link to="/requirements">Job Requirements</Link>

          <Link to="/placements">Placements</Link>

          <Link to="/reports">Reports</Link>

          <Link to="/interviews">Interviews</Link> */}

            <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
            </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="badge">
            🎓 Smart Placement Portal
          </span>

          <h1>
            Student Placement &
            <span> Recruitment Management System</span>
          </h1>

          <p>
            Connecting talented students with great career opportunities.
            Manage students, companies, requirements and placements in one
            platform.
          </p>

          <div className="hero-buttons">

            {/* GET STARTED BUTTON */}

            <button
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Get Started →
            </button>

            <button className="demo-btn">
              ▶ Watch Demo
            </button>

          </div>

        </div>

        {/* ================= HERO VISUAL ================= */}

        <div className="hero-visual">

          <div className="campus">
            🎓
          </div>

          {/* Students */}

          <div className="floating-card students-card">
            🎓

            <div>
              <small>Students</small>
              <strong>{students.length}+</strong>
            </div>
          </div>

          {/* Companies */}

          <div className="floating-card company-card">
            🏢

            <div>
              <small>Companies</small>
              <strong>{companies.length}+</strong>
            </div>
          </div>

          {/* Placements */}

          <div className="floating-card placement-card">
            🎯

            <div>
              <small>Placements</small>
              <strong>{placements.length}+</strong>
            </div>
          </div>

        </div>
      </section>

      {/* ================= MODULES ================= */}

      <section className="modules">

        <div className="section-title">

          <span>CORE MODULES</span>

          <h2>
            Everything You Need
          </h2>

          <p>
            Manage the complete placement process from one platform.
          </p>

        </div>

        <div className="module-grid">

          {/* Students */}

          <div className="module-card">

            <div className="module-icon">
              🎓
            </div>

            <h3>
              Students
            </h3>

            <p>
              Manage student profiles, skills, contact details and resumes.
            </p>

            <Link to="/students">
              Explore →
            </Link>

          </div>

          {/* Companies */}

          <div className="module-card">

            <div className="module-icon">
              🏢
            </div>

            <h3>
              Companies
            </h3>

            <p>
              Manage company information and recruitment details.
            </p>

           <Link to="/companies">
           Explore →
           </Link>

          </div>

          {/* Requirements */}

          <div className="module-card">

            <div className="module-icon">
              💼
            </div>

            <h3>
              Job Requirements
            </h3>

            <p>
              Track job roles, skills, vacancies and salary details.
            </p>

            <Link to="/requirements" className="explore-btn">
              Explore  →
            </Link>

          </div>

          {/* Placements */}

          <div className="module-card">

            <div className="module-icon">
              🎯
            </div>

            <h3>
              Placements
            </h3>

            <p>
              Manage selected students and placement records.
            </p>

            <Link to="/placements" className="explore-btn">
              Explore  →
            </Link>

          </div>

          {/* Reports */}

          {/* <div className="module-card">

            <div className="module-icon">
              📊
            </div>

            <h3>
              Reports
            </h3>

            <p>
              View overall placement statistics and reports.
            </p> */}

           
            {/* <Link to="/reports" className="explore-btn">
              Explore →
            </Link> */}
          {/* </div> */}

          {/* Interviews */}

          <div className="module-card">

            <div className="module-icon">
              📅
            </div>

            <h3>
              Interviews
            </h3>

            <p>
              Schedule and manage student interviews.
            </p>

            <Link to="/interviews" className="explore-btn">
              Explore  →
            </Link>

          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="stats">

        <div className="stat">

          <span>🎓</span>

          <div>
            <strong>{students.length}+</strong>
            <small>Students Registered</small>
          </div>

        </div>

        <div className="stat">

          <span>🏢</span>

          <div>
            <strong>{companies.length}+</strong>
            <small>Companies</small>
          </div>

        </div>

        <div className="stat">

          <span>💼</span>

          <div>
            <strong>{requirements.length}+</strong>
            <small>Job Requirements</small>
          </div>

        </div>

        <div className="stat">

          <span>🎯</span>

          <div>
            <strong>{placements.length}+</strong>
            <small>Placements</small>
          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-logo">
          🎓 Placement Management System
        </div>

        <p>
          Student Placement & Recruitment Management System
        </p>

        <small>
          © 2026 All Rights Reserved
        </small>

      </footer>

    </div>
  );
}


// ================= PROTECTED ROUTE =================

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  console.log("Login status:", isLoggedIn);
  
  if (isLoggedIn !== "true") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ================= DASHBOARD PAGE =================

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  return (
    <div className="pro-dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="brand-icon">🎓</span>
          <div>
            <h2>Placement</h2>
            <small>Management System</small>
          </div>
        </div>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="dashboard-nav">
          <button className="nav-item active" onClick={() => navigate("/dashboard")}>
            <span>▦</span> Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate("/students")}>
            <span>🎓</span> Students
          </button>
          <button className="nav-item" onClick={() => navigate("/companies")}>
            <span>🏢</span> Companies
          </button>
          <button className="nav-item" onClick={() => navigate("/requirements")}>
            <span>💼</span> Job Requirements
          </button>
          <button className="nav-item" onClick={() => navigate("/placements")}>
            <span>🎯</span> Placements
          </button>
          <button className="nav-item" onClick={() => navigate("/interviews")}>
            <span>📅</span> Interviews
          </button>
          {/* <button className="nav-item" onClick={() => navigate("/reports")}>
            <span>📊</span> Reports
          </button> */}
        </nav>

        <div className="sidebar-bottom">
          <p>Administrator</p>
          <small>Manage your placement portal</small>
          <button className="logout-btn" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h2>Dashboard Overview</h2>
            <p>Student Placement & Recruitment Management</p>
          </div>
          <div className="admin-profile">
            <span className="profile-avatar">A</span>
            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span className="welcome-tag">PLACEMENT PORTAL</span>
            <h1>Welcome back, Admin! 👋</h1>
            <p>Here is an overview of your placement management system.</p>
          </div>
          <span className="welcome-emoji">🚀</span>
        </section>

        <section className="dashboard-stats">
          <div className="stat-card stat-blue">
            <div className="stat-icon">🎓</div>
            <p>Total Students</p>
            <h2>Students</h2>
            <small>Registered student records</small>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-icon">🏢</div>
            <p>Total Companies</p>
            <h2>Companies</h2>
            <small>Recruitment partners</small>
          </div>

          <div className="stat-card stat-orange">
            <div className="stat-icon">💼</div>
            <p>Job Requirements</p>
            <h2>Requirements</h2>
            <small>Available job openings</small>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-icon">🎯</div>
            <p>Total Placements</p>
            <h2>Placements</h2>
            <small>Placement records</small>
          </div>
        </section>

         <section className="dashboard-bottom"> 
          {/* <div className="overview-panel">
            <h3>Quick Access</h3>
            <p>Choose a module to manage your placement activities.</p>
            <div className="quick-links">
              <button onClick={() => navigate("/students")}>🎓 Manage Students →</button>
              <button onClick={() => navigate("/companies")}>🏢 Manage Companies →</button>
              <button onClick={() => navigate("/requirements")}>💼 View Job Requirements →</button>
              <button onClick={() => navigate("/reports")}>📊 View Reports →</button>
            </div>
          </div>  */}

          <div className="overview-panel help-panel">
            <div className="help-icon">✨</div>
            <h3>Placement Workspace</h3>
            <p>Manage student details, company information, job requirements, interviews and placement records from one place.</p>
            <button onClick={() => navigate("/")}>Visit Home Page →</button>
          </div>
        </section>

        <footer className="dashboard-footer">
          © 2026 Placement Management System
          <span>Built for smarter campus recruitment</span>
        </footer>
      </main>
    </div>
  );
}
// ================= APP =================


function App() {
  return (
    <BrowserRouter>
     

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={<Students />}
        />

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/requirements"
          element={<Requirements />}
        />

        <Route
          path="/placements"
          element={<Placements />}
        />

        <Route
          path="/interviews"
          element={<Interviews />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

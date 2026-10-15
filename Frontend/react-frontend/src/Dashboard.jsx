import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/students/api/")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error(error));

    fetch("http://127.0.0.1:8000/companies/api/")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error(error));

    fetch("http://127.0.0.1:8000/placements/requirements/api/")
      .then((response) => response.json())
      .then((data) => setRequirements(data))
      .catch((error) => console.error(error));

    fetch("http://127.0.0.1:8000/placements/api/")
      .then((response) => response.json())
      .then((data) => setPlacements(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="dashboard-logo">
          🎓
          <div>
            <strong>Placement</strong>
            <small>Management System</small>
          </div>
        </div>

        <div className="sidebar-menu">

          <button className="active">
            📊 Dashboard
          </button>

          <button onClick={() => navigate("/")}>
            🏠 Home
          </button>

          <button
            onClick={() =>
              (window.location.href =
                "http://127.0.0.1:8000/students/")
            }
          >
            🎓 Students
          </button>

          <button
            onClick={() =>
              (window.location.href =
                "http://127.0.0.1:8000/companies/")
            }
          >
            🏢 Companies
          </button>

          <button
            onClick={() =>
              (window.location.href =
                "http://127.0.0.1:8000/placements/requirements/")
            }
          >
            💼 Requirements
          </button>

          <button
            onClick={() =>
              (window.location.href =
                "http://127.0.0.1:8000/placements/")
            }
          >
            🎯 Placements
          </button>

          <button>
            📊 Reports
          </button>

          <button>
            📅 Interviews
          </button>

        </div>

        <div className="sidebar-bottom">

          <button>
            ⚙️ Settings
          </button>

          <button
            onClick={() => navigate("/")}
          >
            🚪 Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back! Here's your placement overview.
            </p>
          </div>

          <div className="profile">

            <div className="profile-icon">
              👤
            </div>

            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>

          </div>

        </header>


        {/* STAT CARDS */}

        <section className="dashboard-stats">

          <div className="dashboard-stat students">
            <div className="stat-icon">
              🎓
            </div>

            <div>
              <span>Total Students</span>
              <h2>{students.length}</h2>
              <small>Registered students</small>
            </div>
          </div>


          <div className="dashboard-stat companies">
            <div className="stat-icon">
              🏢
            </div>

            <div>
              <span>Total Companies</span>
              <h2>{companies.length}</h2>
              <small>Partner companies</small>
            </div>
          </div>


          <div className="dashboard-stat requirements">
            <div className="stat-icon">
              💼
            </div>

            <div>
              <span>Job Requirements</span>
              <h2>{requirements.length}</h2>
              <small>Available opportunities</small>
            </div>
          </div>


          <div className="dashboard-stat placements">
            <div className="stat-icon">
              🎯
            </div>

            <div>
              <span>Total Placements</span>
              <h2>{placements.length}</h2>
              <small>Successful placements</small>
            </div>
          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>Quick Actions</h2>
              <p>Access your main modules quickly.</p>
            </div>

          </div>


          <div className="quick-actions">

            <div
              className="action-card"
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:8000/students/")
              }
            >
              <div className="action-icon">
                🎓
              </div>

              <h3>Students</h3>

              <p>
                Manage student profiles and information.
              </p>

              <span>
                Open Students →
              </span>
            </div>


            <div
              className="action-card"
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:8000/companies/")
              }
            >
              <div className="action-icon">
                🏢
              </div>

              <h3>Companies</h3>

              <p>
                Manage company and recruitment details.
              </p>

              <span>
                Open Companies →
              </span>
            </div>


            <div
              className="action-card"
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:8000/placements/requirements/")
              }
            >
              <div className="action-icon">
                💼
              </div>

              <h3>Job Requirements</h3>

              <p>
                View available job requirements.
              </p>

              <span>
                View Requirements →
              </span>
            </div>


            <div
              className="action-card"
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:8000/placements/")
              }
            >
              <div className="action-icon">
                🎯
              </div>

              <h3>Placements</h3>

              <p>
                Manage student placement records.
              </p>

              <span>
                View Placements →
              </span>
            </div>

          </div>

        </section>


        {/* OVERVIEW */}

        <section className="dashboard-overview">

          <div className="overview-card">

            <h2>Placement Overview</h2>

            <p>
              Current placement statistics
            </p>

            <div className="overview-content">

              <div className="overview-number">
                <strong>{placements.length}</strong>
                <span>Total Placements</span>
              </div>

              <div className="overview-number">
                <strong>{students.length}</strong>
                <span>Students</span>
              </div>

              <div className="overview-number">
                <strong>{companies.length}</strong>
                <span>Companies</span>
              </div>

            </div>

          </div>


          <div className="welcome-card">

            <div className="welcome-icon">
              🎓
            </div>

            <h2>
              Build Your Career
            </h2>

            <p>
              Connect students with the right companies
              and create successful career opportunities.
            </p>

            <button
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:8000/placements/")
              }
            >
              View Placements →
            </button>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="dashboard-footer">
          © 2026 Placement Management System
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
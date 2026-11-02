import { useEffect, useMemo, useState } from "react";
import "./Interviews.css";

const API = "http://127.0.0.1:8000";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [requirements, setRequirements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    student: "",
    company: "",
    job_role: "",
    interview_date: "",
    interview_time: "",
    mode: "Online",
  });

  // Load Interviews, Students and Companies
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const [interviewRes, studentRes, companyRes, requirementRes] =
        await Promise.all([
          fetch(`${API}/placements/interviews/api/`, {
            credentials: "include",
          }),
          fetch(`${API}/students/api/`, {
            credentials: "include",
          }),
          fetch(`${API}/companies/api/`, {
            credentials: "include",
          }),
          fetch(`${API}/placements/requirements/api/`, {
            credentials: "include",
          }),
        ]);

      if (!interviewRes.ok) {
        throw new Error("Failed to load interviews");
      }

      if (!studentRes.ok) {
        throw new Error("Failed to load students");
      }

      if (!companyRes.ok) {
        throw new Error("Failed to load companies");
      }
      if (!requirementRes.ok) {
      throw new Error("Failed to load job roles");
      }

      const interviewData = await interviewRes.json();
      const studentData = await studentRes.json();
      const companyData = await companyRes.json();
      const requirementData = await requirementRes.json();

     setRequirements(
      Array.isArray(requirementData)
        ? requirementData
        : requirementData.results || []
    ); 

      setInterviews(
        Array.isArray(interviewData)
          ? interviewData
          : interviewData.results || []
      );

      setStudents(
        Array.isArray(studentData)
          ? studentData
          : studentData.results || []
      );

      setCompanies(
        Array.isArray(companyData)
          ? companyData
          : companyData.results || []
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Search and Filter
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const studentName =
        typeof item.student === "object"
          ? item.student?.name
          : item.student_name || item.student;

      const companyName =
        typeof item.company === "object"
          ? item.company?.company_name
          : item.company_name || item.company;

      const matchesSearch =
        String(studentName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(companyName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(item.job_role || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [interviews, search, filter]);

  // Statistics
  const scheduledCount = interviews.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const completedCount = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingCount = interviews.filter(
    (item) => item.status === "Pending"
  ).length;

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Schedule Interview API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student || !formData.company) {
      alert("Please select a student and company.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API}/placements/interviews/api/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to schedule interview");
        return;
      }

      alert("Interview scheduled successfully!");

      setFormData({
        student: "",
        company: "",
        job_role: "",
        interview_date: "",
        interview_time: "",
        mode: "Online",
      });

      setShowForm(false);

      await fetchAllData();

    } catch (err) {
      alert("Backend connection failed. Check Django server.");
    } finally {
      setSaving(false);
    }
  };

  // Status CSS
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "scheduled";
      case "completed":
        return "completed";
      case "pending":
        return "pending";
      case "cancelled":
        return "cancelled";
      default:
        return "default";
    }
  };

  return (
    <div className="interview-page">

      {/* Header */}
      <div className="interview-header">
        <div>
          <span className="interview-subtitle">
            PLACEMENT PORTAL
          </span>

          <h1>Interview Management</h1>

          <p>
            Manage and track student interviews in one place.
          </p>
        </div>

        <button
          className="schedule-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? "✕ Close Form"
            : "+ Schedule Interview"}
        </button>
      </div>

      {/* Statistics */}
      <div className="interview-stats">

        <div className="interview-stat-card">
          <div className="stat-icon blue">📋</div>
          <div>
            <p>Total Interviews</p>
            <h2>{interviews.length}</h2>
          </div>
        </div>

        <div className="interview-stat-card">
          <div className="stat-icon orange">📅</div>
          <div>
            <p>Scheduled</p>
            <h2>{scheduledCount}</h2>
          </div>
        </div>

        <div className="interview-stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <p>Completed</p>
            <h2>{completedCount}</h2>
          </div>
        </div>

        <div className="interview-stat-card">
          <div className="stat-icon purple">⏳</div>
          <div>
            <p>Pending</p>
            <h2>{pendingCount}</h2>
          </div>
        </div>

      </div>

      {/* Schedule Form */}
      {showForm && (
        <div className="interview-form-card">

          <h2>Schedule New Interview</h2>

          <p>Enter the interview details below.</p>

          <form onSubmit={handleSubmit}>
            <div className="interview-form-grid">

              {/* Student Dropdown */}
              <div className="interview-field">
                <label>Student Name</label>

                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Dropdown */}
              <div className="interview-field">
                <label>Company Name</label>

                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Company</option>

                  {companies.map((company) => (
                    <option
                      key={company.id}
                      value={company.id}
                    >
                      {company.company_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Role */}
              <div className="interview-field">
                <label>Job Role</label>

                <select
                  name="job_role"
                  value={formData.job_role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Job Role</option>

                  {requirements.map((item) => (
                    <option key={item.id} value={item.job_role}>
                      {item.job_role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interview Date */}
              <div className="interview-field">
                <label>Interview Date</label>

                <input
                  type="date"
                  name="interview_date"
                  value={formData.interview_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Interview Time */}
              <div className="interview-field">
                <label>Interview Time</label>

                <input
                  type="time"
                  name="interview_time"
                  value={formData.interview_time}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Interview Mode */}
              <div className="interview-field">
                <label>Interview Mode</label>

                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              className="save-interview-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Interview"}
            </button>

          </form>
        </div>
      )}

      {/* Interview List */}
      <div className="interview-list-card">

        <div className="interview-list-header">
          <div>
            <h2>Interview List</h2>
            <p>
              View and manage all scheduled interviews.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="interview-toolbar">

          <input
            type="text"
            placeholder="Search student, company or job role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        {/* Loading */}
        {loading && (
          <p className="interview-message">
            Loading interviews...
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="interview-error">
            {error}. Please check the Django API.
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredInterviews.length === 0 && (
          <div className="interview-empty">
            <div>📅</div>
            <h3>No Interviews Found</h3>
            <p>
              There are no interviews matching your search.
            </p>
          </div>
        )}

        {/* Interview Table */}
        {!loading && !error && filteredInterviews.length > 0 && (
          <div className="interview-table-wrapper">

            <table className="interview-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Job Role</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredInterviews.map((item) => {

                  const studentName =
                    typeof item.student === "object"
                      ? item.student?.name
                      : item.student_name || item.student;

                  const companyName =
                    typeof item.company === "object"
                      ? item.company?.company_name
                      : item.company_name || item.company;

                  return (
                    <tr key={item.id}>

                      <td>
                        <strong>
                          {studentName || "Student"}
                        </strong>
                      </td>

                      <td>
                        {companyName || "Company"}
                      </td>

                      <td>
                        {item.job_role || "-"}
                      </td>

                      <td>
                        {item.interview_date || "-"}
                      </td>

                      <td>
                        {item.interview_time || "-"}
                      </td>

                      <td>
                        {item.mode || "-"}
                      </td>

                      <td>
                        <span
                          className={`interview-status ${getStatusClass(item.status)}`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Interviews;

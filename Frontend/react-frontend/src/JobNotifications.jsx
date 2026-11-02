
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobNotifications.css";

const API_URL =
  "http://127.0.0.1:8000/placements/requirements/api/";

const APPLICATION_API_URL =
  "http://127.0.0.1:8000/placements/applications/api/";

function JobNotifications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState({});
  const [applicationError, setApplicationError] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load available jobs.");
        }

        const data = await response.json();

        setJobs(
          Array.isArray(data) ? data : data.results || []
        );
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "Cannot connect to Django. Please start the backend server."
            : err.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  function getCompanyName(job) {
    if (job.company_name) {
      return job.company_name;
    }

    if (job.company && typeof job.company === "object") {
      return (
        job.company.company_name ||
        job.company.name ||
        "Company"
      );
    }

    return job.company || "Company";
  }

  function formatSalary(salary) {
    const amount = Number(salary);

    if (!Number.isFinite(amount)) {
      return "Not specified";
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  }

  async function handleApply(job) {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Please login again before applying.");
      navigate("/login");
      return;
    }

    setApplyingJob(job.id);

    setApplicationMessage((previous) => ({
      ...previous,
      [job.id]: "",
    }));

    setApplicationError((previous) => ({
      ...previous,
      [job.id]: "",
    }));

    try {
      const response = await fetch(APPLICATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          requirement_id: job.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApplicationError((previous) => ({
          ...previous,
          [job.id]: data.error || "Unable to apply for this job.",
        }));
        return;
      }

      setApplicationMessage((previous) => ({
        ...previous,
        [job.id]: `Application submitted successfully! Status: ${data.status}`,
      }));
    } catch {
      setApplicationError((previous) => ({
        ...previous,
        [job.id]: "Cannot connect to Django backend.",
      }));
    } finally {
      setApplyingJob(null);
    }
  }

  return (
    <div className="job-notifications-page">
      <header className="jobs-header">
        <div>
          <span className="jobs-eyebrow">
            CAREER OPPORTUNITIES
          </span>

          <h1>Job Notifications</h1>

          <p>
            Discover job opportunities and explore your next
            career step.
          </p>
        </div>

        <button
          className="jobs-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <section className="jobs-summary">
        <div>
          <span className="jobs-summary-icon">💼</span>
          <div>
            <strong>{jobs.length}</strong>
            <p>Available Job Listings</p>
          </div>
        </div>
      </section>

      {loading && (
        <p className="jobs-status">
          Loading job notifications...
        </p>
      )}

      {!loading && error && (
        <p className="jobs-error">{error}</p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="jobs-empty">
          <span>📭</span>
          <h2>No job openings yet</h2>
          <p>
            New job requirements will appear here when available.
          </p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <section className="jobs-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-card-top">
                <span className="job-icon">💼</span>

                <span className="job-open-badge">
                  Job Opening
                </span>
              </div>

              <h2>{job.job_role || job.title || "Job Role"}</h2>

              <p className="job-company">
                🏢 {getCompanyName(job)}
              </p>

              <div className="job-info">
                <div>
                  <span>💰 Salary</span>
                  <strong>{formatSalary(job.salary)}</strong>
                </div>

                <div>
                  <span>👥 Vacancies</span>
                  <strong>
                    {job.vacancies ?? "Not specified"}
                  </strong>
                </div>
              </div>

              <div className="job-skills">
                <strong>Required Skills</strong>
                <p>
                  {job.required_skills || "Not specified"}
                </p>
              </div>

              <div className="job-deadline">
                <span>📅 Application deadline</span>
                <strong>
                  {job.last_date || "Not specified"}
                </strong>
              </div>

              <button
                type="button"
                className="job-details-btn"
                onClick={() =>
                  setSelectedJob(
                    selectedJob === job.id ? null : job.id
                  )
                }
              >
                {selectedJob === job.id
                  ? "Hide Details ↑"
                  : "View Details →"}
              </button>

              <button
                type="button"
                className="job-details-btn"
                onClick={() => handleApply(job)}
                disabled={applyingJob === job.id}
              >
                {applyingJob === job.id
                  ? "Applying..."
                  : "Apply Now →"}
              </button>

              {applicationMessage[job.id] && (
                <p className="jobs-status">
                  {applicationMessage[job.id]}
                </p>
              )}

              {applicationError[job.id] && (
                <p className="jobs-error">
                  {applicationError[job.id]}
                </p>
              )}

              {selectedJob === job.id && (
                <div className="job-description">
                  <h3>Job Details</h3>

                  <p>
                    <strong>Qualification:</strong>{" "}
                    {job.qualification || "Not specified"}
                  </p>

                  <p>
                    <strong>Experience:</strong>{" "}
                    {job.experience || "Fresher"}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {job.job_description ||
                      "No additional description provided."}
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default JobNotifications;

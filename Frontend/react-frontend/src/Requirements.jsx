import { useEffect, useState } from "react";
import "./Requirements.css";

const API_URL = "http://127.0.0.1:8000/placements/requirements/api/";

function Requirements() {
  const [requirements, setRequirements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    vacancies: "",
    skills: "",
    salary: "",
  });

  const loadData = async () => {
    try {
      const [requirementsResponse, companiesResponse] = await Promise.all([
        fetch(API_URL),
        fetch("http://127.0.0.1:8000/companies/api/"),
      ]);

      if (!requirementsResponse.ok) {
        throw new Error("Unable to load job requirements");
      }

      const requirementsData = await requirementsResponse.json();
      setRequirements(
        Array.isArray(requirementsData)
          ? requirementsData
          : requirementsData.results || []
      );

      if (companiesResponse.ok) {
        const companiesData = await companiesResponse.json();
        setCompanies(
          Array.isArray(companiesData)
            ? companiesData
            : companiesData.results || []
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        title: formData.title,
        company: Number(formData.company),
        vacancies: Number(formData.vacancies),
        skills: formData.skills,
        salary: formData.salary,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          Object.entries(data)
            .map(([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join(" | ") || "Unable to add requirement."
        );
        return;
      }

      setFormData({
        title: "",
        company: "",
        vacancies: "",
        skills: "",
        salary: "",
      });
      setShowForm(false);
      setMessage("Job requirement added successfully.");
      setLoading(true);
      await loadData();
    } catch (err) {
      setError("Unable to add requirement. Check the API fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job requirement?")) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Delete failed. The Django API may not support DELETE.");
        return;
      }

      setMessage("Job requirement deleted successfully.");
      setLoading(true);
      await loadData();
    } catch {
      setError("Unable to delete requirement. Check the Django server.");
    }
  };

  return (
    <div className="requirements-page">
      <header className="requirements-header">
        <div>
          <span className="requirements-eyebrow">
            PLACEMENT MANAGEMENT SYSTEM
          </span>
          <h1>Job Requirements</h1>
          <p>Manage job openings, hiring companies and required skills.</p>
        </div>

        <div className="requirements-actions">
          <span className="requirements-count">
            Total Requirements: {requirements.length}
          </span>

          <button
            className="add-requirement-btn"
            onClick={() => {
              setError("");
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "+ Add Requirement"}
          </button>
        </div>
      </header>

      {message && <div className="requirements-message">{message}</div>}
      {error && <div className="requirements-error">{error}</div>}

      {showForm && (
        <form className="requirement-form" onSubmit={handleAdd}>
          <h2>Add New Job Requirement</h2>

          <div className="requirement-form-grid">
            <input
              name="title"
              placeholder="Job title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            >
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name || company.company_name}
                </option>
              ))}
            </select>

            <input
              name="vacancies"
              type="number"
              min="1"
              placeholder="Number of vacancies"
              value={formData.vacancies}
              onChange={handleChange}
              required
            />

            <input
              name="skills"
              placeholder="Required skills"
              value={formData.skills}
              onChange={handleChange}
              required
            />

            <input
              name="salary"
              placeholder="Salary / package (optional)"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="save-requirement-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Requirement"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="requirements-info">Loading requirements...</p>
      ) : requirements.length === 0 ? (
        <div className="requirements-empty">
          <span>💼</span>
          <h2>No job requirements found</h2>
          <p>Add a job opening to get started.</p>
        </div>
      ) : (
        <div className="requirements-grid">
          {requirements.map((item) => (
            <article className="requirement-card" key={item.id}>
              <div className="requirement-card-header">
                <div className="requirement-icon">💼</div>
                <div>
                  <h2>
                    {item.title ||
                      item.job_title ||
                      item.position ||
                      "Job Requirement"}
                  </h2>
                  <p>Requirement ID: {item.id}</p>
                </div>
              </div>

              <div className="requirement-details">
                <p>
                  <strong>Company</strong>
                  <span>
                    {item.company_name ||
                      (typeof item.company === "object"
                        ? item.company?.name
                        : item.company) ||
                      "Not specified"}
                  </span>
                </p>

                <p>
                  <strong>Vacancies</strong>
                  <span>{item.vacancies ?? item.number_of_vacancies ?? "Not specified"}</span>
                </p>

                <p>
                  <strong>Skills</strong>
                  <span>{item.skills || item.required_skills || "Not specified"}</span>
                </p>

                <p>
                  <strong>Salary</strong>
                  <span>{item.salary || item.package || "Not specified"}</span>
                </p>
              </div>

              <div className="requirement-card-footer">
                <span className="requirement-status">Open Requirement</span>
                <button
                  className="delete-requirement-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requirements;
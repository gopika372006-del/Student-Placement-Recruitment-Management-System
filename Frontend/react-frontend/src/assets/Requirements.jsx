import { useEffect, useState } from "react";
import "./Requirements.css";

const API_URL = "http://127.0.0.1:8000/placements/requirements/api/";
const COMPANIES_API_URL = "http://127.0.0.1:8000/companies/api/";

function Requirements() {
  const [requirements, setRequirements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    vacancies: "",
    skills: "",
    salary: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [requirementsResponse, companiesResponse] =
        await Promise.all([
          fetch(API_URL),
          fetch(COMPANIES_API_URL),
        ]);

      if (!requirementsResponse.ok) {
        throw new Error(
          `Requirements API returned ${requirementsResponse.status}`
        );
      }

      if (!companiesResponse.ok) {
        throw new Error(
          `Companies API returned ${companiesResponse.status}`
        );
      }

      const requirementsData = await requirementsResponse.json();
      const companiesData = await companiesResponse.json();

      setRequirements(
        Array.isArray(requirementsData)
          ? requirementsData
          : requirementsData.results || []
      );

      setCompanies(
        Array.isArray(companiesData)
          ? companiesData
          : companiesData.results || []
      );
    } catch (err) {
      console.error("Load data error:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to Django. Please start the backend server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleAdd(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      !formData.title.trim() ||
      !formData.company ||
      !formData.vacancies ||
      !formData.skills.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const vacancies = Number(formData.vacancies);
    const salary =
      formData.salary.trim() === ""
        ? null
        : Number(formData.salary);

    if (!Number.isInteger(vacancies) || vacancies < 1) {
      setError("Vacancies must be a whole number greater than zero.");
      return;
    }

    if (
      salary !== null &&
      (!Number.isFinite(salary) || salary < 0)
    ) {
      setError("Enter a valid salary.");
      return;
    }
     
      const payload = {
        job_role: formData.title.trim(),
        company: Number(formData.company),
        required_skills: formData.skills.trim(),
        qualification: formData.qualification?.trim() || "Any Degree",
        experience: formData.experience?.trim() || "Fresher",
        vacancies: Number(formData.vacancies),
        salary: Number(formData.salary || 0),
        last_date: formData.last_date || "2027-12-31",
        job_description: formData.job_description?.trim() || "",
      };

<title></title>
    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { detail: responseText };
      }

      if (!response.ok) {
        const details =
          typeof data === "object"
            ? Object.entries(data)
                .map(([field, value]) => {
                  const text =
                    typeof value === "string"
                      ? value
                      : JSON.stringify(value);

                  return `${field}: ${text}`;
                })
                .join(" | ")
            : String(data);

        throw new Error(
          details || `Unable to add requirement (${response.status}).`
        );
      }

      setMessage("Requirement added successfully!");

      setFormData({
        title: "",
        company: "",
        vacancies: "",
        skills: "",
        salary: "",
      });

      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error("Add requirement error:", err);

      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to Django API. Check that the backend is running."
          : err.message
      );
    } finally {
      setSaving(false);
    }
  }

  
async function handleDelete(id) {
  if (!window.confirm("Are you sure you want to delete this requirement?")) {
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Delete failed");
    }

    setRequirements((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setMessage("Requirement deleted successfully!");
    setError("");
  } catch (err) {
    console.error("Delete error:", err);
    setError("Unable to delete requirement: " + err.message);
  }
}

  function getJobTitle(item) {
    return (
      item.title ||
      item.job_title ||
      item.position ||
      item.designation ||
      item.role ||
      "-"
    );
  }

  function getCompanyName(item) {
    if (item.company_name) return item.company_name;

    if (
      item.company &&
      typeof item.company === "object"
    ) {
      return (
        item.company.name ||
        item.company.company_name ||
        "-"
      );
    }

    const company = companies.find(
      (companyItem) =>
        companyItem.id === Number(item.company)
    );

    return (
      company?.name ||
      company?.company_name ||
      (item.company ? String(item.company) : "-")
    );
  }

  return (
    <div className="requirements-page">
      <div className="requirements-header">
        <div>
          <h1>Job Requirements</h1>
          <p>Manage company job requirements</p>
        </div>

        <button
          type="button"
          className="add-requirement-btn"
          onClick={() => {
            setError("");
            setMessage("");
            setShowForm((previous) => !previous);
          }}
        >
          {showForm ? "Cancel" : "+ Add Requirement"}
        </button>
      </div>

      {message && (
        <p className="success-message">{message}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {showForm && (
        <form
          className="requirement-form"
          onSubmit={handleAdd}
        >
          <h2>Add Job Requirement</h2>

          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Python Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company *</label>
            <select
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            >
              <option value="">Select Company</option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name ||
                    company.company_name ||
                    `Company ${company.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vacancies">Vacancies *</label>
            <input
              id="vacancies"
              name="vacancies"
              type="number"
              min="1"
              step="1"
              value={formData.vacancies}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Required Skills *</label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Python, Django, MySQL"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
              name="salary"
              type="number"
              min="0"
              step="any"
              value={formData.salary}
              onChange={handleChange}
              placeholder="30000"
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

      <div className="requirements-content">
        <h2>Requirements List</h2>

        {loading ? (
          <p>Loading requirements...</p>
        ) : requirements.length === 0 ? (
          <p>No job requirements found.</p>
        ) : (
          <div className="requirements-table-wrapper">
            <table className="requirements-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Vacancies</th>
                  <th>Skills</th>
                  <th>Salary</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requirements.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{getJobTitle(item)}</td>
                    <td>{getCompanyName(item)}</td>

                    <td>
                      {item.vacancies ??
                        item.number_of_vacancies ??
                        "-"}
                    </td>

                    <td>
                      {item.skills ||
                        item.required_skills ||
                        "-"}
                    </td>

                    <td>{item.salary ?? "-"}</td>

                    <td>
                      <button
                        type="button"
                        className="delete-requirement-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Requirements;

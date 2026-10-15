import { useEffect, useState } from "react";
import "./Companies.css";

const API_URL = "http://127.0.0.1:8000/companies/api/";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const fetchCompanies = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch companies");

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setMessage("Unable to load companies. Check the Django server.");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddCompany = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          Object.entries(data)
            .map(([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join(" | ") || "Unable to add company."
        );
        return;
      }

      setFormData({ name: "", email: "", phone: "" });
      setShowForm(false);
      setMessage("Company added successfully!");
      await fetchCompanies();
    } catch (error) {
      console.error("Error adding company:", error);
      setMessage("Unable to add company. Check your backend API.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}${companyId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage("Delete failed. Check whether the Django API supports DELETE.");
        return;
      }

      setMessage("Company deleted successfully!");
      await fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
      setMessage("Unable to delete company. Check your backend API.");
    }
  };

  return (
    <div className="companies-page">
      <header className="companies-header">
        <div>
          <span className="companies-eyebrow">PLACEMENT MANAGEMENT SYSTEM</span>
          <h1>Company Management</h1>
          <p>Manage recruitment partners and company information.</p>
        </div>

        <div className="companies-header-actions">
          <span className="company-count">
            Total Companies: {companies.length}
          </span>

          <button
            className="add-company-btn"
            onClick={() => {
              setMessage("");
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "+ Add Company"}
          </button>
        </div>
      </header>

      {message && (
        <div className="companies-message" role="status">
          {message}
        </div>
      )}

      {showForm && (
        <form className="company-form" onSubmit={handleAddCompany}>
          <h2>Add New Company</h2>

          <div className="company-form-grid">
            <input
              name="name"
              placeholder="Company name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Company email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Contact phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button className="save-company-btn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Company"}
          </button>
        </form>
      )}

      {companies.length === 0 ? (
        <div className="companies-empty">
          <span>🏢</span>
          <h2>No companies found</h2>
          <p>Add your first company to get started.</p>
        </div>
      ) : (
        <div className="companies-grid">
          {companies.map((company) => (
            <article className="company-card" key={company.id}>
              <div className="company-card-header">
                <div className="company-avatar">
                  {(company.name || company.company_name || "C")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="company-title">
                  <h2>{company.name || company.company_name || "Company"}</h2>
                  <p>Company ID: {company.id}</p>
                </div>
              </div>

              <div className="company-details">
                <p>
                  <strong>Email</strong>
                  <span>{company.email || "Not provided"}</span>
                </p>
                <p>
                  <strong>Phone</strong>
                  <span>{company.phone || "Not provided"}</span>
                </p>
              </div>

              <div className="company-card-footer">
                <span className="company-status">Recruitment Partner</span>

                <button
                  className="delete-company-btn"
                  onClick={() => handleDeleteCompany(company.id)}
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

export default Companies;

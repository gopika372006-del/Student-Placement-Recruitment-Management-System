
import { useCallback, useEffect, useMemo, useState } from "react";
import "./Placements.css";

const API_URL = "http://127.0.0.1:8000/placements/api/";
const STUDENTS_URL = "http://127.0.0.1:8000/students/api/";
const COMPANIES_URL = "http://127.0.0.1:8000/companies/api/";

const emptyForm = {
  id: "",
  student: "",
  company: "",
  job_role: "",
  placement_date: "",
  package: "",
  status: "Placed",
};

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [placementResponse, studentResponse, companyResponse] =
        await Promise.all([
          fetch(API_URL),
          fetch(STUDENTS_URL),
          fetch(COMPANIES_URL),
        ]);

      const [placementData, studentData, companyData] = await Promise.all([
        readResponse(placementResponse),
        readResponse(studentResponse),
        readResponse(companyResponse),
      ]);

      setPlacements(
        Array.isArray(placementData)
          ? placementData
          : placementData.results || []
      );

      setStudents(
        Array.isArray(studentData) ? studentData : studentData.results || []
      );

      setCompanies(
        Array.isArray(companyData) ? companyData : companyData.results || []
      );
    } catch (err) {
      setError(err.message || "Unable to load placement data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Find the registered student selected in the form.
  const selectedStudent = students.find(
    (student) => String(student.id) === String(formData.student)
  );

  // Filter registered students while typing their names.
  const studentSuggestions = useMemo(() => {
    const keyword = studentSearch.trim().toLowerCase();

    if (!keyword) return [];

    return students
      .filter((student) =>
        String(student.name || "")
          .toLowerCase()
          .includes(keyword)
      )
      .slice(0, 8);
  }, [students, studentSearch]);

  const showStudentSuggestions =
    studentSearch.trim() !== "" &&
    (!selectedStudent ||
      studentSearch.trim().toLowerCase() !==
        String(selectedStudent.name || "").trim().toLowerCase());

  const getValue = (value) => {
    if (value && typeof value === "object") {
      return (
        value.name ||
        value.company_name ||
        value.student_name ||
        value.id ||
        "—"
      );
    }

    return value === null || value === undefined || value === ""
      ? "—"
      : value;
  };

  const placedCount = placements.filter((item) => {
    const status = String(getValue(item.status)).toLowerCase();

    return status.includes("placed") || status.includes("selected");
  }).length;

  const companyCount = new Set(
    placements
      .map((item) => String(getValue(item.company)))
      .filter((name) => name !== "—")
  ).size;

  const placementRate = placements.length
    ? Math.round((placedCount / placements.length) * 100)
    : 0;

  const filteredPlacements = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return placements;

    return placements.filter((item) =>
      [
        item.student,
        item.company,
        item.job_role,
        item.status,
        item.package,
        item.placement_date,
      ].some((value) =>
        String(getValue(value)).toLowerCase().includes(keyword)
      )
    );
  }, [placements, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // When the user types, clear the old selection until a student is chosen.
  const handleStudentSearch = (event) => {
    const value = event.target.value;

    setStudentSearch(value);

    setFormData((previous) => ({
      ...previous,
      student: "",
    }));
  };

  // Select a real student record from the database.
  const selectStudent = (student) => {
    setFormData((previous) => ({
      ...previous,
      student: String(student.id),
    }));

    setStudentSearch(student.name || "");
  };

  const openAddForm = () => {
    setFormData({ ...emptyForm });
    setStudentSearch("");
    setEditing(false);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const openEditForm = (placement) => {
    const studentId = placement.student_id ?? "";

    const existingStudent = students.find(
      (student) => String(student.id) === String(studentId)
    );

    const studentName =
      existingStudent?.name ||
      (typeof placement.student === "string" ? placement.student : "") ||
      placement.student?.name ||
      placement.student?.student_name ||
      "";

    setFormData({
      id: placement.id,
      student: String(studentId),
      company: String(placement.company_id ?? ""),
      job_role: placement.job_role || "",
      placement_date:
        placement.placement_date &&
        placement.placement_date !== "None"
          ? String(placement.placement_date).slice(0, 10)
          : "",
      package: placement.package ?? "",
      status: placement.status || "Placed",
    });

    setStudentSearch(studentName);
    setEditing(true);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        student: Number(formData.student),
        company: Number(formData.company),
        job_role: formData.job_role.trim(),
        placement_date: formData.placement_date,
        package: formData.package,
        status: formData.status,
      };

      if (
        !payload.student ||
        !payload.company ||
        !payload.job_role ||
        !payload.placement_date ||
        payload.package === ""
      ) {
        throw new Error(
          "Please select a registered student and fill in all required fields."
        );
      }

      if (Number(payload.package) < 0) {
        throw new Error("Package cannot be negative.");
      }

      const response = await fetch(API_URL, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editing ? { ...payload, id: formData.id } : payload
        ),
      });

      await readResponse(response);

      setShowForm(false);
      setFormData({ ...emptyForm });
      setStudentSearch("");

      setMessage(
        editing
          ? "Placement updated successfully."
          : "Placement added successfully."
      );

      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save placement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (placement) => {
    const confirmed = window.confirm(
      `Delete placement record #${placement.id}? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: placement.id }),
      });

      await readResponse(response);

      setMessage("Placement deleted successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete placement.");
    }
  };

  return (
    <div className="placements-page">
      <header className="placements-heading">
        <div>
          <span className="placements-eyebrow">PLACEMENT MANAGEMENT</span>
          <h1>Placements</h1>
          <p>Manage student placements and track career progress.</p>
        </div>

        <button className="placement-add-btn" onClick={openAddForm}>
          + Add Placement
        </button>
      </header>

      <section className="placement-stats">
        <div className="placement-stat stat-green">
          <span className="stat-icon">✓</span>
          <div>
            <p>Total Placements</p>
            <h2>{placements.length}</h2>
          </div>
        </div>

        <div className="placement-stat stat-blue">
          <span className="stat-icon">▦</span>
          <div>
            <p>Companies</p>
            <h2>{companyCount}</h2>
          </div>
        </div>

        <div className="placement-stat stat-purple">
          <span className="stat-icon">♙</span>
          <div>
            <p>Students Placed</p>
            <h2>{placedCount}</h2>
          </div>
        </div>

        <div className="placement-stat stat-orange">
          <span className="stat-icon">↗</span>
          <div>
            <p>Placement Rate</p>
            <h2>{placementRate}%</h2>
          </div>
        </div>
      </section>

      {error && <p className="placement-alert placement-error">{error}</p>}

      {message && (
        <p className="placement-alert placement-success">{message}</p>
      )}

      {showForm && (
        <section className="placement-form-section">
          <div className="placement-form-heading">
            <div>
              <h2>{editing ? "Edit Placement" : "Add Placement"}</h2>
              <p>Enter the student, company and placement details.</p>
            </div>

            <button
              type="button"
              className="placement-close-btn"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              ✕
            </button>
          </div>

          <form className="placement-form" onSubmit={handleSubmit}>
            {/* Student search and autocomplete */}
            <label className="student-search-label">
              Student Name <span>*</span>

              <input
                type="text"
                value={studentSearch}
                onChange={handleStudentSearch}
                placeholder="Type registered student name..."
                autoComplete="off"
                required
              />

              {showStudentSuggestions && (
                <div className="student-suggestions">
                  {studentSuggestions.length > 0 ? (
                    studentSuggestions.map((student) => (
                      <button
                        type="button"
                        className="student-suggestion"
                        key={student.id}
                        onClick={() => selectStudent(student)}
                      >
                        <strong>{student.name}</strong>
                        <small>
                          {student.department} · {student.email}
                        </small>
                      </button>
                    ))
                  ) : (
                    <p className="student-no-results">
                      No registered student found.
                    </p>
                  )}
                </div>
              )}
            </label>

            {/* Registered student details */}
            {selectedStudent && (
              <div className="registered-student-details">
                <h3>Registered Student Details</h3>

                <div className="student-info-grid">
                  <div>
                    <span>Student Name</span>
                    <strong>{selectedStudent.name || "—"}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{selectedStudent.email || "—"}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{selectedStudent.phone || "—"}</strong>
                  </div>

                  <div>
                    <span>Department</span>
                    <strong>{selectedStudent.department || "—"}</strong>
                  </div>

                  <div>
                    <span>Year</span>
                    <strong>{selectedStudent.year ?? "—"}</strong>
                  </div>

                  <div>
                    <span>Skills</span>
                    <strong>{selectedStudent.skills || "—"}</strong>
                  </div>
                </div>
              </div>
            )}

            <label>
              Company <span>*</span>
              <select
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.company_name ||
                      company.name ||
                      `Company #${company.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Job Role <span>*</span>
              <input
                type="text"
                name="job_role"
                value={formData.job_role}
                onChange={handleChange}
                placeholder="e.g. Python Developer"
                required
              />
            </label>

            <label>
              Placement Date <span>*</span>
              <input
                type="date"
                name="placement_date"
                value={formData.placement_date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Salary Package <span>*</span>
              <input
                type="number"
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="Enter package amount"
                min="0"
                step="any"
                required
              />
            </label>

            <label>
              Status <span>*</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Placed">Placed</option>
                <option value="Selected">Selected</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <div className="placement-form-actions">
              <button
                type="button"
                className="placement-cancel-btn"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="placement-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Update Placement"
                    : "Save Placement"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="placements-list-section">
        <div className="placements-list-heading">
          <div>
            <h2>Placement Records</h2>
            <p>Search and manage placement records from your database.</p>
          </div>

          <span className="placements-count">
            Total: {placements.length}
          </span>
        </div>

        <div className="placements-toolbar">
          <div className="placement-search-box">
            <span>⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, company, role or status..."
              aria-label="Search placements"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading && (
          <p className="placement-message">Loading placements...</p>
        )}

        {!loading && !error && filteredPlacements.length === 0 && (
          <div className="placement-empty">
            <span>▤</span>
            <h3>{search ? "No matching placements" : "No placements found"}</h3>
            <p>
              {search
                ? "Try another search term."
                : "Add a placement record to see it here."}
            </p>
          </div>
        )}

        {!loading && filteredPlacements.length > 0 && (
          <div className="placements-grid">
            {filteredPlacements.map((placement) => (
              <article className="placement-card" key={placement.id}>
                <div className="placement-card-top">
                  <div className="company-avatar">
                    {String(getValue(placement.company))
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="placement-company-info">
                    <h3>{getValue(placement.company)}</h3>
                    <p>Placement Record #{placement.id}</p>
                  </div>

                  <span
                    className={`placement-status status-${String(
                      placement.status || "pending"
                    )
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {getValue(placement.status)}
                  </span>
                </div>

                <div className="placement-detail">
                  <span>♙</span>
                  <div>
                    <small>Student</small>
                    <p>{getValue(placement.student)}</p>
                  </div>
                </div>

                <div className="placement-detail">
                  <span>▣</span>
                  <div>
                    <small>Job Role</small>
                    <p>{getValue(placement.job_role)}</p>
                  </div>
                </div>

                <div className="placement-detail">
                  <span>₹</span>
                  <div>
                    <small>Salary Package</small>
                    <p>
                      {placement.package !== null &&
                      placement.package !== undefined &&
                      placement.package !== ""
                        ? `₹ ${Number(placement.package).toLocaleString(
                            "en-IN"
                          )}`
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="placement-detail">
                  <span>▦</span>
                  <div>
                    <small>Placement Date</small>
                    <p>
                      {placement.placement_date &&
                      placement.placement_date !== "None"
                        ? placement.placement_date
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="placement-card-footer">
                  <span>Placement Management System</span>
                  <span>#{placement.id}</span>
                </div>

                <div className="placement-card-actions">
                  <button
                    type="button"
                    className="placement-edit-btn"
                    onClick={() => openEditForm(placement)}
                  >
                    ✎ Edit
                  </button>

                  <button
                    type="button"
                    className="placement-delete-btn"
                    onClick={() => handleDelete(placement)}
                  >
                    ✕ Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Placements;


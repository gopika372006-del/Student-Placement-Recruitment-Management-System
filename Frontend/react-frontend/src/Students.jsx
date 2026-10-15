import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Students.css";

const API_URL = "http://127.0.0.1:8000/students/api/";

function Students() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    skills: "",
  });
  const navigate = useNavigate();
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage("Unable to load students. Check the Django server.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data === "object"
            ? Object.entries(data)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                .join(" | ")
            : "Unable to add student."
        );
        return;
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        skills: "",
      });

      setShowForm(false);
      setMessage("Student added successfully!");
      await fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage("Unable to add student. Check your backend API.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch(`${API_URL}${studentId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        setMessage("Delete failed. Check whether your Django API supports DELETE.");
        return;
      }

      setMessage("Student deleted successfully!");
      await fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      setMessage("Unable to delete student. Check your backend API.");
    }
  };

  return (
    <div className="students-page">
      <header className="students-header">
        <div>
          <span className="students-eyebrow">PLACEMENT MANAGEMENT SYSTEM</span>
          <h1>Student Management</h1>
          <p>Manage student profiles and academic information.</p>
        </div>

        <div className="students-header-actions">
          <span className="student-count">
            Total Students: {students.length}
          </span>

          <button
            className="add-student-btn"
            onClick={() => {
              setMessage("");
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "+ Add Student"}
          </button>
        </div>
      </header>

      {message && (
        <div className="students-message" role="status">
          {message}
        </div>
      )}

      {showForm && (
        <form className="student-form" onSubmit={handleAddStudent}>
          <h2>Add New Student</h2>

          <div className="student-form-grid">
            <input
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />

            <input
              name="year"
              type="number"
              min="1"
              placeholder="Year of study"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <input
              name="skills"
              placeholder="Skills (e.g. Python, React)"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="save-student-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Student"}
          </button>
        </form>
      )}

      <div className="students-grid">
        {students.map((student) => (
          <div className="student-card" key={student.id}>
            <div className="student-card-header">
              <div className="student-avatar">
                {student.name?.charAt(0).toUpperCase() || "S"}
              </div>

              <div className="student-heading">
                <h2>{student.name}</h2>
                <p>Student ID: {student.id}</p>
              </div>
            </div>

            <div className="student-details">
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
              <p><strong>Department:</strong> {student.department}</p>
              <p><strong>Year:</strong> {student.year}</p>
              <p><strong>Skills:</strong> {student.skills}</p>
            </div>

            <div className="student-card-footer">
              <span className="student-status">Registered Student</span>

              <button
                className="delete-student-btn"
                onClick={() => handleDeleteStudent(student.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
        <button onClick={() => navigate("/")}>
          🏠 Home
        </button>
      {students.length === 0 && (
        <div className="students-empty">
          <span>🎓</span>
          <h2>No students found</h2>
          <p>Add your first student to get started.</p>
        </div>
      )}
    </div>
  );
}

export default Students;

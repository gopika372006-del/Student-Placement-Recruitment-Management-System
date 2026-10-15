import "./Reports.css";
import { useEffect, useState } from "react";

function Reports() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const urls = [
      "http://127.0.0.1:8000/students/api/",
      "http://127.0.0.1:8000/companies/api/",
      "http://127.0.0.1:8000/placements/requirements/api/",
      "http://127.0.0.1:8000/placements/api/",
    ];

    Promise.all(
      urls.map((url) =>
        fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load report data");
          }
          return response.json();
        })
      )
    )
      .then(([studentData, companyData, requirementData, placementData]) => {
        setStudents(Array.isArray(studentData) ? studentData : studentData.results || []);
        setCompanies(Array.isArray(companyData) ? companyData : companyData.results || []);
        setRequirements(Array.isArray(requirementData) ? requirementData : requirementData.results || []);
        setPlacements(Array.isArray(placementData) ? placementData : placementData.results || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const reports = [
    { title: "Total Students", count: students.length, icon: "🎓" },
    { title: "Total Companies", count: companies.length, icon: "🏢" },
    { title: "Job Requirements", count: requirements.length, icon: "💼" },
    { title: "Total Placements", count: placements.length, icon: "🎯" },
  ];

  return (
    <div className="reports-page">
      <h1>Placement Reports</h1>
      <p>Overview of placement management data.</p>

      {loading && <p>Loading reports...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="reports-grid">
            {reports.map((report) => (
              <div className="report-card" key={report.title}>
                <h2>{report.icon} {report.title}</h2>
                <p className="report-count">{report.count}</p>
              </div>
            ))}
          </div>

          <div className="report-summary">
            <h2>Report Summary</h2>
            <p>Registered students: {students.length}</p>
            <p>Companies registered: {companies.length}</p>
            <p>Available job requirements: {requirements.length}</p>
            <p>Recorded placements: {placements.length}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;

import { useEffect, useState } from "react";
import "./Placements.css";

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/placements/api/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load placements");
        }
        return response.json();
      })
      .then((data) => {
        setPlacements(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getValue = (value) => {
    if (value && typeof value === "object") {
      return value.name || value.company_name || value.student_name || value.id || "—";
    }
    return value || "—";
  };

  const placedCount = placements.filter(
    (item) => String(getValue(item.status)).toLowerCase().includes("placed")
      || String(getValue(item.status)).toLowerCase().includes("selected")
  ).length;

  const companyCount = new Set(
    placements.map((item) => String(getValue(item.company)))
      .filter((name) => name !== "—")
  ).size;

  const placementRate = placements.length
    ? Math.round((placedCount / placements.length) * 100)
    : 0;

  return (
    <div className="placements-page">
      <header className="placements-heading">
        <div>
          <span className="placements-eyebrow">PLACEMENT MANAGEMENT</span>
          <h1>Placements</h1>
          <p>Manage student placements and track career progress.</p>
        </div>
        <div className="placements-total-badge">
          {placements.length} Records
        </div>
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

      <section className="placements-list-section">
        <div className="placements-list-heading">
          <div>
            <h2>Recent Placements</h2>
            <p>Student placement records from your database</p>
          </div>
          <span className="placements-count">
            Total: {placements.length}
          </span>
        </div>

        {loading && <p className="placement-message">Loading placements...</p>}

        {error && <p className="placement-error">Error: {error}</p>}

        {!loading && !error && placements.length === 0 && (
          <div className="placement-empty">
            <span>▤</span>
            <h3>No placements found</h3>
            <p>Placement records will appear here when available.</p>
          </div>
        )}

        {!loading && !error && placements.length > 0 && (
          <div className="placements-grid">
            {placements.map((placement) => (
              <article className="placement-card" key={placement.id}>
                <div className="placement-card-top">
                  <div className="company-avatar">
                    {String(getValue(placement.company)).charAt(0).toUpperCase()}
                  </div>
                  <div className="placement-company-info">
                    <h3>{getValue(placement.company)}</h3>
                    <p>Placement Record #{placement.id}</p>
                  </div>
                  <span className="placement-status">
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

                <div className="placement-card-footer">
                  <span>Placement Management System</span>
                  <span>#{placement.id}</span>
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

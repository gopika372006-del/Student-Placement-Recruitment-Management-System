import { useEffect, useState } from "react";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/placements/interviews/api/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load interviews");
        }
        return response.json();
      })
      .then((data) => {
        setInterviews(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1>Interview Management</h1>
      <p>Total Interviews: {interviews.length}</p>

      {loading && <p>Loading interviews...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && interviews.length === 0 && (
        <p>No interviews found.</p>
      )}

      <div className="students-grid">
        {interviews.map((item) => (
          <div className="student-card" key={item.id}>
            <h3>
              {item.title || item.interview_name || "Interview"}
            </h3>
            <p>Interview ID: {item.id}</p>

            {item.date && <p>Date: {item.date}</p>}
            {item.time && <p>Time: {item.time}</p>}
            {item.status && <p>Status: {item.status}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interviews;

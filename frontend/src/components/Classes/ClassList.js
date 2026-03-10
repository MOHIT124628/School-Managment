import React, { useEffect, useState, useCallback } from "react";
import API from "../../api";
import ClassForm from "./ClassForm";
import './ClassList.css'

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [classToEdit, setClassToEdit] = useState(null); // for update

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    try {
      const res = await API.get("/api/classes/", { params: { search } });
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      if (err.response && err.response.status === 401) {
        window.location = "/login";
      }
    }
  }, [search]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Delete a class
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await API.delete(`/api/classes/${id}`);
      setClasses(classes.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete class:", err);
      alert("You cannot delete this class.");
    }
  };

  return (
  <div className="class-container">
    <h3 className="class-title">Classes</h3>

    <div className="class-search-container">
      <input
        type="text"
        className="class-search"
        placeholder="Search classes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <ClassForm
      fetchClasses={fetchClasses}
      classToEdit={classToEdit}
      onUpdated={() => {
        fetchClasses();
        setClassToEdit(null);
      }}
    />

    <ul className="class-list">
      {classes.map((c) => (
        <li key={c.id} className="class-card">
          <span className="class-info">
            {c.name}
            {c.teacher && (
              <span>
                {" "} | Teacher: {c.teacher.name} ({c.teacher.subject})
              </span>
            )}
          </span>

          <div className="class-actions">
            <button
              className="class-update-btn"
              onClick={() => setClassToEdit(c)}
            >
              Update
            </button>

            <button
              className="class-delete-btn"
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
}

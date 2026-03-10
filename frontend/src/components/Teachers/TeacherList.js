import React, { useEffect, useState, useCallback } from "react";
import API from "../../api";
import TeacherForm from "./TeacherForm";
import './TeacherList.css'

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [teacherToEdit, setTeacherToEdit] = useState(null);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    try {
      const res = await API.get("/api/teachers/", { params: { search } });
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) window.location = "/login";
    }
  }, [search]);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  // Delete a teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await API.delete(`/api/teachers/${id}`);
      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete teacher");
    }
  };

  // Toggle active status
  const toggleActive = async (teacherId, newStatus) => {
    try {
      await API.patch(`/api/teachers/${teacherId}`, { active: newStatus });
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === teacherId ? { ...t, active: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update teacher status");
    }
  };

 return (
  <div className="teacher-container">
    <h3 className="teacher-title">Teachers</h3>

    <div className="teacher-search-container">
      <input
        type="text"
        className="teacher-search"
        placeholder="Search teachers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <TeacherForm
      fetchTeachers={fetchTeachers}
      teacherToEdit={teacherToEdit}
      onUpdated={() => {
        fetchTeachers();
        setTeacherToEdit(null);
      }}
    />

    <ul className="teacher-list">
      {teachers.map((t) => (
        <li key={t.id} className="teacher-card">

          <span className="teacher-info">
            {t.name} - {t.subject} - {t.email} | Class:{" "}
            {t.class_ ? t.class_.name : "No Class"}
          </span>

          <div className="teacher-actions">

            <button
              className="teacher-update-btn"
              onClick={() => setTeacherToEdit(t)}
            >
              Update
            </button>

            <button
              className="teacher-delete-btn"
              onClick={() => handleDelete(t.id)}
            >
              Delete
            </button>

            <button
              className={
                t.active ? "teacher-active-btn" : "teacher-inactive-btn"
              }
              onClick={() => toggleActive(t.id, !t.active)}
            >
              {t.active ? "Active" : "Inactive"}
            </button>

          </div>

        </li>
      ))}
    </ul>
  </div>
);
}

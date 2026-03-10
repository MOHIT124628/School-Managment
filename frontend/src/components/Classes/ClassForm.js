import React, { useState, useEffect } from "react";
import API from "../../api";
import "./ClassList.css";

export default function ClassForm({ fetchClasses, classToEdit, onUpdated }) {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: "", teacher_id: "" });

  // Prefill form when editing
  useEffect(() => {
    if (classToEdit) {
      setForm({
        name: classToEdit.name || "",
        teacher_id: classToEdit.teacher ? classToEdit.teacher.id : "",
      });
    } else {
      setForm({ name: "", teacher_id: "" });
    }
  }, [classToEdit]);

  // Fetch teachers for dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await API.get("/api/teachers/");
        setTeachers(res.data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };
    fetchTeachers();
  }, []);

  // Submit form (create or update)
  const handleSubmit = async () => {
    try {
      if (classToEdit) {
        // Update existing class
        await API.put(`/api/classes/${classToEdit.id}`, form);
        onUpdated?.();
      } else {
        // Create new class
        await API.post("/api/classes/", form);
        fetchClasses();
      }
      setForm({ name: "", teacher_id: "" });
    } catch (err) {
      console.error("Error saving class:", err);
    }
  };

  return (
  <div className="class-form-card">
    <h3 className="class-form-title">
      {classToEdit ? "Update Class" : "Add Class"}
    </h3>

    <div className="class-form-fields">

      <input
        type="text"
        className="class-form-input"
        placeholder="Class Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        className="class-form-select"
        value={form.teacher_id}
        onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
      >
        <option value="">Assign Teacher</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} – {t.subject}
          </option>
        ))}
      </select>

      <div className="class-form-buttons">

        <button className="class-form-submit" onClick={handleSubmit}>
          {classToEdit ? "Update" : "Add"}
        </button>

        {classToEdit && (
          <button
            className="class-form-cancel"
            onClick={() => {
              setForm({ name: "", teacher_id: "" });
              onUpdated?.();
            }}
          >
            Cancel
          </button>
        )}

      </div>

    </div>
  </div>
);
}

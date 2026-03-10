import { useEffect, useState } from "react";
import API from "../../api";
import './StudentList.css'

export default function StudentForm({ onAdded, studentToEdit, onUpdated, onCancel }) {
  const [form, setForm] = useState({ name: "", age: "", grade: "", parent_contact: "" });

  useEffect(() => {
    if (studentToEdit) {
      setForm({
        name: studentToEdit.name,
        age: studentToEdit.age,
        grade: studentToEdit.grade,
        parent_contact: studentToEdit.parent_contact || "",
      });
    } else {
      setForm({ name: "", age: "", grade: "", parent_contact: "" });
    }
  }, [studentToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (studentToEdit) {
        // Update
        await API.patch(`/api/students/${studentToEdit.id}`, {
          ...form,
          age: parseInt(form.age, 10),
        });
        if (onUpdated) onUpdated();
      } else {
        // Create
        await API.post("/api/students", { ...form, age: parseInt(form.age, 10) });
        if (onAdded) onAdded();
      }
      setForm({ name: "", age: "", grade: "", parent_contact: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save student");
    }
  };

return (
  <form onSubmit={handleSubmit} className="student-form">
    <h4 className="form-title">
      {studentToEdit ? "Update Student" : "Add Student"}
    </h4>

    <input
      className="form-input"
      placeholder="Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      required
    />

    <input
      className="form-input"
      placeholder="Age"
      type="number"
      value={form.age}
      onChange={(e) => setForm({ ...form, age: e.target.value })}
      required
    />

    <select
      className="form-input"
      value={form.grade}
      onChange={(e) => setForm({ ...form, grade: e.target.value })}
      required
    >
      <option value="">Select grade</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>

    <input
      className="form-input"
      placeholder="Parent contact"
      value={form.parent_contact}
      onChange={(e) =>
        setForm({ ...form, parent_contact: e.target.value })
      }
    />

    <div className="form-buttons">
      <button type="submit" className="submit-btn">
        {studentToEdit ? "Update" : "Add"}
      </button>

      {studentToEdit && (
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
);
}

import { useEffect, useState } from "react";
import API from "../../api";
import './TeacherList.css'

export default function TeacherForm({ fetchTeachers, teacherToEdit, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    email: "",
    class_id: null
  });
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/api/classes/");
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
        setError("Failed to fetch classes");
      }
    };
    fetchClasses();
  }, []);

  // Prefill form when editing
useEffect(() => {
  if (teacherToEdit) {
    setForm({
      name: teacherToEdit.name || "",
      subject: teacherToEdit.subject || "",
      email: teacherToEdit.email || "",
      class_id: teacherToEdit.class_ ? teacherToEdit.class_.id : null,
    });
  } else {
    setForm({ name: "", subject: "", email: "", class_id: null });
  }
}, [teacherToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, class_id: form.class_id ? Number(form.class_id) : null };

      if (teacherToEdit) {
        await API.patch(`/api/teachers/${teacherToEdit.id}`, payload);
        if (onUpdated) onUpdated();
      } else {
        await API.post("/api/teachers/", payload);
        if (fetchTeachers) fetchTeachers();
      }

      setForm({ name: "", subject: "", email: "", class_id: null });
    } catch (err) {
      console.error("Failed to save teacher:", err);

      // Display API error message if available
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to save teacher.");
      }
    }
  };

 return (
  <form onSubmit={handleSubmit} className="teacher-form">

    {error && <div className="teacher-error">{error}</div>}

    <input
      className="teacher-input"
      placeholder="Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      required
    />

    <input
      className="teacher-input"
      placeholder="Subject"
      value={form.subject}
      onChange={(e) => setForm({ ...form, subject: e.target.value })}
    />

    <input
      className="teacher-input"
      type="email"
      placeholder="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      required
    />

    <select
      className="teacher-select"
      value={form.class_id ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        setForm({
          ...form,
          class_id: val ? parseInt(val, 10) : null,
        });
      }}
    >
      <option value="">Select Class</option>
      {classes.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>

    <div className="teacher-form-buttons">
      <button type="submit" className="teacher-submit-btn">
        {teacherToEdit ? "Update" : "Add"}
      </button>

      {teacherToEdit && (
        <button
          type="button"
          className="teacher-cancel-btn"
          onClick={() => {
            setForm({ name: "", subject: "", email: "", class_id: null });
            if (onUpdated) onUpdated();
          }}
        >
          Cancel
        </button>
      )}
    </div>

  </form>
);
}

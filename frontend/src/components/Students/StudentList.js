import { useEffect, useState, useCallback } from "react";
import StudentFilters from "./StudentFilters";
import StudentForm from "./StudentForm";
import API from "../../api";
import "./StudentList.css"

export default function StudentList() {
  const [query, setQuery] = useState({ search: "", grade: "", active: "" });
  const [page, setPage] = useState(0);
  const [students, setStudents] = useState([]);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const fetchStudents = useCallback(async () => {
    const params = { skip: page * 20, limit: 20 };
    if (query.search) params.search = query.search;
    if (query.grade) params.grade = query.grade;
    if (query.active !== "") params.active = query.active === "true";

    try {
      const res = await API.get("/api/students/", { params });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) window.location = "/login";
    }
  }, [query, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

 return (
  <div className="student-container">
      <h3
      style={{
        fontSize: "34px",
        fontWeight: "700",
        letterSpacing: "3px",
        textAlign: "center",
        marginBottom: "25px",
        color: "#000",
        borderBottom: "2px solid #000",
        display: "inline-block",
        paddingBottom: "6px",
        textTransform: "uppercase"
      }}
    >
      Students
    </h3>

    <button
      className="logout-btn"
      onClick={() => {
        localStorage.clear();
        window.location = "/login";
      }}
    >
      Logout
    </button>

    <StudentFilters query={query} setQuery={setQuery} />

    <StudentForm
      onAdded={fetchStudents}
      studentToEdit={studentToEdit}
      onUpdated={() => {
        fetchStudents();
        setStudentToEdit(null);
      }}
      onCancel={() => setStudentToEdit(null)}
    />

    <ul className="student-list">
      {students.map((s) => (
        <li key={s.id} className="student-card">
          <span className="student-info">
            {s.name} • Grade {s.grade} • Age {s.age}
          </span>

          <div className="actions">
            <button
              className={s.active ? "active-btn" : "inactive-btn"}
              onClick={async () => {
                try {
                  const updated = await API.patch(`/api/students/${s.id}`, {
                    active: !s.active,
                  });
                  setStudents(
                    students.map((st) =>
                      st.id === s.id ? updated.data : st
                    )
                  );
                } catch (err) {
                  console.error("Failed to update status", err);
                  alert("You cannot change this student's status");
                }
              }}
            >
              {s.active ? "Active" : "Inactive"}
            </button>

            <button
              className="update-btn"
              onClick={() => setStudentToEdit(s)}
            >
              Update
            </button>

            <button
              className="delete-btn"
              onClick={async () => {
                if (window.confirm(`Delete ${s.name}?`)) {
                  try {
                    await API.delete(`/api/students/${s.id}`);
                    setStudents(students.filter((st) => st.id !== s.id));
                  } catch (err) {
                    alert("Failed to delete student");
                  }
                }
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>

    <div className="pagination">
      <button onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
      <span>Page {page + 1}</span>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  </div>
);
}

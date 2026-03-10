import './StudentList.css'

export default function StudentFilters({ query, setQuery }) {
  return (
    <div className="filter-container">
      <input
        className="filter-input"
        placeholder="Search name..."
        value={query.search}
        onChange={(e) =>
          setQuery({ ...query, search: e.target.value })
        }
      />

      <select
        className="filter-select"
        value={query.grade}
        onChange={(e) =>
          setQuery({ ...query, grade: e.target.value })
        }
      >
        <option value="">All grades</option>
        <option value="1">Grade 1</option>
        <option value="2">Grade 2</option>
        <option value="3">Grade 3</option>
      </select>

      <select
        className="filter-select"
        value={query.active}
        onChange={(e) =>
          setQuery({ ...query, active: e.target.value })
        }
      >
        <option value="">All</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  );
}
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Auth/Login";
import StudentList from "./components/Students/StudentList";
import TeacherList from "./components/Teachers/TeacherList";
import ClassList from "./components/Classes/ClassList";
import PrivateRoute from "./components/Auth/PrivateRoute";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import LiquidEther from "./components/LiquidEther/LiquidEther"; // adjust path
import "./App.css"; // for any global CSS

function App() {
  return (
    <BrowserRouter>
     <nav>
    <Link to="/">Home</Link><span className="separator">|</span>
    <Link to="/students">Students</Link><span className="separator">|</span>
    <Link to="/teachers">Teachers</Link><span className="separator">|</span>
    <Link to="/classes">Classes</Link>
  </nav>

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/students"
          element={<PrivateRoute><StudentList /></PrivateRoute>}
        />
        <Route
          path="/teachers"
          element={<PrivateRoute><TeacherList /></PrivateRoute>}
        />
        <Route
          path="/classes"
          element={<PrivateRoute><ClassList /></PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

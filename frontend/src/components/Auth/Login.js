import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./Login.css";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // OAuth2PasswordRequestForm expects form-encoded data
            const data = new URLSearchParams();
            data.append("username", form.username);
            data.append("password", form.password);
            data.append("grant_type", "password"); // optional, some setups require it

            const res = await API.post("/api/auth/token", data, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            // Save JWT token in localStorage
            localStorage.setItem("token", res.data.access_token);

            // Redirect to protected route
            navigate("/students");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Login failed");
        }
    };

    return (
  <div className="login-container">

    <div className="login-card">

      <h3 className="login-title">Login</h3>

      <form onSubmit={handleLogin} className="login-form">

        <input
          className="login-input"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className="login-button">
          Login
        </button>

      </form>

    </div>

  </div>
);
}

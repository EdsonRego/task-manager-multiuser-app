import React, { useState } from "react";
import type { User } from "../types/User";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<User[]>(`/users?email=${email}`);
      const user = res.data.find((u) => u.password === password);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
      } else {
        alert("User or password not registered.");
      }
    } catch (err) {
      console.error(err);
      alert("Error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container d-flex align-items-start justify-content-center"
      style={{
        background: "linear-gradient(180deg, #e3f2fd 0%, #f4f7fb 100%)",
        minHeight: "calc(100vh - 80px)", // ajusta considerando a altura da Navbar
        paddingTop: "40px", // 🔹 reduz espaço entre Navbar e o card
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "400px",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" height={70} className="mb-2" />
          <h2 className="text-primary fw-bold mb-1">
            Welcome to Task Manager
          </h2>
          <p className="text-muted small">
            Manage your tasks efficiently and effectively
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Max 6 characters"
            maxLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 fw-semibold"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Accessing..." : "Access"}
        </button>

        <div className="text-center mt-3">
          <button
            className="btn btn-link text-primary fw-semibold"
            onClick={() => navigate("/register")}
          >
            First access? Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

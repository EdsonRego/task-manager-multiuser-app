import React, { useState } from "react";
import type { User } from "../types/User";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const RegisterUser: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const existing = await api.get<User[]>(`/users?email=${email}`);
      if (existing.data.length === 0) {
        await api.post("/users", { firstName, lastName, email, password });
        alert("User registered successfully.");
        navigate("/");
      } else {
        alert("Email already exists. A new password will be sent via email.");
      }
    } catch (err) {
      console.error(err);
      alert("Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container d-flex align-items-start justify-content-center"
      style={{
        background: "linear-gradient(180deg, #e3f2fd 0%, #f4f7fb 100%)",
        minHeight: "calc(100vh - 80px)",
        paddingTop: "40px",
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
          <h2 className="text-primary fw-bold mb-1">User Registration</h2>
          <p className="text-muted small">Create your Task Manager account</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">First Name</label>
          <input
            className="form-control"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Last Name</label>
          <input
            className="form-control"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Save"}
        </button>

        <div className="text-center mt-3">
          <button
            className="btn btn-link text-primary fw-semibold"
            onClick={() => navigate("/")}
          >
            Already registered? Go to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;

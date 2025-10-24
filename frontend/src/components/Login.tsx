import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

/**
 * Tela de Login com persistência segura do token JWT.
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200 && response.data.token) {
        console.log("✅ Login bem-sucedido, token recebido:", response.data.token);

        // 🧠 Limpa antes de salvar (evita sobreposição de tokens antigos)
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 💾 Salva o token e o usuário de forma sincronizada
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // ⏳ Garante que o token foi gravado antes de navegar
        setTimeout(() => navigate("/dashboard"), 150);
      } else {
        setError("Invalid credentials.");
      }
    } catch (err: any) {
      console.error("❌ Erro no login:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.status === 404) {
        setError("User not found.");
      } else {
        setError("Login error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container d-flex align-items-start justify-content-center"
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
          <h2 className="text-primary fw-bold mb-1">Welcome to Task Manager</h2>
          <p className="text-muted small">
            Manage your tasks efficiently and effectively
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center small">{error}</div>
        )}

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
            placeholder="Enter your password"
            maxLength={20}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} // ENTER faz login
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

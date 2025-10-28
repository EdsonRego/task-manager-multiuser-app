import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AlertMessage from "./AlertMessage";
import ToastNotification from "./ToastNotification";
import { UI_CONFIG } from "../config/ui";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning" | "info"; message: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "danger" | "warning" | "info"; message: string; show: boolean }>({
    type: "info",
    message: "",
    show: false,
  });

  const navigate = useNavigate();

  /** 🔒 Impede acesso à tela de login se o usuário já estiver autenticado */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.trim() !== "" && token !== "undefined") {
      console.log("🔐 Usuário já autenticado, redirecionando para Dashboard...");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleAlert = (type: "success" | "danger" | "warning" | "info", message: string) => {
    if (UI_CONFIG.useAlertsFor.includes(type)) {
      setAlert({ type, message });
      setTimeout(() => setAlert(null), UI_CONFIG.autoHide.alert);
    } else if (UI_CONFIG.useToastsFor.includes(type)) {
      setToast({ type, message, show: true });
      setTimeout(() => setToast({ type, message, show: false }), UI_CONFIG.autoHide.toast);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      handleAlert("warning", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      console.log("📡 Enviando login request...");
      const res = await api.post("/auth/login", { email, password });

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token) {
        handleAlert("danger", "Invalid server response — no token received.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Login bem-sucedido, token recebido:", token);
      handleAlert("success", "Login successful! Redirecting...");

      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } catch (err: any) {
      console.error("❌ Erro no login:", err);
      handleAlert("danger", "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(180deg, #e3f2fd, #f4f7fb)" }}
    >
      <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">🔐 Task Manager Login</h2>

        {alert && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            First access?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={handleRegisterRedirect}
            >
              Register here
            </span>
          </small>
        </div>
      </div>

      <ToastNotification
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Login;

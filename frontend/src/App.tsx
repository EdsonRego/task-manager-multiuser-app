import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import TaskRegister from "./pages/TaskRegister";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/ui.css";

/** 🔐 Verifica expiração do JWT */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

/** 🧱 Layout Wrapper - controla Navbar/Footer */
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token && token !== "undefined" && token.trim() !== "";

  // 🔓 Rotas públicas que não devem exibir Navbar/Footer
  const isPublicPage = ["/", "/register"].includes(location.pathname);

  return (
    <>
      {/* 🔒 Navbar/Footer apenas em rotas privadas */}
      {!isPublicPage && (
        <>
          <NavigationBar isAuthenticated={isAuthenticated} />
          <div style={{ paddingBottom: "120px" }}>{children}</div>
          <Footer isAuthenticated={isAuthenticated} />
        </>
      )}

      {/* 🔓 Rotas públicas renderizam sem layout */}
      {isPublicPage && children}
    </>
  );
};

/** 🌟 Conteúdo principal do App (dentro do Router) */
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token && token !== "undefined" && token.trim() !== "";
  });

  // 🔄 Verifica token e sincroniza estado global
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined" || token.trim() === "") {
        setIsAuthenticated(false);
        return;
      }

      if (isTokenExpired(token)) {
        console.warn("⚠️ Token expirado — limpando sessão e redirecionando...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        navigate("/", { replace: true });
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, [navigate]);

  console.log(
    isAuthenticated
      ? "✅ App renderizado com rotas protegidas"
      : "🔓 App renderizado com rotas públicas"
  );

  return (
    <LayoutWrapper>
      <Routes>
        {/* 🌐 Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />

        {/* 🔒 Rotas privadas — protegidas por PrivateRoute */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/task-register" element={<PrivateRoute element={<TaskRegister />} />} />

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LayoutWrapper>
  );
};

/** 🚪 Fornece o Router no topo */
const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;

import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { BsPersonPlus, BsPencilSquare, BsClipboardData } from "react-icons/bs";

interface NavigationBarProps {
  isAuthenticated?: boolean;
}

/**
 * 🔝 NavigationBar
 * - Exibida apenas em rotas privadas (controlado pelo LayoutWrapper)
 * - Mantém design original com Bootstrap
 * - Gerencia logout e redirecionamento seguro
 */
const NavigationBar: React.FC<NavigationBarProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    console.log("🚪 Logout acionado — limpando sessão e redirecionando...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  /** 🎨 Estilo dinâmico dos links */
  const linkStyle = (isActive: boolean) =>
    `nav-link d-flex align-items-center gap-1 ${
      isActive ? "fw-bold text-warning" : "text-white"
    }`;

  /** 🔒 Bloqueia rotas não autenticadas */
  const disableLinks = !isAuthenticated;

  /** ⛔ Oculta completamente Navbar em rotas públicas */
  const isPublicPage = ["/", "/register"].includes(location.pathname);
  if (isPublicPage) return null;

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{ backgroundColor: "var(--primary)" }}
    >
      <Container>
        {/* 🔹 Brand */}
        <Navbar.Brand
          href="/dashboard"
          className="text-white fw-bold d-flex align-items-center gap-2"
          style={{ cursor: disableLinks ? "default" : "pointer" }}
          onClick={(e) => disableLinks && e.preventDefault()}
        >
          <img src="/logo.png" alt="Task Manager Logo" className="app-logo me-2" />
          Task Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0 bg-light" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          <Nav>
            {/* 🔹 Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) => linkStyle(isActive)}
              style={{ cursor: disableLinks ? "not-allowed" : "pointer" }}
              onClick={(e) => disableLinks && e.preventDefault()}
            >
              <BsClipboardData size={18} />
              Dashboard
            </NavLink>

            {/* 🔹 Task Register */}
            <NavLink
              to="/task-register"
              className={({ isActive }) => linkStyle(isActive)}
              style={{ cursor: disableLinks ? "not-allowed" : "pointer" }}
              onClick={(e) => disableLinks && e.preventDefault()}
            >
              <BsPencilSquare size={18} />
              Task Register
            </NavLink>

            {/* 🔹 User Register (somente se autenticado) */}
            {isAuthenticated && (
              <NavLink
                to="/register"
                className={({ isActive }) => linkStyle(isActive)}
                style={{ cursor: "pointer" }}
              >
                <BsPersonPlus size={18} />
                User Register
              </NavLink>
            )}
          </Nav>

          {/* 🔹 Logout Button */}
          {isAuthenticated && (
            <Nav>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light fw-semibold ms-3"
              >
                🚪 Logout
              </button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

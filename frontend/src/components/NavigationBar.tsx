// frontend/src/components/NavigationBar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { BsPersonPlus, BsPencilSquare, BsClipboardData, BsSearch } from "react-icons/bs";

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{ backgroundColor: "var(--primary)" }}
    >
      <Container>
        {/* Logo + título */}
        <Navbar.Brand
          href="/"
          className="text-white fw-bold d-flex align-items-center gap-2"
        >
          <img src="/logo.png" alt="Task Manager Logo" className="app-logo me-2" />
          Task Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0 bg-light" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          {/* Links à esquerda */}
          <Nav>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${
                  isActive ? "fw-bold text-warning" : "text-white"
                }`
              }
            >
              🔑 Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${
                  isActive ? "fw-bold text-warning" : "text-white"
                }`
              }
            >
              <BsPersonPlus size={18} />
              User Register
            </NavLink>

            <NavLink
              to="/task-register"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${
                  isActive ? "fw-bold text-warning" : "text-white"
                }`
              }
            >
              <BsPencilSquare size={18} />
              Task Register
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${
                  isActive ? "fw-bold text-warning" : "text-white"
                }`
              }
            >
              <BsClipboardData size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/task-search"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-1 ${
                  isActive ? "fw-bold text-warning" : "text-white"
                }`
              }
            >
              <BsSearch size={18} />
              Task Search
            </NavLink>
          </Nav>

          {/* Botão Logout à direita */}
          <Nav>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light fw-semibold ms-3"
            >
              🚪 Logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

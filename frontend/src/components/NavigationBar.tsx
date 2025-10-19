import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

const NavigationBar: React.FC = () => {
  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{ backgroundColor: "var(--primary)" }}
    >
      <Container>
        <Navbar.Brand href="/" className="text-white fw-bold d-flex align-items-center gap-2">
          <img
            src="/logo.png"
            alt="Task Manager Logo"
            className="app-logo me-3"
          />
          Task Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0 bg-light" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? "fw-bold text-warning" : "text-white"}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `nav-link ${isActive ? "fw-bold text-warning" : "text-white"}`
              }
            >
              Register
            </NavLink>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `nav-link ${isActive ? "fw-bold text-warning" : "text-white"}`
              }
            >
              Home
            </NavLink>
          </Nav>
          <NavLink
            to="/"
            onClick={() => {
              localStorage.removeItem("user");
            }}
            className="btn btn-outline-light ms-3 fw-semibold"
          >
            Logout
          </NavLink>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

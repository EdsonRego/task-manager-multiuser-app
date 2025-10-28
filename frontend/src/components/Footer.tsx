import React from "react";
import { Container } from "react-bootstrap";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface FooterProps {
  isAuthenticated?: boolean;
}

/**
 * 🔹 Footer — permanece ativo mesmo sem autenticação,
 * mas integra com o LayoutWrapper para controle visual uniforme.
 */
const Footer: React.FC<FooterProps> = () => {
  return (
    <footer
      className="footer mt-auto py-2 text-center text-white"
      style={{
        backgroundColor: "#084b8a",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        height: "85px",
      }}
    >
      <Container>
        <div className="d-flex justify-content-center align-items-center gap-4">
          <a
            href="https://www.linkedin.com/in/edson-rego-1b086216a/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon linkedin"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/EdsonRego"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon github"
          >
            <FaGithub />
          </a>
        </div>

        <div className="mt-2 small text-white-50">
          © {new Date().getFullYear()} Edson Gomes do Rego — Task Manager App
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protege rotas autenticadas.
 * Verifica se há um token JWT no localStorage antes de renderizar o conteúdo.
 */
interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token.trim() === "") {
    console.warn("🔒 Acesso bloqueado — token ausente ou inválido, redirecionando para login.");
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;

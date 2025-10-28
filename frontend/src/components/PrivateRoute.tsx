import React from "react";
import { Navigate } from "react-router-dom";

/**
 * 🔒 PrivateRoute
 * Bloqueia acesso a rotas privadas sem token válido.
 */
interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token && token !== "undefined" && token.trim() !== "";

  if (!isAuthenticated) {
    console.warn("🚫 Acesso negado — usuário não autenticado.");
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;

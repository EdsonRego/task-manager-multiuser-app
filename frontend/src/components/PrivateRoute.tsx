import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Componente para proteger rotas que exigem autenticação.
 *
 * - Verifica se existe um token JWT salvo no localStorage.
 * - Caso o token não exista, redireciona o usuário para o login.
 */
interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🔒 Se não estiver autenticado, volta para a tela de login
    return <Navigate to="/" replace />;
  }

  // ✅ Se estiver autenticado, renderiza o componente
  return children;
};

export default PrivateRoute;

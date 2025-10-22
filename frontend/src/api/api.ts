import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * Configuração global da API Axios
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🔑 Interceptador de requisições
 * Adiciona o token JWT ao header Authorization
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🚨 Interceptador de respostas
 * - Redireciona para /login se o token estiver expirado ou inválido
 * - Remove o token inválido do localStorage
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado ou inválido. Redirecionando para login...");

      // Limpa dados do usuário
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redireciona para login (sem recarregar a página)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

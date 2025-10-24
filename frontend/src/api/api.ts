import axios from "axios";

/**
 * 🌐 Configuração global da API Axios
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * 🔑 Interceptador de requisições
 *  - Adiciona automaticamente o token JWT (se existir)
 *  - Loga cada requisição para rastrear o fluxo de autenticação
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.groupCollapsed("📡 Nova requisição Axios");
    console.log("➡️ URL:", config.url);
    console.log("➡️ Método:", config.method?.toUpperCase());
    console.log("➡️ Token presente no localStorage:", token ? "✅ SIM" : "❌ NÃO");
    console.groupEnd();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Nenhum token no localStorage no momento da requisição:", config.method, config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🚨 Interceptador de respostas
 *  - Ignora erros de pré-flight (OPTIONS)
 *  - Evita loop com /error
 *  - Faz logout automático quando o token expira
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url || "";

    // Ignorar erros de pré-flight ou /error
    if (method === "OPTIONS" || url.includes("/error")) {
      console.log("⚙️ Ignorando erro de pré-flight ou /error:", status, url);
      return Promise.reject(error);
    }

    if (status >= 500) {
      console.error("💥 Erro interno do servidor:", error.response?.data);
    } else if (status === 403) {
      console.error("🚫 Acesso negado: token ausente ou sem permissão.");
    } else if (status === 401) {
      console.warn("⚠️ Sessão expirada ou token inválido. Limpando sessão e redirecionando...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/";
      }
    }


    return Promise.reject(error);
  }
);

export default api;

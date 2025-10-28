// frontend/src/api/api.ts
import axios from "axios";

/**
* 🌐 Configuração global da API Axios
*/
const api = axios.create({
baseURL: "http://localhost:8080/api",
withCredentials: false,
headers: { "Content-Type": "application/json" },
});

/**
* 🔑 Interceptador de requisições
*  - Adiciona automaticamente o token JWT (se existir e for válido)
*  - Loga cada requisição
*/
api.interceptors.request.use(
(config) => {
const token = localStorage.getItem("token");

console.groupCollapsed("📡 Nova requisição Axios");
console.log("➡️ URL:", config.url);
console.log("➡️ Método:", config.method?.toUpperCase());
console.log("➡️ Token presente no localStorage:", token ? "✅ SIM" : "❌ NÃO");
console.groupEnd();

// ✅ Só adiciona o Authorization se o token for realmente válido
    if (
token &&
token !== "null" &&
token !== "undefined" &&
token.trim() !== ""
) {
config.headers = {
...config.headers,
Authorization: `Bearer ${token}`,
};
}

return config;
},
(error) => Promise.reject(error)
);

/**
* 🚨 Interceptador de respostas
*  - Ignora erros de pré-flight (OPTIONS)
*  - Mostra logs detalhados
*  - Redireciona para login apenas se o token for inválido/expirado
*/
api.interceptors.response.use(
(response) => response,
(error) => {
const status = error.response?.status;
const method = error.config?.method?.toUpperCase();
const url = error.config?.url || "";

// Ignora pré-flight e rota de erro
    if (method === "OPTIONS" || url.includes("/error")) {
return Promise.reject(error);
}

if (status >= 500) {
console.error("💥 Erro interno do servidor:", error.response?.data);
} else if (status === 403) {
console.warn("🚫 Acesso negado: sem permissão ou recurso bloqueado.");
} else if (status === 401) {
const msg = error.response?.data?.message?.toLowerCase() || "";

const isAuthError =
msg.includes("token") ||
msg.includes("expired") ||
msg.includes("unauthorized") ||
url.includes("/auth");

if (isAuthError) {
console.warn(
"⚠️ Token expirado ou inválido. Limpando sessão e redirecionando..."
);
localStorage.removeItem("token");
localStorage.removeItem("user");
if (!window.location.pathname.includes("/login")) {
window.location.href = "/";
}
} else {
console.warn("⚠️ Erro 401 não relacionado à autenticação:", url);
}
} else if (status >= 400) {
console.warn(`⚠️ Erro de requisição (${status}):`, error.response?.data);
}

return Promise.reject(error);
}
);

export default api;

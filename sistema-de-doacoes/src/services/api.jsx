import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://sistemadedoacoesback.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para injetar o token JWT salvo no localStorage
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("@DoacoesFMP:token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para redirecionar se o token expirar ou for inválido (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("@DoacoesFMP:token");
      localStorage.removeItem("@DoacoesFMP:usuario");
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/registrar")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // lê o token salvo, para o login sobreviver ao F5
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  function login(novoToken) {
    localStorage.setItem("token", novoToken);
    setToken(novoToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, logado: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
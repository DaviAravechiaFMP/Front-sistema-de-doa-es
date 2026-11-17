import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function lerUsuarioSalvo() {
  try {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // lê o que foi salvo, para o login sobreviver ao F5
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(lerUsuarioSalvo);

  function login(novoToken, novoUsuario) {
    localStorage.setItem("token", novoToken);
    localStorage.setItem("usuario", JSON.stringify(novoUsuario));
    setToken(novoToken);
    setUsuario(novoUsuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, usuario, logado: Boolean(token), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
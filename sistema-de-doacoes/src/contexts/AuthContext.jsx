/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function lerUsuarioSalvo() {
  try {
    const salvo =
      localStorage.getItem("@DoacoesFMP:usuario") ||
      localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  } catch {
    return null;
  }
}

function lerTokenSalvo() {
  return (
    localStorage.getItem("@DoacoesFMP:token") ||
    localStorage.getItem("token") ||
    null
  );
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(lerTokenSalvo);
  const [usuario, setUsuario] = useState(lerUsuarioSalvo);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega o perfil completo do aluno (incluindo matrícula, curso e saldo_horas)
  const carregarPerfil = useCallback(async (tokenEspecifico) => {
    const tokenAtivo = tokenEspecifico || token || lerTokenSalvo();
    if (!tokenAtivo) return null;

    try {
      const resposta = await api.get("/api/auth/perfil", {
        headers: { Authorization: `Bearer ${tokenAtivo}` },
      });
      setPerfil(resposta.data);
      return resposta.data;
    } catch (erro) {
      console.error("Erro ao carregar perfil do aluno:", erro);
      return null;
    }
  }, [token]);

  // Restaura a sessão ao iniciar a aplicação
  useEffect(() => {
    async function restaurarSessao() {
      const tokenSalvo = lerTokenSalvo();
      const usuarioSalvo = lerUsuarioSalvo();

      if (tokenSalvo && usuarioSalvo) {
        setToken(tokenSalvo);
        setUsuario(usuarioSalvo);
        await carregarPerfil(tokenSalvo);
      }
      setCarregando(false);
    }

    restaurarSessao();
  }, [carregarPerfil]);

  function salvarSessao(novoToken, dadosUsuario) {
    localStorage.setItem("@DoacoesFMP:token", novoToken);
    localStorage.setItem("token", novoToken);
    localStorage.setItem("@DoacoesFMP:usuario", JSON.stringify(dadosUsuario));
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));

    setToken(novoToken);
    setUsuario(dadosUsuario);
  }

  function limparSessao() {
    localStorage.removeItem("@DoacoesFMP:token");
    localStorage.removeItem("token");
    localStorage.removeItem("@DoacoesFMP:usuario");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);
    setPerfil(null);
  }

  const logout = useCallback(() => {
    limparSessao();
  }, []);

  /**
   * Autenticação via POST /api/auth/login
   * Também suporta sobrecarga legada login(token, usuario)
   */
  async function login(credencialOuToken, senhaOuUsuario) {
    if (typeof credencialOuToken === "string" && typeof senhaOuUsuario === "string") {
      try {
        const resposta = await api.post("/api/auth/login", {
          email: credencialOuToken,
          senha: senhaOuUsuario,
        });
        const { token: novoToken, usuario: dadosUsuario } = resposta.data;

        salvarSessao(novoToken, dadosUsuario);
        await carregarPerfil(novoToken);

        return { sucesso: true, token: novoToken, usuario: dadosUsuario };
      } catch (erro) {
        const mensagem =
          erro.response?.data?.mensagem || "Não foi possível efetuar o login.";
        return {
          sucesso: false,
          mensagem,
          tentativas_restantes: erro.response?.data?.tentativas_restantes,
          status: erro.response?.status,
        };
      }
    } else {
      // Assinatura legada: login(token, usuario)
      salvarSessao(credencialOuToken, senhaOuUsuario);
      await carregarPerfil(credencialOuToken);
      return { sucesso: true };
    }
  }

  /**
   * Cadastro de usuário via POST /api/auth/registrar
   * Após cadastro com sucesso, realiza login automático para já obter o token JWT
   */
  async function cadastrar({ nome, cpf, email, senha }) {
    try {
      const resposta = await api.post("/api/auth/registrar", {
        nome: nome.trim(),
        cpf: cpf ? cpf.trim() : null,
        email: email.trim(),
        senha,
      });

      // Efetua login automático
      const loginRes = await login(email, senha);

      return {
        sucesso: true,
        mensagem: resposta.data?.mensagem || "Cadastro realizado com sucesso!",
        usuario: resposta.data?.usuario,
        autoLogin: loginRes.sucesso,
      };
    } catch (erro) {
      const mensagem =
        erro.response?.data?.mensagem || "Erro ao registrar usuário.";
      const erros = erro.response?.data?.erros || [];
      return {
        sucesso: false,
        mensagem,
        erros,
        status: erro.response?.status,
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        perfil,
        carregarPerfil,
        logado: Boolean(token),
        autenticado: Boolean(token),
        carregando,
        login,
        cadastrar,
        registrar: cadastrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}

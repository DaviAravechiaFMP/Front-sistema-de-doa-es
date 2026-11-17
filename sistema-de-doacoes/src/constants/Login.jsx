import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login, logado } = useAuth();
  const navigate = useNavigate();

  // Redireciona para /home caso já esteja autenticado
  useEffect(() => {
    if (logado) {
      navigate("/home", { replace: true });
    }
  }, [logado, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resultado = await login(email, senha);
      if (resultado.sucesso) {
        navigate("/home");
      } else {
        let msg = resultado.mensagem;
        if (resultado.tentativas_restantes !== undefined) {
          msg += ` (Tentativas restantes: ${resultado.tentativas_restantes})`;
        }
        setErro(msg);
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pagina-centro">
      <div className="card-form">
        <h1>Login</h1>
        <form className="formulario" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@aluno.fmpsc.edu.br"
            required
          />

          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {erro && <p className="erro">{erro}</p>}

          <button className="botao" type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <p style={{ marginTop: "1.2rem", textAlign: "center", fontSize: "1.5vh" }}>
            Não possui uma conta?{" "}
            <Link to="/registrar" className="link">
              Cadastre-se aqui
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

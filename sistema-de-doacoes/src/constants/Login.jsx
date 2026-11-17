import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const resp = await api.post("/api/auth/login", { email, senha });
      const { token, usuario } = resp.data;

      login(token, usuario);
      navigate("/home");
    } catch (err) {
      if (err.response) {
        // a API respondeu com erro (400, 401, 403...)
        setErro(err.response.data?.mensagem || "Não foi possível fazer login");
      } else {
        // a API nem respondeu (fora do ar, URL errada, CORS)
        setErro("Não foi possível conectar ao servidor");
      }
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
            required
          />

          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p className="erro">{erro}</p>}

          <button className="botao" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
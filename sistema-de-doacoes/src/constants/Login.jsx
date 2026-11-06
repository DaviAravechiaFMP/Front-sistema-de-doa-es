import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
    const resp = await fetch(
      `http://localhost:3000/users?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
    );
    const usuarios = await resp.json();

    if (usuarios.length === 0) {
      setErro("Email ou senha inválidos");
      return;
    }

    // o json-server não gera token, então guardamos o id do usuário
    login(String(usuarios[0].id));
    navigate("/");
  } catch (err) {
    setErro("Não foi possível conectar ao servidor");
  }
}
  return (
    <div className="pagina-centro">
        <div className="card-form">
            <h1>Login</h1>
            <form className="formulario" onSubmit={handleSubmit}>
                <form onSubmit={handleSubmit}>
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

                    {erro && <p style={{ color: "red" }}>{erro}</p>}

                    <button type="submit">Entrar</button>
                </form>
            {erro && <p className="erro">{erro}</p>}
            <button className="botao" type="submit">Entrar</button>
            </form>
        </div>
    </div>
  );
}
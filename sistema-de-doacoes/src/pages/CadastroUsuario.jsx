import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [errosLista, setErrosLista] = useState([]);
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { cadastrar, logado } = useAuth();
  const navigate = useNavigate();

  // Se já estiver logado, redireciona para a Home
  useEffect(() => {
    if (logado) {
      navigate("/home", { replace: true });
    }
  }, [logado, navigate]);

  function aplicarMascaraCpf(valor) {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
    if (apenasNumeros.length <= 3) return apenasNumeros;
    if (apenasNumeros.length <= 6)
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    if (apenasNumeros.length <= 9)
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setErrosLista([]);
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      const res = await cadastrar({
        nome,
        cpf: cpf.trim() ? cpf.trim() : null,
        email,
        senha,
      });

      if (res.sucesso) {
        setSucesso("Conta cadastrada com sucesso! Redirecionando para o painel...");
        setTimeout(() => {
          navigate("/home");
        }, 1200);
      } else {
        setErro(res.mensagem || "Não foi possível cadastrar a conta.");
        if (res.erros && Array.isArray(res.erros)) {
          setErrosLista(res.erros);
        }
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-centro">
      <div className="card-form">
        <h1>Criar Conta</h1>
        <form className="formulario" onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome Completo:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Mariana Souza"
            required
            minLength={2}
            maxLength={100}
          />

          <label htmlFor="cpf">CPF (opcional):</label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(aplicarMascaraCpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
          />

          <label htmlFor="email">E-mail Acadêmico:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mariana@aluno.fmpsc.edu.br"
            required
          />

          <label htmlFor="senha">Senha (mínimo 6 caracteres):</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite uma senha forte"
            required
            minLength={6}
          />

          <label htmlFor="confirmarSenha">Confirmar Senha:</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Repita sua senha"
            required
            minLength={6}
          />

          {sucesso && (
            <p
              style={{
                color: "#155724",
                backgroundColor: "#d4edda",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "1.4vh",
                margin: 0,
              }}
            >
              {sucesso}
            </p>
          )}

          {erro && <p className="erro">{erro}</p>}

          {errosLista.length > 0 && (
            <ul
              style={{
                color: "#c0392b",
                margin: 0,
                paddingLeft: "1.2rem",
                fontSize: "1.3vh",
              }}
            >
              {errosLista.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}

          <button className="botao" type="submit" disabled={enviando}>
            {enviando ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p style={{ marginTop: "1.2rem", textAlign: "center", fontSize: "1.5vh" }}>
            Já possui uma conta?{" "}
            <Link to="/login" className="link">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

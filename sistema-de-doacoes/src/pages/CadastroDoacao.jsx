import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

// data de hoje no fuso local (toISOString usaria UTC e viraria o dia à noite)
function hojeLocal() {
  const agora = new Date();
  return new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function CadastroDoacao() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [campanhaId, setCampanhaId] = useState("1");
  const [data, setData] = useState(hojeLocal());
  const [localEntrega, setLocalEntrega] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!usuario) {
      setErro("Sessão inválida. Faça login novamente.");
      return;
    }

    setEnviando(true);
    try {
      await api.post("/api/doacoes", {
        aluno_id: usuario.id,
        campanha_id: Number(campanhaId),
        data,
        status: "Pendente",
        local_entrega: localEntrega,
      });

      navigate("/doacoes");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (err.response) {
        setErro(err.response.data?.mensagem || "Erro ao salvar a doação");
      } else {
        setErro("Não foi possível conectar ao servidor");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-centro">
      <div className="card-form">
        <h1>Cadastrar doação</h1>

        <form className="formulario" onSubmit={handleSubmit}>
          <label htmlFor="campanha">Campanha:</label>
          <select
            id="campanha"
            value={campanhaId}
            onChange={(e) => setCampanhaId(e.target.value)}
          >
            <option value="1">Campanha de Inverno 2026</option>
            <option value="2">SOS Enchentes RS</option>
          </select>

          <label htmlFor="data">Data:</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <label htmlFor="local">Local de entrega:</label>
          <input
            id="local"
            value={localEntrega}
            onChange={(e) => setLocalEntrega(e.target.value)}
            placeholder="Ex.: Recepção Principal FMP"
            maxLength={150}
            required
          />

          {erro && <p className="erro">{erro}</p>}

          <button className="botao" type="submit" disabled={enviando}>
            {enviando ? "Salvando..." : "Cadastrar"}
          </button>
          <Link className="link" to="/home">Cancelar</Link>
        </form>
      </div>
    </div>
  );
}
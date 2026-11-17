import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

function hojeLocal() {
  const agora = new Date();
  return new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function CadastroDoacao() {
  const { usuario, perfil, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [campanhas, setCampanhas] = useState([]);
  const [campanhaId, setCampanhaId] = useState(searchParams.get("campanha") || "");
  const [data, setData] = useState(hojeLocal());
  const [localEntrega, setLocalEntrega] = useState("Recepção Principal FMP");
  const [erro, setErro] = useState("");
  const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Busca lista real de campanhas da API
  useEffect(() => {
    async function carregarCampanhas() {
      try {
        const resp = await api.get("/api/campanhas");
        setCampanhas(resp.data || []);
        // Se a URL passou parâmetro de campanha, seleciona ela; caso contrário, seleciona a primeira ativa se houver
        const paramCampanha = searchParams.get("campanha");
        if (paramCampanha) {
          setCampanhaId(paramCampanha);
        } else if (resp.data?.length > 0) {
          setCampanhaId(String(resp.data[0].id));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        console.error("Erro ao carregar campanhas:", err);
      } finally {
        setCarregandoCampanhas(false);
      }
    }

    carregarCampanhas();
  }, [searchParams, logout, navigate]);

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
        campanha_id: campanhaId ? Number(campanhaId) : null,
        data,
        status: "Pendente",
        local_entrega: localEntrega.trim(),
      });

      navigate("/doacoes");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (err.response) {
        setErro(err.response.data?.mensagem || "Erro ao salvar a doação.");
      } else {
        setErro("Não foi possível conectar ao servidor.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-centro">
      <div className="card-form">
        <h1>Cadastrar Doação</h1>

        <div style={{ marginBottom: "15px", fontSize: "1.4vh", color: "var(--cinza)" }}>
          <p style={{ margin: "2px 0" }}>
            Doador: <strong>{perfil?.nome || usuario?.nome}</strong>
          </p>
          {perfil?.matricula && (
            <p style={{ margin: "2px 0" }}>
              Matrícula: <strong>{perfil.matricula}</strong> | Saldo atual:{" "}
              <strong>{perfil?.saldo_horas || "0.00"}h</strong>
            </p>
          )}
        </div>

        <form className="formulario" onSubmit={handleSubmit}>
          <label htmlFor="campanha">Campanha Institucional:</label>
          <select
            id="campanha"
            value={campanhaId}
            onChange={(e) => setCampanhaId(e.target.value)}
            disabled={carregandoCampanhas}
          >
            <option value="">Geral (Sem campanha específica)</option>
            {campanhas.map((campanha) => (
              <option key={campanha.id} value={campanha.id}>
                {campanha.titulo} ({campanha.status})
              </option>
            ))}
          </select>

          <label htmlFor="data">Data da Doação:</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <label htmlFor="local">Local de Entrega na FMP:</label>
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
            {enviando ? "Salvando doação..." : "Registrar Doação"}
          </button>
          <Link className="link" to="/home" style={{ textAlign: "center", marginTop: "10px" }}>
            Cancelar e voltar
          </Link>
        </form>
      </div>
    </div>
  );
}

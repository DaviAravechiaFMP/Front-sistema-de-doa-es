import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function ListaCampanhas() {
  const [campanhas, setCampanhas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const { perfil, usuario, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarCampanhas() {
      setCarregando(true);
      setErro("");
      try {
        const resp = await api.get("/api/campanhas");
        setCampanhas(resp.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        if (err.response) {
          setErro(err.response.data?.mensagem || "Erro ao carregar campanhas.");
        } else {
          setErro("Não foi possível conectar ao servidor.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarCampanhas();
  }, [logout, navigate]);

  return (
    <div className="pagina">
      <div className="pagina-topo">
        <div>
          <h1>Campanhas Institucionais — FMP</h1>
          <p style={{ margin: "5px 0 0", fontSize: "1.5vh", color: "var(--cinza)" }}>
            Aluno: <strong>{perfil?.nome || usuario?.nome}</strong> | Saldo:{" "}
            <strong>{perfil?.saldo_horas || "0.00"}h</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link className="link" to="/home">
            &larr; Voltar ao Início
          </Link>
          <Link className="botao" to="/doacoes/nova" style={{ margin: 0 }}>
            + Cadastrar Doação
          </Link>
        </div>
      </div>

      {carregando && <p>Carregando campanhas do PostgreSQL...</p>}
      {erro && <p style={{ color: "#c0392b" }}>{erro}</p>}

      {!carregando && !erro && (
        <>
          {campanhas.length === 0 ? (
            <p>Nenhuma campanha cadastrada no momento.</p>
          ) : (
            <div className="grid-campanhas">
              {campanhas.map((campanha) => (
                <div key={campanha.id} className="card-campanha">
                  <div className="card-campanha-topo">
                    <h4>{campanha.titulo}</h4>
                    <span
                      className={`selo ${
                        campanha.status === "Ativa" ? "selo-aprovada" : "selo-pendente"
                      }`}
                    >
                      {campanha.status}
                    </span>
                  </div>
                  <p className="campanha-descricao">{campanha.descricao}</p>
                  <div className="campanha-info">
                    <p>
                      <strong>Regra de conversão:</strong>{" "}
                      {campanha.regras_conversao || "Conforme edital"}
                    </p>
                    <p>
                      <strong>Limite de horas:</strong>{" "}
                      {campanha.limite_horas ? `${campanha.limite_horas}h` : "Sem limite fixo"}
                    </p>
                    <p>
                      <strong>Prazo limite:</strong>{" "}
                      {campanha.data_limite
                        ? new Date(campanha.data_limite).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })
                        : "Indeterminado"}
                    </p>
                  </div>
                  <Link
                    to={`/doacoes/nova?campanha=${campanha.id}`}
                    className="botao botao-campanha"
                  >
                    Doar para esta campanha
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

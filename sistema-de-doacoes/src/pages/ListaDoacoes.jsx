import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function ListaDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const { usuario, perfil, logout } = useAuth();
  const navigate = useNavigate();

  async function carregarDoacoes() {
    setCarregando(true);
    setErro("");
    try {
      const resp = await api.get("/api/doacoes");
      setDoacoes(resp.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (err.response) {
        setErro(err.response.data?.mensagem || "Erro ao carregar as doações.");
      } else {
        setErro("Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    async function buscarInicial() {
      setErro("");
      try {
        const resp = await api.get("/api/doacoes");
        if (ativo) {
          setDoacoes(resp.data || []);
        }
      } catch (err) {
        if (!ativo) return;
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        if (err.response) {
          setErro(err.response.data?.mensagem || "Erro ao carregar as doações.");
        } else {
          setErro("Não foi possível conectar ao servidor.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    buscarInicial();

    return () => {
      ativo = false;
    };
  }, [logout, navigate]);

  const doacoesFiltradas = doacoes.filter((d) => {
    if (filtroStatus === "todos") return true;
    return d.status.toLowerCase() === filtroStatus.toLowerCase();
  });

  return (
    <div className="pagina">
      <div className="pagina-topo">
        <div>
          <h1>Gestão de Doações — FMP</h1>
          <p style={{ margin: "5px 0 0", fontSize: "1.5vh", color: "var(--cinza)" }}>
            Aluno: <strong>{perfil?.nome || usuario?.nome}</strong>
            {perfil?.matricula && (
              <span> | Matrícula: <strong>{perfil.matricula}</strong></span>
            )}
            {perfil?.curso && (
              <span> | Curso: <strong>{perfil.curso}</strong></span>
            )}
            <span>
              {" "}
              | Saldo de Horas:{" "}
              <strong style={{ color: "var(--azul)" }}>
                {perfil?.saldo_horas || "0.00"}h
              </strong>
            </span>
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link className="link" to="/home">
            &larr; Voltar ao Início
          </Link>
          <Link className="botao" to="/doacoes/nova" style={{ margin: 0 }}>
            + Nova Doação
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "1.4vh", color: "var(--cinza)" }}>
            Filtrar status:
          </span>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid var(--borda)",
              fontSize: "1.4vh",
              color: "var(--azul)",
            }}
          >
            <option value="todos">Todos ({doacoes.length})</option>
            <option value="pendente">
              Pendentes ({doacoes.filter((d) => d.status === "Pendente").length})
            </option>
            <option value="aprovada">
              Aprovadas ({doacoes.filter((d) => d.status === "Aprovada").length})
            </option>
            <option value="reprovada">
              Reprovadas ({doacoes.filter((d) => d.status === "Reprovada").length})
            </option>
          </select>
        </div>

        <button
          onClick={carregarDoacoes}
          style={{
            background: "none",
            border: "1px solid var(--borda)",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1.4vh",
            color: "var(--azul)",
          }}
        >
          Atualizar Lista
        </button>
      </div>

      {carregando && <p>Carregando doações do PostgreSQL...</p>}
      {erro && <p style={{ color: "#c0392b" }}>{erro}</p>}

      {!carregando && !erro && (
        <>
          {doacoesFiltradas.length === 0 ? (
            <div
              style={{
                backgroundColor: "var(--branco)",
                padding: "40px",
                borderRadius: "var(--raio)",
                textAlign: "center",
                border: "1px solid var(--borda)",
              }}
            >
              <p style={{ margin: 0, color: "var(--cinza)" }}>
                Nenhuma doação encontrada para os critérios selecionados.
              </p>
            </div>
          ) : (
            <div className="tabela-wrap">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Doador</th>
                    <th>Campanha</th>
                    <th>Data</th>
                    <th>Local de Entrega</th>
                    <th>Status</th>
                    <th>Horas Concedidas</th>
                  </tr>
                </thead>
                <tbody>
                  {doacoesFiltradas.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>
                        <strong>{item.doador}</strong>
                      </td>
                      <td>{item.campanha || "Geral (Sem campanha)"}</td>
                      <td>
                        {new Date(item.data).toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                        })}
                      </td>
                      <td>{item.local_entrega}</td>
                      <td>
                        <span className={`selo selo-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.horas_concedidas ? (
                          <strong style={{ color: "#1d6b3a" }}>
                            +{Number(item.horas_concedidas).toFixed(1)}h
                          </strong>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

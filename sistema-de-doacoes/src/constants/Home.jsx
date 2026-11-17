import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Home() {
  const { usuario, perfil, carregarPerfil, logout } = useAuth();
  const navigate = useNavigate();

  const [resumo, setResumo] = useState({ total: 0, pendentes: 0, aprovadas: 0 });
  const [campanhas, setCampanhas] = useState([]);
  const [ultimasDoacoes, setUltimasDoacoes] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      setCarregandoDados(true);
      setErro("");

      try {
        // Carrega dados em paralelo: doações e campanhas
        const [respDoacoes, respCampanhas] = await Promise.all([
          api.get("/api/doacoes"),
          api.get("/api/campanhas"),
        ]);

        const doacoes = respDoacoes.data || [];
        const listaCampanhas = respCampanhas.data || [];

        setResumo({
          total: doacoes.length,
          pendentes: doacoes.filter((d) => d.status === "Pendente").length,
          aprovadas: doacoes.filter((d) => d.status === "Aprovada").length,
        });

        setCampanhas(listaCampanhas);
        setUltimasDoacoes(doacoes.slice(-5).reverse());

        // Atualiza perfil se necessário
        await carregarPerfil();
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        setErro("Não foi possível carregar alguns dados da API.");
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, [carregarPerfil, logout, navigate]);

  function handleSair(e) {
    e.preventDefault();
    logout();
    navigate("/login");
  }

  const saldoFormatado = perfil?.saldo_horas
    ? `${Number(perfil.saldo_horas).toFixed(1)}h`
    : "0.0h";

  return (
    <div id="app-root">
      <aside>
        <h1>Doações FMP</h1>
        <div id="asideInteract">
          <ul>
            <li>
              <Link to="/home">Início</Link>
            </li>
            <li>
              <Link to="/campanhas">Campanhas</Link>
            </li>
            <li>
              <Link to="/doacoes">Ver doações</Link>
            </li>
            <li>
              <Link to="/doacoes/nova">Cadastrar doação</Link>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#" onClick={handleSair}>
                Sair
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <header>
        <div>
          <h2>Painel do Aluno — Sistema de Doações FMP</h2>
          <p className="subtitulo-header">
            Aluno: <strong>{perfil?.nome || usuario?.nome || "Carregando..."}</strong>
            {perfil?.matricula && (
              <span> | Matrícula: <strong>{perfil.matricula}</strong></span>
            )}
            {perfil?.curso && (
              <span> | Curso: <strong>{perfil.curso}</strong></span>
            )}
          </p>
        </div>
        <div className="badge-saldo">
          <small>Saldo de Horas (Perfil):</small>
          <strong>{saldoFormatado}</strong>
        </div>
      </header>

      <div className="conteudo-principal">
        {erro && <p className="erro" style={{ margin: "20px 30px 0" }}>{erro}</p>}

        {/* Cards de Métricas */}
        <div className="container">
          <div className="card">
            <h1>TOTAL DE DOAÇÕES</h1>
            <p>{resumo.total}</p>
          </div>
          <div className="card">
            <h1>DOAÇÕES PENDENTES</h1>
            <p>{resumo.pendentes}</p>
          </div>
          <div className="card">
            <h1>SALDO DE HORAS COMPLEMENTARES</h1>
            <p>{saldoFormatado}</p>
          </div>
        </div>

        {/* Seção: Campanhas Institucionais (GET /api/campanhas com .map()) */}
        <div className="secao-dashboard">
          <div className="secao-topo">
            <h3>Campanhas Institucionais Disponíveis</h3>
            <Link to="/campanhas" className="link">
              Ver todas as campanhas &rarr;
            </Link>
          </div>

          {carregandoDados ? (
            <p>Carregando campanhas do PostgreSQL...</p>
          ) : campanhas.length === 0 ? (
            <p>Nenhuma campanha ativa no momento.</p>
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
                      <strong>Regra:</strong> {campanha.regras_conversao || "Conforme edital"}
                    </p>
                    <p>
                      <strong>Limite:</strong> {campanha.limite_horas ? `${campanha.limite_horas}h` : "—"}
                    </p>
                    <p>
                      <strong>Prazo:</strong>{" "}
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
        </div>

        {/* Seção: Últimas Doações Registradas (.map()) */}
        <div className="secao-dashboard" style={{ marginTop: "30px", marginBottom: "40px" }}>
          <div className="secao-topo">
            <h3>Últimas Doações no Sistema</h3>
            <Link to="/doacoes" className="link">
              Ver histórico completo &rarr;
            </Link>
          </div>

          {ultimasDoacoes.length === 0 ? (
            <p>Nenhuma doação registrada ainda.</p>
          ) : (
            <div className="tabela-wrap">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Doador</th>
                    <th>Campanha</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Horas</th>
                    <th>Local</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasDoacoes.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.doador}</td>
                      <td>{item.campanha || "Geral (Sem campanha)"}</td>
                      <td>
                        {new Date(item.data).toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                        })}
                      </td>
                      <td>
                        <span className={`selo selo-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.horas_concedidas ? `${item.horas_concedidas}h` : "—"}</td>
                      <td>{item.local_entrega}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

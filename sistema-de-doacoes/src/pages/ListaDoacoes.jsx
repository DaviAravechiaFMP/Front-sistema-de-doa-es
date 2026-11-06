import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:3000";

export default function ListaDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [alunos, setAlunos] = useState({}); // { id: nome }
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [respDoacoes, respUsers] = await Promise.all([
          fetch(`${API}/doacoes`),
          fetch(`${API}/users`),
        ]);

        if (!respDoacoes.ok || !respUsers.ok) {
          setErro("Erro ao carregar os dados da API");
          return;
        }

        const listaDoacoes = await respDoacoes.json();
        const listaUsers = await respUsers.json();

        // monta um dicionário id -> nome (sem usar a senha)
        const mapa = {};
        listaUsers.forEach((u) => {
          mapa[u.id] = u.nome;
        });

        setAlunos(mapa);
        setDoacoes(listaDoacoes);
      } catch {
        setErro("Não foi possível conectar ao servidor");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
  <div className="pagina">
    <div className="pagina-topo">
      <h1>Doações</h1>
      <div>
        <Link className="link" to="/home">Voltar</Link>{" "}
        <Link className="botao" to="/doacoes/nova">Nova doação</Link>
      </div>
    </div>

    {doacoes.length === 0 ? (
      <p>Nenhuma doação cadastrada.</p>
    ) : (
      <div className="tabela-wrap">
        <table className="tabela">
          <thead>
            <tr>
              <th>Doador</th>
              <th>Item</th>
              <th>Qtd.</th>
              <th>Data</th>
              <th>Campanha</th>
              <th>Status</th>
              <th>Horas</th>
              <th>Evidência</th>
            </tr>
          </thead>
          <tbody>
            {doacoes.map((d) => (
              <tr key={d.id}>
                <td>{alunos[d.alunoId] ?? `Aluno #${d.alunoId}`}</td>
                <td>{d.tipoItem}</td>
                <td>{d.quantidade}</td>
                <td>{new Date(d.data + "T00:00:00").toLocaleDateString("pt-BR")}</td>
                <td>{d.campanhaId}</td>
                <td>
                  <span className={`selo selo-${d.status.toLowerCase()}`}>
                    {d.status}
                  </span>
                  {d.status === "Reprovada" && d.motivoReprovacao && (
                    <small> ({d.motivoReprovacao})</small>
                  )}
                </td>
                <td>{d.horasConcedidas}</td>
                <td>
                  {d.fotoEvidencia?.startsWith("data:image") ? (
                    <img src={d.fotoEvidencia} alt="Evidência" width="60" />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}
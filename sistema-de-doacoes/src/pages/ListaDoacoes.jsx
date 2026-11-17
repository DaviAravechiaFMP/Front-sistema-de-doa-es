import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function ListaDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get("/api/doacoes");
        setDoacoes(resp.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // token expirado ou inválido: sai e volta para o login
          logout();
          navigate("/login");
          return;
        }
        if (err.response) {
          setErro(err.response.data?.mensagem || "Erro ao carregar as doações");
        } else {
          setErro("Não foi possível conectar ao servidor");
        }
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
                <th>Campanha</th>
                <th>Data</th>
                <th>Local de entrega</th>
                <th>Status</th>
                <th>Horas</th>
              </tr>
            </thead>
            <tbody>
              {doacoes.map((d) => (
                <tr key={d.id}>
                  <td>{d.doador}</td>
                  <td>{d.campanha}</td>
                  <td>
                    {new Date(d.data).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>{d.local_entrega}</td>
                  <td>
                    <span className={`selo selo-${d.status.toLowerCase()}`}>
                      {d.status}
                    </span>
                  </td>
                  <td>{Number(d.horas_concedidas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
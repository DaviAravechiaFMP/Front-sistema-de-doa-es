import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Home() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [resumo, setResumo] = useState({ total: 0, pendentes: 0, horas: 0 });

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get("/api/doacoes");
        const doacoes = resp.data;

        setResumo({
          total: doacoes.length,
          pendentes: doacoes.filter((d) => d.status === "Pendente").length,
          horas: doacoes.reduce(
            (soma, d) => soma + Number(d.horas_concedidas || 0),
            0
          ),
        });
      } catch (err) {
        if (err.response?.status === 401) {
          // token expirado ou inválido: volta para o login
          logout();
          navigate("/login");
        }
        // outros erros: mantém os valores zerados
      }
    }

    carregar();
  }, []);

  function handleSair(e) {
    e.preventDefault();
    logout();
    navigate("/login");
  }

  return (
    <div id="app-root">
      <aside>
        <h1>Doações FMP</h1>
        <div id="asideInteract">
          <ul>
            <li><Link to="/home">Início</Link></li>
            <li><Link to="/doacoes">Ver doações</Link></li>
            <li><Link to="/doacoes/nova">Cadastrar doação</Link></li>
          </ul>
          <ul>
            <li><a href="#" onClick={handleSair}>Sair</a></li>
          </ul>
        </div>
      </aside>

      <header>
        <h2>Bem-vindo ao Sistema de Doações</h2>
        <span>{usuario?.nome}</span>
      </header>

      <div className="container">
        <div className="card">
          <h1>TOTAL DE DOAÇÕES</h1>
          <p>{resumo.total}</p>
        </div>
        <div className="card">
          <h1>PENDENTES</h1>
          <p>{resumo.pendentes}</p>
        </div>
        <div className="card">
          <h1>HORAS CONCEDIDAS</h1>
          <p>{resumo.horas}</p>
        </div>
      </div>
    </div>
  );
}
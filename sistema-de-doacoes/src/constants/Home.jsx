import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:3000";

export default function Home() {
  const { token, logout } = useAuth();
  const [nome, setNome] = useState("");
  const [resumo, setResumo] = useState({ total: 0, pendentes: 0, horas: 0 });

  useEffect(() => {
    async function carregar() {
      try {
        const [respDoacoes, respUser] = await Promise.all([
          fetch(`${API}/doacoes`),
          fetch(`${API}/users/${token}`),
        ]);

        if (respUser.ok) {
          const user = await respUser.json();
          setNome(user.nome);
        }

        if (respDoacoes.ok) {
          const doacoes = await respDoacoes.json();
          setResumo({
            total: doacoes.length,
            pendentes: doacoes.filter((d) => d.status === "Pendente").length,
            horas: doacoes.reduce((soma, d) => soma + (d.horasConcedidas || 0), 0),
          });
        }
      } catch {
        // sem servidor: mantém os valores zerados
      }
    }

    carregar();
  }, [token]);

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
            <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Sair</a></li>
          </ul>
        </div>
      </aside>

      <header>
        <h2>Bem-vindo ao Sistema de Doações</h2>
        <span>{nome}</span>
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
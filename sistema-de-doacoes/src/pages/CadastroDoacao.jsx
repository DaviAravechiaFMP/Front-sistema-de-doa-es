import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:3000";

export default function CadastroDoacao() {
  const { token } = useAuth(); // no nosso protótipo, o token é o id do usuário
  const navigate = useNavigate();

  const [campanhaId, setCampanhaId] = useState("1");
  const [tipoItem, setTipoItem] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [foto, setFoto] = useState(null); // base64
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleFoto(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = () => setFoto(reader.result);
    reader.readAsDataURL(arquivo);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!foto) {
      setErro("Anexe a foto de evidência da doação");
      return;
    }

    setEnviando(true);
    try {
      const resp = await fetch(`${API}/doacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alunoId: Number(token),
          campanhaId: Number(campanhaId),
          data,
          quantidade: Number(quantidade),
          tipoItem,
          status: "Pendente",
          fotoEvidencia: foto,
          motivoReprovacao: null,
          horasConcedidas: 0,
        }),
      });

      if (!resp.ok) {
        setErro(`Erro ao salvar a doação (${resp.status})`);
        return;
      }

      navigate("/home");
    } catch {
      setErro("Não foi possível conectar ao servidor");
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
          <option value="1">Campanha 1</option>
          <option value="2">Campanha 2</option>
        </select>

        <label htmlFor="tipoItem">Tipo do item:</label>
        <input
          id="tipoItem"
          value={tipoItem}
          onChange={(e) => setTipoItem(e.target.value)}
          placeholder="Ex.: Agasalho, Alimento não perecível"
          required
        />

        <label htmlFor="quantidade">Quantidade:</label>
        <input
          id="quantidade"
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />

        <label htmlFor="data">Data:</label>
        <input
          id="data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        <label htmlFor="foto">Foto de evidência:</label>
        <input id="foto" type="file" accept="image/*" onChange={handleFoto} />
        {foto && <img src={foto} alt="Pré-visualização" />}

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
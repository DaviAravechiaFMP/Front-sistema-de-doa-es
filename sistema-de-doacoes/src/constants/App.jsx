import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import RotaPrivada from "./RotaPrivada";
import CadastroUsuario from "../pages/CadastroUsuario";
import CadastroDoacao from "../pages/CadastroDoacao";
import ListaDoacoes from "../pages/ListaDoacoes";
import ListaCampanhas from "../pages/ListaCampanhas";

export default function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<CadastroUsuario />} />

      {/* Rotas Protegidas (exigem autenticação JWT) */}
      <Route
        path="/home"
        element={
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        }
      />

      <Route
        path="/campanhas"
        element={
          <RotaPrivada>
            <ListaCampanhas />
          </RotaPrivada>
        }
      />

      <Route
        path="/doacoes"
        element={
          <RotaPrivada>
            <ListaDoacoes />
          </RotaPrivada>
        }
      />

      <Route
        path="/doacoes/nova"
        element={
          <RotaPrivada>
            <CadastroDoacao />
          </RotaPrivada>
        }
      />

      {/* Redirecionamentos padrão */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

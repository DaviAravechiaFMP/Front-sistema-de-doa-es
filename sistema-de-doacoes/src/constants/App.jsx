import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import RotaPrivada from "./RotaPrivada";
import CadastroDoacao from "../pages/CadastroDoacao"; // ajuste conforme a pasta
import ListaDoacoes from "../pages/ListaDoacoes"; // ajuste conforme a pasta

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/home"
        element={
          <RotaPrivada>
            <Home />
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
      <Route
        path="/doacoes"
        element={
          <RotaPrivada>
            <ListaDoacoes />
          </RotaPrivada>
  }
/>

      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
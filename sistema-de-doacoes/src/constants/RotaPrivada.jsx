import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RotaPrivada({ children }) {
  const { logado, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="pagina-centro">
        <p>Carregando sessão...</p>
      </div>
    );
  }

  return logado ? children : <Navigate to="/login" replace />;
}

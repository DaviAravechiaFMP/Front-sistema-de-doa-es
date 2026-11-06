import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RotaPrivada({ children }) {
  const { logado } = useAuth();
  return logado ? children : <Navigate to="/login" replace />;
}
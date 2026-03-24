import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../utils/auth";

export default function AdminRoute({ children }) {
  const user = getUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}

export default ProtectedRoute;

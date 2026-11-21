
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isLoggedIn =
    sessionStorage.getItem("isAdminLoggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role, roles }) {
  const userRole = localStorage.getItem("role");

  // not logged in
  if (!userRole) return <Navigate to="/login" />;

  // case 1: single role (role="admin")
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  // case 2: multiple roles (roles={["admin","client"]})
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

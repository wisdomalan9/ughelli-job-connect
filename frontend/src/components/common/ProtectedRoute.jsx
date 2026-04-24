import { Navigate } from "react-router-dom";

function ProtectedRoute({
  user,
  allow,
  children,
}) {
  if (!user) {
    return <Navigate to="/" />;
  }

  if (
    allow &&
    !allow.includes(user.user.role)
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;

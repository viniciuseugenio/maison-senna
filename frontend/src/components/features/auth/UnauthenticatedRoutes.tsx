import { useAuth } from "@/store/useAuth";
import { Navigate, Outlet } from "@tanstack/react-router";

const UnauthenticatedRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default UnauthenticatedRoutes;

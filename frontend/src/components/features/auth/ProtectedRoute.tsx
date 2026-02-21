import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/store/useAuth";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${pathname}`} replace />;
  }

  if (requireAdmin && user && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

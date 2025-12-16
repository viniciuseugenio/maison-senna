import { Navigate } from "react-router";
import { useAuth } from "../../store/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  next?: string;
};

export default function ProtectedRoute({
  children,
  next,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to={`/login?${next}`} replace />;
  }

  return <>{children}</>;
}

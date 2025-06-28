import { useUserContext } from "../../hooks/auth";
import { Navigate } from "react-router";

type ProtectedRouteProps = {
  children: React.ReactNode;
  next?: string;
};

export default function ProtectedRoute({
  children,
  next,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useUserContext();

  if (!isAuthenticated) {
    return <Navigate to={`/login?${next}`} replace />;
  }

  return <>{children}</>;
}

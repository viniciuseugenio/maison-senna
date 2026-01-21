import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/store/useAuth";

const UnauthenticatedRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default UnauthenticatedRoutes;

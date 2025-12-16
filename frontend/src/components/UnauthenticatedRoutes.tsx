import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import { toast } from "../utils/customToast";

const UnauthenticatedRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.error({
        title: "You cannot enter this page.",
        description:
          "This page is meant only for users that are not authenticated.",
      });
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default UnauthenticatedRoutes;

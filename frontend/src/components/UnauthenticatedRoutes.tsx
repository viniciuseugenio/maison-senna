import { Outlet, useNavigate } from "react-router";
import { useUserContext } from "../hooks/auth";
import { toast } from "../utils/customToast";
import { useEffect } from "react";

const UnauthenticatedRoutes: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      toast.error({
        title: "You cannot enter this page.",
        description:
          "This page is meant only for users that are not authenticated.",
      });
      navigate("/");
    }
  }, [user, navigate]);

  return <Outlet />;
};

export default UnauthenticatedRoutes;

import { useGoogleLogin } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import { camelCase } from "change-case";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { checkUserAuthenticity } from "../api/endpoints/auth";
import { API_ENDPOINTS } from "../api/endpoints/constants";
import { customFetch } from "../api/endpoints/customFetch";
import { ERROR_NOTIFICATIONS, SUCCESS_NOTIFICATIONS } from "../constants/auth";
import { UserContext } from "../store/UserContext";
import { toast } from "../utils/customToast";
import { transformKeys } from "../utils/transformKeys";

export const useCheckUser = () => {
  const { data, refetch, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: checkUserAuthenticity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = transformKeys(data, camelCase);
  return { user, refetch, isError, error };
};

export function useUserContext() {
  const user = useContext(UserContext);

  if (user === undefined) {
    throw new Error("useUserContext must be used with a UserContext");
  }

  return user;
}

export const useGoogleOAuth = (setIsLoading: (v: boolean) => void) => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  return useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    onSuccess: async ({ code }) => {
      if (!code) return;

      try {
        const data = await customFetch(API_ENDPOINTS.GOOGLE_LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const userObj = transformKeys(data.user, camelCase);

        const getTitle = () => {
          if (data.type === "register")
            return SUCCESS_NOTIFICATIONS.REGISTER_SUCCESS.title;
          return `${SUCCESS_NOTIFICATIONS.LOGIN_SUCCESS.title}, ${userObj.firstName}!`;
        };

        const getDescription = () => {
          if (data.type === "register")
            return SUCCESS_NOTIFICATIONS.REGISTER_SUCCESS.social_register;
          return SUCCESS_NOTIFICATIONS.LOGIN_SUCCESS.description;
        };

        toast.success({
          title: getTitle(),
          description: getDescription(),
        });

        setUser(userObj);
        navigate("/");
      } catch {
        toast.error({
          title: ERROR_NOTIFICATIONS.SOCIAL_LOGIN_ERROR.title,
          description: ERROR_NOTIFICATIONS.SOCIAL_LOGIN_ERROR.description,
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      const description =
        errorResponse.error === "access_denied"
          ? ERROR_NOTIFICATIONS.SOCIAL_LOGIN_ERROR.access_denied
          : ERROR_NOTIFICATIONS.SOCIAL_LOGIN_ERROR.description;

      toast.error({
        title: ERROR_NOTIFICATIONS.SOCIAL_LOGIN_ERROR.title,
        description: description,
      });
      setIsLoading(false);
    },
    onNonOAuthError: () => setIsLoading(false),
  });
};

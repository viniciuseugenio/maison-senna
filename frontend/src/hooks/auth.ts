import { useGoogleLogin } from "@react-oauth/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { camelCase } from "change-case";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { logoutUser } from "../api/endpoints/auth";
import { AUTH_ENDPOINTS } from "../api/endpoints/constants";
import { customFetch } from "../api/endpoints/customFetch";
import { ERROR_NOTIFICATIONS } from "../constants/auth";
import { UserContext } from "../store/UserContext";
import { ApiResponse } from "../types/api";
import { toast } from "../utils/customToast";
import { transformKeys } from "../utils/transformKeys";

export function useUserContext() {
  const user = useContext(UserContext);

  if (user === undefined) {
    throw new Error("useUserContext must be used with a UserContext");
  }

  return user;
}

export function useLogout(automatic?: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSuccess: (data: ApiResponse) => {
      const previousUser = queryClient.getQueryData(["user"]);
      queryClient.setQueryData(["user"], null);

      if (previousUser && !automatic) {
        toast.info({
          title: data.detail,
          description: data.description,
        });
      }
    },
    onError: () => {
      toast.error({
        title: ERROR_NOTIFICATIONS.LOGOUT_ERROR.title,
        description: ERROR_NOTIFICATIONS.LOGOUT_ERROR.description,
      });
    },
  });
}

export const useGoogleOAuth = (setIsLoading: (v: boolean) => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    onSuccess: async ({ code }) => {
      if (!code) return;

      try {
        const data: ApiResponse = await customFetch(
          AUTH_ENDPOINTS.GOOGLE_LOGIN,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          },
        );

        const userObj = transformKeys(data.user, camelCase);

        toast.success({
          title: data.detail,
          description: data.description,
        });

        navigate("/");
        setTimeout(() => {
          queryClient.setQueryData(["user"], userObj);
        }, 200);
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

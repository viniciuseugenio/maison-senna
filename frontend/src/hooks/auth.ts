import { useGoogleLogin } from "@react-oauth/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  checkUserAuthenticity,
  loginUser,
  logoutUser,
} from "../api/endpoints/auth";
import { AUTH_ENDPOINTS } from "../api/endpoints/constants";
import { customFetch } from "../api/endpoints/customFetch";
import { ERROR_NOTIFICATIONS } from "../constants/auth";
import { ApiResponse } from "../types/api";
import { User as UserType } from "../types/auth";
import { toast } from "../utils/customToast";

export function useAuthUser() {
  return useQuery<{ authenticated: boolean; user: any }>({
    queryKey: ["user"],
    queryFn: checkUserAuthenticity,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });
}

export function useIsAuthenticated() {
  const { data } = useAuthUser();
  return data?.authenticated ?? false;
}

export function useCurrentUser() {
  const { data } = useAuthUser();
  const user: UserType = data?.user;
  return user ?? null;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      rememberMe,
    }: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => loginUser({ email, password, rememberMe }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], {
        authenticated: true,
        user: data.user,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], null);
      toast.success({ title: data.detail, description: data.description });
    },
    onError: () => {
      queryClient.setQueryData(["user"], null);
      toast.success({
        title: "You've Signed Out",
        description:
          "You’ve been securely signed out. We look forward to welcoming you back.",
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

        toast.success({
          title: data.detail,
          description: data.description,
        });

        navigate("/");
        setTimeout(() => {
          queryClient.setQueryData(["user"], {
            authenticated: true,
            user: data.user,
          });
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

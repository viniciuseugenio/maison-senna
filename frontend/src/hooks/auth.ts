import { errorNotifications, toastMessages } from "@/constants/auth";
import { toast } from "@/utils/customToast";
import { customFetch } from "@/api/client";
import { AUTH_ENDPOINTS } from "@/api/constants";
import { checkUserAuthenticity, loginUser, logoutUser } from "@/api/services";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponseType, User as UserType } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { userQueryOptions } from "@/api/queries";

export function useAuthUser() {
  return useQuery<{ authenticated: boolean; user: any }>(userQueryOptions);
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
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], {
        authenticated: true,
        user: data.user,
      });
    },
    onError: (data) => {
      toast.error({ title: data.detail, description: data.description });
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
        title: toastMessages.auth.signedOut.title,
        description: toastMessages.auth.signedOut.description,
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
        const data: ApiResponseType = await customFetch(
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
          title: errorNotifications.socialLoginError.title,
          description: errorNotifications.socialLoginError.description,
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      const description =
        errorResponse.error === "access_denied"
          ? errorNotifications.socialLoginError.access_denied
          : errorNotifications.socialLoginError.description;

      toast.error({
        title: errorNotifications.socialLoginError.title,
        description: description,
      });
      setIsLoading(false);
    },
    onNonOAuthError: () => setIsLoading(false),
  });
};

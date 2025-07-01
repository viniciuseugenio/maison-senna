import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  checkUserAuthenticity,
  refreshAccessToken,
} from "../api/endpoints/auth";
import { ACCESS_TOKEN_LIFETIME } from "../constants/auth";
import { useLogout } from "../hooks/auth";
import { UserContext } from "../store/UserContext";

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["user"],
    staleTime: ACCESS_TOKEN_LIFETIME,
    queryFn: checkUserAuthenticity,
    retry: false,
  });

  const isAuthenticated = !!user;
  const { mutate: logout } = useLogout();

  useEffect(() => {
    (async () => {
      if (error && error.status === 401) {
        try {
          const refreshedData = await refreshAccessToken();

          if (refreshedData) {
            queryClient.setQueryData(["user"], refreshedData);
          } else if (user) {
            logout();
          }
        } catch {
          if (user) {
            logout();
          }
        }
      }
    })();
  }, [user, logout, error, isError, queryClient]);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  checkUserAuthenticity,
  refreshAccessToken,
} from "../api/endpoints/auth";
import { useLogout } from "../hooks/auth";
import { UserContext } from "../store/UserContext";

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: checkUserAuthenticity,
    retry: false,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: "always",
  });

  const { isLoading: refreshIsLoading, refetch: fetchRefreshUser } = useQuery({
    queryKey: ["refreshUser"],
    queryFn: refreshAccessToken,
    enabled: false,
    retry: false,
  });

  const isAuthenticated = !!user;
  const { mutate: logout } = useLogout();

  useEffect(() => {
    (async () => {
      if (user && !error) {
        setIsInitializing(false);
        return;
      }

      if (error && error.status === 401) {
        try {
          const { data } = await fetchRefreshUser();

          if (data) {
            queryClient.setQueryData(["user"], data);
          } else {
            logout();
          }
        } catch {
          logout();
        } finally {
          setIsInitializing(false);
        }
      }
    })();
  }, [
    user,
    logout,
    error,
    isError,
    queryClient,
    isInitializing,
    fetchRefreshUser,
  ]);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading: isInitializing || isLoading || refreshIsLoading,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

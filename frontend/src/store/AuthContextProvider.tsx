import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  checkUserAuthenticity,
  refreshAccessToken,
} from "../api/endpoints/auth";
import { useLogout } from "../hooks/auth";
import { AuthContext } from "./AuthContext";

export default function AuthContextProvider({
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
  const { mutate: automaticLogout } = useLogout(true);
  const { mutate: logout } = useLogout(false);

  useEffect(() => {
    (async () => {
      if (user && !error) {
        setIsInitializing(false);
        return;
      }

      if (error?.status === 401) {
        try {
          const { data, isError } = await fetchRefreshUser();

          if (data && !isError) {
            queryClient.setQueryData(["user"], data);
          } else {
            automaticLogout();
          }
        } catch {
          automaticLogout();
        } finally {
          setIsInitializing(false);
        }
      } else if (error) {
        setIsInitializing(false);
      }
    })();
  }, [user, error, queryClient, fetchRefreshUser, automaticLogout]);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading: isInitializing || isLoading || refreshIsLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

import { useQuery } from "@tanstack/react-query";
import { checkUserAuthenticity } from "../api/endpoints/auth";
import { useLogout } from "../hooks/auth";
import { AuthContext } from "./AuthContext";

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: checkUserAuthenticity,
    retry: false,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: "always",
  });

  const isAuthenticated = !!user;
  const { mutate: logout } = useLogout(false);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

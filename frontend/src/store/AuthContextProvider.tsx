import {
  useAuthUser,
  useCurrentUser,
  useIsAuthenticated,
  useLogout,
} from "../hooks/auth";
import { AuthContext } from "./AuthContext";

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuthUser();
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const { mutate: logout } = useLogout();

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

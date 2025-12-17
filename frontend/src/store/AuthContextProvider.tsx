import {
  useAuthUser,
  useCurrentUser,
  useIsAuthenticated,
  useLogin,
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
  const login = useLogin();

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    login,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

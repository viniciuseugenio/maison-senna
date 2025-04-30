import { useCallback, useEffect, useState } from "react";
import { refreshAccessToken } from "../api/endpoints/auth";
import { useCheckUser } from "../hooks/auth";
import { UserContext } from "../store/UserContext";
import { User } from "../types/auth";

function areUsersEqual(a?: User, b?: User): boolean {
  if (!a || !b) return false;
  return (
    a.id === b.id &&
    a.firstName === b.firstName &&
    a.lastName === b.lastName &&
    a.email === b.email
  );
}

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const isAuthenticated = !!user;

  const {
    user: updatedUser,
    isError: isCheckError,
    refetch: refetchCheckUser,
  } = useCheckUser();

  useEffect(() => {
    if (updatedUser && !areUsersEqual(updatedUser, user)) {
      setUser(updatedUser);
    }
  }, [updatedUser, user]);

  const clearUser = () => setUser(undefined);

  const handleAuthRecovery = useCallback(
    async function () {
      try {
        const refreshedUserData = await refreshAccessToken();
        if (refreshedUserData) {
          refetchCheckUser();
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      }
    },
    [refetchCheckUser],
  );

  useEffect(() => {
    if (isCheckError && !updatedUser) {
      handleAuthRecovery();
    }
  }, [isCheckError, updatedUser, handleAuthRecovery]);

  const contextValue = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    isAuthenticated,
    setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

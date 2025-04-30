import { camelCase } from "change-case";
import { useCallback, useEffect, useState } from "react";
import { refreshAccessToken } from "../api/endpoints/auth";
import { useCheckUser } from "../hooks/auth";
import { UserContext } from "../store/UserContext";
import { User } from "../types/auth";
import { transformKeys } from "../utils/transformKeys";

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
    if (updatedUser) {
      setUser(updatedUser);
    }
  }, [updatedUser]);

  const clearUser = () => setUser(undefined);

  const handleAuthRecovery = useCallback(
    async function () {
      try {
        const refreshedUserData = await refreshAccessToken();
        if (refreshedUserData) {
          const refetchData = await refetchCheckUser();
          const updatedUserData = transformKeys(refetchData.data, camelCase);

          if (updatedUserData) {
            setUser(updatedUserData);
          } else {
            clearUser();
          }
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
    isAuthenticated,
    setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { logoutUser, refreshAccessToken } from "../api/endpoints/auth";
import { ERROR_NOTIFICATIONS, SUCCESS_NOTIFICATIONS } from "../constants/auth";
import { useCheckUser } from "../hooks/auth";
import { UserContext } from "../store/UserContext";
import { User } from "../types/auth";
import { toast } from "../utils/customToast";

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
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
  const queryClient = useQueryClient();

  const clearUser = () => setUser(undefined);

  const { mutate: logout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      clearUser();

      toast.info({
        title: SUCCESS_NOTIFICATIONS.LOGOUT_SUCCESS.title,
        description: SUCCESS_NOTIFICATIONS.LOGOUT_SUCCESS.description,
      });
    },
    onError: () => {
      toast.error({
        title: ERROR_NOTIFICATIONS.LOGOUT_ERROR.title,
        description: ERROR_NOTIFICATIONS.LOGOUT_ERROR.description,
      });
    },
  });

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
    user,
    isAuthenticated,
    setUser,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

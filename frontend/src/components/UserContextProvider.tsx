import { useState } from "react";
import { UserContext } from "../store/UserContext";
import { User } from "../types/auth";
import { useCheckUser } from "../hooks/auth";
import { useEffect } from "react";
import { transformKeys } from "../utils/transformKeys";
import { camelCase } from "change-case";

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const isAuthenticated = !!user;
  const { user: updatedUser, isError } = useCheckUser();

  useEffect(() => {
    if (isError && !updatedUser) {
      setUser(undefined);
      return;
    }

    const userObj = transformKeys(updatedUser, camelCase);
    setUser(userObj);
  }, [isError, updatedUser]);

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

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { checkUserAuthenticity } from "../api/endpoints/auth";
import { UserContext } from "../store/UserContext";

export const useCheckUser = () => {
  const {
    data: user,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: checkUserAuthenticity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { user, refetch, isError, error };
};

export function useUserContext() {
  const user = useContext(UserContext);

  if (user === undefined) {
    throw new Error("useUserContext must be used with a UserContext");
  }

  return user;
}

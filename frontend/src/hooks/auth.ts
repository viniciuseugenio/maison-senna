import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { checkUserAuthenticity } from "../api/endpoints/auth";
import { UserContext } from "../store/UserContext";
import { transformKeys } from "../utils/transformKeys";
import { camelCase } from "change-case";

export const useCheckUser = () => {
  const { data, refetch, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: checkUserAuthenticity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = transformKeys(data, camelCase);
  return { user, refetch, isError, error };
};

export function useUserContext() {
  const user = useContext(UserContext);

  if (user === undefined) {
    throw new Error("useUserContext must be used with a UserContext");
  }

  return user;
}

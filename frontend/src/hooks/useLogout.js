import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { removeStoredToken } from "../lib/utils";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear the token from localStorage
      removeStoredToken();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;

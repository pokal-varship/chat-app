import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { setStoredToken } from "../lib/utils";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store the token in localStorage
      if (data.user && data.user.token) {
        // console.log("Login successful, storing token:", data.user.token);
        setStoredToken(data.user.token);
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;

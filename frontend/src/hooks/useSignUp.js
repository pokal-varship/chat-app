import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import { setStoredToken } from "../lib/utils";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // Store the token in localStorage
      if (data.user && data.user.token) {
        setStoredToken(data.user.token);
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { isPending, error, signupMutation: mutate };
};
export default useSignUp;

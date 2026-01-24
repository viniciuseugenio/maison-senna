import { FetchErrorType } from "@/types/api";
import { toast } from "@/utils/customToast";
import { useMutation } from "@tanstack/react-query";

interface UseOptimisticMutationOptions<TData, TVariables, TContext> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onOptimisticUpdate: (variables: TVariables) => void;
  getPreviousOptions: () => TContext;
  onRollback: (context: TContext) => void;
  successMessage?: (data: TData) => string;
  errorMessage?: (data: FetchErrorType) => string;
}

export function useOptimisticMutation<TData, TVariables, TContext>({
  mutationFn,
  getPreviousOptions,
  onOptimisticUpdate,
  onRollback,
  successMessage,
  errorMessage,
}: UseOptimisticMutationOptions<TData, TVariables, TContext>) {
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      const previousOptions = getPreviousOptions();
      onOptimisticUpdate(variables);
      return { previousOptions };
    },
    onSuccess: (data) => {
      if (successMessage) {
        toast.success({ title: successMessage(data) });
      }
    },
    onError: (error, variables, context) => {
      if (errorMessage) {
        toast.error({ title: errorMessage(error) });
      }
      if (context?.previousOptions) {
        onRollback(context.previousOptions);
      }
    },
  });
}

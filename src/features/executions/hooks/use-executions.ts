import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useExecutionParams } from "./use-executions-params";

// hook to fetch all Execution using suspense
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionParams();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

// hook to fetch a single Execution using suspense
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.executions.getOne.queryOptions({
      id,
    })
  );
};

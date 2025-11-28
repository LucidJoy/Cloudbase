import { Button } from "@/components/ui/button";
import { useExecutionWorkflow } from "@/features/workflows/hooks/use-worklows";
import { FlaskConicalIcon } from "lucide-react";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecutionWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};

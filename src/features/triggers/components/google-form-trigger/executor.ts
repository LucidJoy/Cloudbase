import type { NodeExecutor } from "@/features/executions/types";

import { googleFormTriggerChannel } from "@/innjest/channels/google-form-trigger";

type GoogleFOrmTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFOrmTriggerData
> = async ({ nodeId, context, step, publish }) => {
  // publish loading state for manual trigger
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("google-form-trigger", async () => context);

  //   publish "success" state for manual trigger
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};

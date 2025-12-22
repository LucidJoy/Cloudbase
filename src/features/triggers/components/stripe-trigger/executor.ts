import type { NodeExecutor } from "@/features/executions/types";

import { stripeTriggerChannel } from "@/innjest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  // publish loading state for manual trigger
  await publish(
    stripeTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("stripe-trigger", async () => context);

  //   publish "success" state for manual trigger
  await publish(
    stripeTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};

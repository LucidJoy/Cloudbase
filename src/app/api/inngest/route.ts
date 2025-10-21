import { serve } from "inngest/next";
import { inngest } from "@/innjest/client";
import { execute } from "@/innjest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [execute],
});

import { inngest } from "@/innjest/client";
import {
  protectedProcedure,
  createTRPCRouter,
  baseProcedure,
  premiumProcedure,
} from "../init";
import prisma from "@/lib/database";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { TRPCError } from "@trpc/server";
import { workflowRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

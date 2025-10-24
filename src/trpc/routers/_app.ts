import { inngest } from "@/innjest/client";
import { protectedProcedure, createTRPCRouter, baseProcedure } from "../init";
import prisma from "@/lib/database";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { TRPCError } from "@trpc/server";

export const appRouter = createTRPCRouter({
  testAi: baseProcedure.mutation(async () => {
    // throw new TRPCError({
    //   code: "BAD_REQUEST",
    //   message: "Something went wrong",
    // });
    await inngest.send({ name: "execute/ai" });
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "joyee@gmail.com",
      },
    });

    return { success: true, message: "Job queued" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

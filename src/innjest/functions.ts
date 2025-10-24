import prisma from "@/lib/database";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-5"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return { geminiSteps, openaiSteps };
  }
);

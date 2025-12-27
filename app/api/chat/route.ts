import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";
import { SCHEMA, SYSTEM_PROMPT } from "@/constants";
import { db } from "@/app/db/db";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      db: tool({
        description: "Call this tool to query the database",
        inputSchema: z.object({
          query: z
            .string()
            .describe("The SQL query to execute against the database"),
        }),
        execute: async ({ query }) => {
          console.log("DB tool called with query:", query);
          const result = await db.run(query);
          return result;
        },
      }),
      schema: tool({
        description: "Call this tool to get the database schema",
        execute: async () => {
          console.log("Schema tool called");
          return SCHEMA;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

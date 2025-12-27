import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";
import { SYSTEM_PROMPT } from "@/prompt";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools: {
      db: tool({
        description: "Call this tool to query the database",
        inputSchema: z.object({
          query: z
            .string()
            .describe("The SQL query to execute against the database"),
        }),
        execute: async ({ query }) => {
          // Mock database query execution

          return `Results for query: ${query}`;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

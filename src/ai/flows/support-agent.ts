'use server';
/**
 * @fileOverview A support agent flow that answers user queries.
 *
 * - askSupportAgentFlow - A function that takes a user query and returns a helpful response.
 * - AskSupportAgentInputSchema - The input type for the askSupportAgentFlow function.
 * - AskSupportAgentOutputSchema - The return type for the askSupportAgentFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AskSupportAgentInputSchema = z.string();
export const AskSupportAgentOutputSchema = z.string();

export type AskSupportAgentInput = z.infer<typeof AskSupportAgentInputSchema>;
export type AskSupportAgentOutput = z.infer<typeof AskSupportAgentOutputSchema>;

const supportAgentPrompt = ai.definePrompt({
    name: 'supportAgentPrompt',
    input: { schema: AskSupportAgentInputSchema },
    output: { format: 'text' },
    prompt: `You are a friendly and helpful support agent for the Ignitia learning platform. Your goal is to assist users by answering their questions about the platform, their learning path, and any technical issues they might encounter.

    Here is the user's query:
    "{{{prompt}}}"

    Please provide a clear, concise, and helpful response. If you don't know the answer, admit it and suggest where the user might find more information.
    `,
});


export const askSupportAgentFlow = ai.defineFlow(
  {
    name: 'askSupportAgentFlow',
    inputSchema: AskSupportAgentInputSchema,
    outputSchema: AskSupportAgentOutputSchema,
  },
  async (query) => {
    const response = await supportAgentPrompt(query);
    return response.text;
  }
);

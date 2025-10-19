'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized learning paths.
 *
 * The flow takes a skill profile and learning goals as input and returns a recommended learning path.
 * It exports the following:
 * - generateLearningPath: A function to trigger the learning path generation flow.
 * - LearningPathInput: The input type for the generateLearningPath function.
 * - LearningPathOutput: The output type for the generateLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearningPathInputSchema = z.object({
  skillProfile: z
    .string()
    .describe('A summary of the user skills, experience and qualifications.'),
  learningGoals: z
    .string()
    .describe('The user learning goals and aspirations.'),
  preferredLearningStyle: z
    .string()
    .optional()
    .describe('Optional preferences for learning style, such as visual, auditory, or kinesthetic.'),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

const LearningPathOutputSchema = z.object({
  learningPath: z.array(z.string()).describe('A list of recommended learning resources.'),
  miniProjectIdeas: z.array(z.string()).describe('A list of mini-project ideas to apply the skills.'),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;

export async function generateLearningPath(input: LearningPathInput): Promise<LearningPathOutput> {
  return generateLearningPathFlow(input);
}

const learningPathPrompt = ai.definePrompt({
  name: 'learningPathPrompt',
  input: {schema: LearningPathInputSchema},
  output: {schema: LearningPathOutputSchema},
  prompt: `You are an expert learning path generator. Given a user's skill profile and learning goals, you generate a personalized learning path with a list of learning resources and mini-project ideas.

Skill Profile: {{{skillProfile}}}
Learning Goals: {{{learningGoals}}}

Preferred Learning Style: {{#if preferredLearningStyle}}{{{preferredLearningStyle}}}{{else}}No specific preference{{/if}}

Based on the above information, generate a learning path that includes specific learning resources and mini-project ideas.

Learning Path (a list of learning resources, including course names, tutorials, books):
Mini-Project Ideas (practical projects the user can undertake to apply their knowledge):
`,
});

const generateLearningPathFlow = ai.defineFlow(
  {
    name: 'generateLearningPathFlow',
    inputSchema: LearningPathInputSchema,
    outputSchema: LearningPathOutputSchema,
  },
  async input => {
    const {output} = await learningPathPrompt(input);
    return output!;
  }
);

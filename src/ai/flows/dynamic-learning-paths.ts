'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized learning paths.
 *
 * The flow takes a skill profile and learning goals as input and returns a recommended learning path
 * structured into modules, each with resources, a hands-on exercise, and flashcards.
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


const FlashcardSchema = z.object({
  question: z.string().describe('The front of the flashcard, containing a question or term.'),
  answer: z.string().describe('The back of the flashcard, containing the answer or definition.'),
});

const LearningModuleSchema = z.object({
  title: z.string().describe('A concise title for the learning module.'),
  resources: z.array(z.string()).describe('A list of specific learning resources (courses, articles, videos).'),
  handsOnExercise: z.object({
      title: z.string().describe('Title for the hands-on exercise.'),
      description: z.string().describe('A brief description of the exercise and what to do.'),
      steps: z.array(z.string()).describe('A list of steps to complete the exercise.')
  }).describe('A practical, hands-on exercise to apply the knowledge from the module.'),
  flashcards: z.array(FlashcardSchema).describe('A set of flashcards for key concepts in the module.')
});

const LearningPathOutputSchema = z.object({
  learningPath: z.array(LearningModuleSchema).describe('A list of recommended learning modules.'),
  miniProjectIdeas: z.array(z.string()).describe('A list of mini-project ideas to apply the skills.'),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;
export type Flashcard = z.infer<typeof FlashcardSchema>;
export type LearningModule = z.infer<typeof LearningModuleSchema>;


export async function generateLearningPath(input: LearningPathInput): Promise<LearningPathOutput> {
  return generateLearningPathFlow(input);
}

const learningPathPrompt = ai.definePrompt({
  name: 'learningPathPrompt',
  input: {schema: LearningPathInputSchema},
  output: {schema: LearningPathOutputSchema},
  prompt: `You are an expert learning path generator. Given a user's skill profile and learning goals, you generate a personalized learning path structured into modules.

Each module must contain:
1.  A clear title.
2.  A list of specific, actionable learning resources (e.g., course names, tutorial links, book chapters).
3.  A single, practical, hands-on exercise with a title, description, and step-by-step instructions. This should be a "visual hands" style task.
4.  A small set of 3-5 flashcards with a question and a concise answer for reviewing key concepts.

Also, provide a separate list of bigger mini-project ideas.

Skill Profile: {{{skillProfile}}}
Learning Goals: {{{learningGoals}}}
Preferred Learning Style: {{#if preferredLearningstyle}}{{{preferredLearningStyle}}}{{else}}No specific preference{{/if}}

Generate the structured learning path in the required JSON format.
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

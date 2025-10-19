// Skill diagnostic tests with AI-powered evaluation to generate skill profiles using reasoning tool.

'use server';

/**
 * @fileOverview An AI-powered skill assessment flow.
 *
 * - assessSkills - A function that handles the skill assessment process.
 * - AssessSkillsInput - The input type for the assessSkills function.
 * - AssessSkillsOutput - The return type for the assessSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessSkillsInputSchema = z.object({
  testName: z.string().describe('The name of the skill assessment test.'),
  responses: z.array(
    z.object({
      question: z.string().describe('The question asked in the test.'),
      answer: z.string().describe('The user provided answer to the question.'),
    })
  ).describe('An array of questions and answers from the skill assessment test.'),
});
export type AssessSkillsInput = z.infer<typeof AssessSkillsInputSchema>;

const AssessSkillsOutputSchema = z.object({
  skillProfile: z.object({
    overallScore: z.number().describe('The overall score of the skill assessment.'),
    strengths: z.array(z.string()).describe('The strengths identified in the assessment.'),
    weaknesses: z.array(z.string()).describe('The weaknesses identified in the assessment.'),
    recommendations: z.array(z.string()).describe('Personalized recommendations for improvement.'),
  }).describe('The generated skill profile based on the test responses.'),
});
export type AssessSkillsOutput = z.infer<typeof AssessSkillsOutputSchema>;

export async function assessSkills(input: AssessSkillsInput): Promise<AssessSkillsOutput> {
  return assessSkillsFlow(input);
}

const assessSkillsPrompt = ai.definePrompt({
  name: 'assessSkillsPrompt',
  input: {schema: AssessSkillsInputSchema},
  output: {schema: AssessSkillsOutputSchema},
  prompt: `You are an AI-powered skill assessment tool. Your task is to evaluate the user's responses to a skill assessment test and generate a personalized skill profile.

  Test Name: {{{testName}}}

  Responses:
  {{#each responses}}
  Question: {{{question}}}
  Answer: {{{answer}}}
  {{/each}}

  Based on the responses, generate a skill profile with the following information:
  - Overall Score: A numerical score representing the overall competency level.
  - Strengths: A list of identified strengths based on the responses.
  - Weaknesses: A list of identified weaknesses based on the responses.
  - Recommendations: Personalized recommendations for improvement.

  Ensure the skill profile is accurate, insightful, and actionable for the user.
  Output in JSON format.
  `,
});

const assessSkillsFlow = ai.defineFlow(
  {
    name: 'assessSkillsFlow',
    inputSchema: AssessSkillsInputSchema,
    outputSchema: AssessSkillsOutputSchema,
  },
  async input => {
    const {output} = await assessSkillsPrompt(input);
    return output!;
  }
);

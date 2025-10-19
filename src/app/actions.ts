'use server';

import { z } from 'zod';
import { generateLearningPath, type LearningPathInput, type LearningPathOutput } from '@/ai/flows/dynamic-learning-paths';
import { assessSkills, type AssessSkillsInput, type AssessSkillsOutput } from '@/ai/ai-skill-assessment';


const LearningPathFormSchema = z.object({
  skillProfile: z.string().min(10, { message: 'Please provide more details about your skills.' }),
  learningGoals: z.string().min(10, { message: 'Please provide more details about your goals.' }),
  preferredLearningStyle: z.string().optional(),
});

type LearningPathState = {
  error?: string | null;
} & LearningPathOutput;

export async function getLearningPath(
  prevState: LearningPathState,
  formData: FormData
): Promise<LearningPathState> {
  const validatedFields = LearningPathFormSchema.safeParse({
    skillProfile: formData.get('skillProfile'),
    learningGoals: formData.get('learningGoals'),
    preferredLearningStyle: formData.get('preferredLearningStyle'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.learningGoals?.[0] || validatedFields.error.flatten().fieldErrors.skillProfile?.[0] || 'Invalid input.',
      learningPath: [],
      miniProjectIdeas: [],
    };
  }

  try {
    const input: LearningPathInput = validatedFields.data;
    const result = await generateLearningPath(input);
    return { ...result, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return {
      error: `AI generation failed: ${error}`,
      learningPath: [],
      miniProjectIdeas: [],
    };
  }
}

const SkillAssessmentFormSchema = z.object({
  testName: z.string(),
  responses: z.array(z.object({
    question: z.string(),
    answer: z.string().min(1, { message: 'Please answer all questions.' }),
  })),
});

type SkillAssessmentState = {
  error?: string | null;
} & AssessSkillsOutput;

export async function getSkillAssessment(
  prevState: SkillAssessmentState,
  formData: FormData
): Promise<SkillAssessmentState> {
  const testName = formData.get('testName') as string;
  const questions = JSON.parse(formData.get('questions') as string) as string[];
  
  const responses = questions.map((question, index) => ({
    question,
    answer: formData.get(`answer-${index}`) as string,
  }));

  const validatedFields = SkillAssessmentFormSchema.safeParse({
    testName,
    responses,
  });

  if (!validatedFields.success) {
     const fieldErrors = validatedFields.error.flatten().fieldErrors;
     const firstResponseError = fieldErrors.responses?.[0];
     // A bit convoluted to get to the nested error message
     const errorMessage = (typeof firstResponseError === 'object' && firstResponseError.answer?.[0]) || 'Invalid input.';
    return {
      error: errorMessage,
      skillProfile: {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [],
      }
    };
  }

  try {
    const input: AssessSkillsInput = validatedFields.data;
    const result = await assessSkills(input);
    return { ...result, error: null };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return {
      error: `AI assessment failed: ${error}`,
      skillProfile: {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [],
      }
    };
  }
}

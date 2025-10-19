'use server';

import { z } from 'zod';
import { generateLearningPath, type LearningPathInput, type LearningPathOutput } from '@/ai/flows/dynamic-learning-paths';

const FormSchema = z.object({
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
  const validatedFields = FormSchema.safeParse({
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

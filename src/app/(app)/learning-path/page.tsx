'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getLearningPath } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Check, CheckCircle, Lightbulb, Zap, Book, ListChecks } from 'lucide-react';
import type { LearningPathOutput, LearningModule, Flashcard as FlashcardType } from '@/ai/flows/dynamic-learning-paths';
import { cn } from '@/lib/utils';
import { HandsOnExercise } from '@/components/hands-on-exercise';
import { Flashcard } from '@/components/flashcard';

const initialState: { error?: string | null } & Partial<LearningPathOutput> = {
  learningPath: [],
  miniProjectIdeas: [],
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating Your Path...' : 'Generate Learning Path'}
    </Button>
  );
}

export default function LearningPathPage() {
  const [state, formAction] = useActionState(getLearningPath, initialState);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const handleCompleteModule = (moduleTitle: string) => {
    setCompletedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(moduleTitle);
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Your Personalized Learning Path</h1>
        <p className="text-muted-foreground mt-2">
          Tell us about your skills and goals, and our AI will create a tailored learning journey just for you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Learning Preferences</CardTitle>
          <CardDescription>Provide your details to generate a new learning path.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="skillProfile">Current Skills & Experience</Label>
              <Textarea
                id="skillProfile"
                name="skillProfile"
                placeholder="e.g., Proficient in HTML/CSS, beginner in JavaScript, 1 year of experience in graphic design."
                required
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learningGoals">Learning Goals</Label>
              <Textarea
                id="learningGoals"
                name="learningGoals"
                placeholder="e.g., Become a full-stack developer, learn data science for marketing, get certified in cloud computing."
                required
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredLearningStyle">Preferred Learning Style (Optional)</Label>
              <Input
                id="preferredLearningStyle"
                name="preferredLearningStyle"
                placeholder="e.g., Visual, hands-on projects, video tutorials"
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      {state.error && (
         <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.learningPath && state.learningPath.length > 0 && (
        <div className='space-y-6'>
          <h2 className='text-2xl font-headline font-bold text-center'>Your Custom Learning Path</h2>
          {state.learningPath.map((module: LearningModule) => {
            const isCompleted = completedModules.has(module.title);
            return (
              <Card key={module.title} className={cn('transition-all', isCompleted && 'bg-muted/50')}>
                <CardHeader className='flex-row items-center justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='font-headline flex items-center gap-2'>
                        {isCompleted ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Book className="h-6 w-6 text-primary" />}
                        {module.title}
                    </CardTitle>
                    <CardDescription>Module resources and activities.</CardDescription>
                  </div>
                  {!isCompleted && <Button onClick={() => handleCompleteModule(module.title)} size="sm"><Check className='mr-2 h-4 w-4'/> Mark as Complete</Button>}
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full" defaultValue='resources'>
                    <AccordionItem value="resources">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                           <Book className="h-5 w-5" /> Learning Resources
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-6 space-y-2">
                          {module.resources.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                     {isCompleted && (
                        <>
                          <AccordionItem value="exercise">
                            <AccordionTrigger>
                               <div className="flex items-center gap-2">
                                    <ListChecks className="h-5 w-5" /> Visual Hands-on Exercise
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <HandsOnExercise exercise={module.handsOnExercise} />
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="flashcards">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" /> Flashcards
                                </div>
                            </AccordionTrigger>
                             <AccordionContent>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {module.flashcards.map((flashcard, index) => (
                                        <Flashcard key={index} flashcard={flashcard} />
                                    ))}
                                </div>
                            </AccordionContent>
                          </AccordionItem>
                        </>
                     )}
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {state.miniProjectIdeas && state.miniProjectIdeas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Lightbulb />Mini-Project Ideas</CardTitle>
            <CardDescription>Here are some projects to practice your new skills.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {state.miniProjectIdeas.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

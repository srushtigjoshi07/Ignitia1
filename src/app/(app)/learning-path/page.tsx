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
import { Terminal } from 'lucide-react';

const initialState = {
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

      {(state.learningPath?.length > 0 || state.miniProjectIdeas?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Custom Path</CardTitle>
            <CardDescription>Here are the resources and projects we recommend for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              {state.learningPath.length > 0 && (
                <AccordionItem value="item-1">
                  <AccordionTrigger>Recommended Learning Resources</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {state.learningPath.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
              {state.miniProjectIdeas.length > 0 && (
                <AccordionItem value="item-2">
                  <AccordionTrigger>Mini-Project Ideas</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {state.miniProjectIdeas.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getSkillAssessment } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Star, Zap, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const test = {
  name: 'JavaScript Fundamentals',
  questions: [
    'What is the difference between `let`, `const`, and `var`?',
    'Explain the concept of closures in JavaScript.',
    'What are Promises and how do they work?',
    'Describe the event loop in JavaScript.',
    'What is the difference between `==` and `===`?',
  ],
};

const initialState = {
  skillProfile: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Assessing Your Skills...' : 'Submit Assessment'}
    </Button>
  );
}

export default function TakeSkillAssessmentPage() {
  const [state, formAction] = useActionState(getSkillAssessment, initialState);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Skill Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Test your knowledge in {test.name} to generate your skill profile.
        </p>
      </div>

      {!state.skillProfile ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{test.name}</CardTitle>
            <CardDescription>Answer the following questions to the best of your ability.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="testName" value={test.name} />
              <input type="hidden" name="questions" value={JSON.stringify(test.questions)} />
              {test.questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`answer-${index}`}>{`${index + 1}. ${question}`}</Label>
                  <Textarea
                    id={`answer-${index}`}
                    name={`answer-${index}`}
                    placeholder="Your answer..."
                    required
                    rows={3}
                    suppressHydrationWarning
                  />
                </div>
              ))}
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-center">Your Skill Profile</CardTitle>
            <CardDescription className="text-center">Here is the analysis of your assessment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-5xl font-bold">{state.skillProfile.overallScore}</p>
                <Progress value={state.skillProfile.overallScore} className="w-1/2 mx-auto mt-2 h-2" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center justify-center gap-2"><Star className="h-5 w-5"/>Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {state.skillProfile.strengths.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center justify-center gap-2"><Zap className="h-5 w-5"/>Weaknesses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {state.skillProfile.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center justify-center gap-2"><Target className="h-5 w-5"/>Recommendations</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {state.skillProfile.recommendations.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
             <Button onClick={() => window.location.reload()} className="w-full">Take Assessment Again</Button>
          </CardContent>
        </Card>
      )}

      {state.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

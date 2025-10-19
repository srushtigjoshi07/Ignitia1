'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';


const tests = [
    {
        name: 'JavaScript Fundamentals',
        description: 'Test your knowledge of core JavaScript concepts.',
        duration: '15 minutes',
        questions: 5,
    },
    {
        name: 'React & State Management',
        description: 'Assess your skills in React, hooks, and state management.',
        duration: '20 minutes',
        questions: 7,
    },
    {
        name: 'Next.js & App Router',
        description: 'Challenge your understanding of the Next.js App Router.',
        duration: '10 minutes',
        questions: 4,
    }
]

export default function SkillAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Skill Assessments</h1>
        <p className="text-muted-foreground mt-2">
          Choose an assessment to test your knowledge and generate your skill profile.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle className='font-headline'>{test.name}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                    <div className='flex justify-between'>
                        <span>Duration:</span>
                        <span>{test.duration}</span>
                    </div>
                     <div className='flex justify-between'>
                        <span>Questions:</span>
                        <span>{test.questions}</span>
                    </div>
                </CardContent>
                <CardContent>
                    <Button asChild className='w-full'>
                        <Link href="/skill-assessment/take">Start Assessment</Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

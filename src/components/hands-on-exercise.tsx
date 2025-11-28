'use client';

import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type Exercise = {
    title: string;
    description: string;
    steps: string[];
};

export function HandsOnExercise({ exercise }: { exercise: Exercise }) {
    return (
        <Card className="bg-background">
            <CardHeader>
                <CardTitle className='font-headline'>{exercise.title}</CardTitle>
                <CardDescription>{exercise.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ol className="space-y-4">
                    {exercise.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-4">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-1">
                                {index + 1}
                           </div>
                           <p className='text-sm'>{step}</p>
                        </li>
                    ))}
                </ol>
            </CardContent>
        </Card>
    );
}

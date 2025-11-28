'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const allTests = [
    {
        name: 'JavaScript Fundamentals',
        description: 'Test your knowledge of core JavaScript concepts.',
        duration: '15 minutes',
        questions: 5,
        tags: ['javascript', 'js', 'fundamentals'],
    },
    {
        name: 'React & State Management',
        description: 'Assess your skills in React, hooks, and state management.',
        duration: '20 minutes',
        questions: 7,
        tags: ['react', 'state management', 'hooks'],
    },
    {
        name: 'Next.js & App Router',
        description: 'Challenge your understanding of the Next.js App Router.',
        duration: '10 minutes',
        questions: 4,
        tags: ['next.js', 'app router', 'react'],
    },
    {
        name: 'UI/UX Design Principles',
        description: 'Evaluate your knowledge of fundamental UI/UX design principles.',
        duration: '15 minutes',
        questions: 6,
        tags: ['ui', 'ux', 'design'],
    },
    {
        name: 'Python for Data Science',
        description: 'Test your Python skills for data manipulation and analysis.',
        duration: '25 minutes',
        questions: 8,
        tags: ['python', 'data science', 'pandas', 'numpy'],
    },
    {
        name: 'Node.js & Express',
        description: 'Assess your backend development skills with Node.js and Express.',
        duration: '20 minutes',
        questions: 7,
        tags: ['node.js', 'express', 'backend', 'api'],
    }
];

export default function SkillAssessmentPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [recommendedTests, setRecommendedTests] = useState<typeof allTests>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && firestore) {
      const fetchSkillsAndFilterTests = async () => {
        setLoading(true);
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const userSkills = (userData.currentSkills || '').toLowerCase();
          
          if (userSkills) {
            const filteredTests = allTests.filter(test => 
              test.tags.some(tag => userSkills.includes(tag))
            );
            setRecommendedTests(filteredTests.length > 0 ? filteredTests : allTests);
          } else {
            // If no skills are defined, show all tests
            setRecommendedTests(allTests);
          }
        } else {
          // If no user profile, show all tests
          setRecommendedTests(allTests);
        }
        setLoading(false);
      };
      fetchSkillsAndFilterTests();
    } else if (user === null) {
      // Not logged in
      setRecommendedTests(allTests);
      setLoading(false);
    }
  }, [user, firestore]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Skill Assessments</h1>
        <p className="text-muted-foreground mt-2">
          Choose an assessment to test your knowledge and generate your skill profile.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className='space-y-2'>
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          recommendedTests.map((test, index) => (
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
          ))
        )}
        {!loading && recommendedTests.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
                <p>No recommended tests based on your profile. You can add skills in your profile or browse all tests.</p>
                <Button variant="link" asChild><Link href="/profile">Go to Profile</Link></Button>
            </div>
        )}
      </div>
    </div>
  );
}

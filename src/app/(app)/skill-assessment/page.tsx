'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

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

const certificationExams = [
    {
        name: 'Certified JavaScript Developer',
        provider: 'OpenJS Foundation',
        description: 'Validates your competence in JavaScript (Node.js).',
        tags: ['javascript', 'node.js', 'js'],
    },
    {
        name: 'AWS Certified Cloud Practitioner',
        provider: 'Amazon Web Services',
        description: 'Foundational understanding of AWS Cloud concepts, services, and terminology.',
        tags: ['aws', 'cloud'],
    },
    {
        name: 'Google Certified Professional - Cloud Architect',
        provider: 'Google Cloud',
        description: 'Demonstrate your ability to design, develop, and manage robust, secure, and scalable cloud solutions.',
        tags: ['gcp', 'google cloud', 'cloud', 'architect'],
    },
    {
        name: 'Certified Associate in Python Programming (PCAP)',
        provider: 'Python Institute',
        description: 'Measures your ability to accomplish coding tasks related to the basics of programming in the Python language.',
        tags: ['python'],
    },
    {
        name: 'Certified React Developer',
        provider: 'React Training',
        description: 'Validate your expertise in React and its core principles.',
        tags: ['react', 'javascript'],
    }
];


export default function SkillAssessmentPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [recommendedTests, setRecommendedTests] = useState<typeof allTests>([]);
  const [recommendedCerts, setRecommendedCerts] = useState<typeof certificationExams>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && firestore) {
      const fetchSkillsAndFilter = async () => {
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

            const filteredCerts = certificationExams.filter(cert =>
                cert.tags.some(tag => userSkills.includes(tag))
            );
            setRecommendedCerts(filteredCerts.length > 0 ? filteredCerts : certificationExams);
          } else {
            // If no skills are defined, show all
            setRecommendedTests(allTests);
            setRecommendedCerts(certificationExams);
          }
        } else {
          // If no user profile, show all
          setRecommendedTests(allTests);
          setRecommendedCerts(certificationExams);
        }
        setLoading(false);
      };
      fetchSkillsAndFilter();
    } else if (user === null) {
      // Not logged in, show all
      setRecommendedTests(allTests);
      setRecommendedCerts(certificationExams);
      setLoading(false);
    }
  }, [user, firestore]);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Skill Hub</h1>
        <p className="text-muted-foreground mt-2">
          Test your knowledge, find recommended certifications, and take your skills to the next level.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-headline font-bold mb-4">Skill Assessments</h2>
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
      
      <div>
        <h2 className="text-2xl font-headline font-bold mb-4">National & International Certifications</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className='space-y-4'>
                  <Skeleton className="h-5 w-1/3" />
                  <div className='flex gap-2'>
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardContent>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            recommendedCerts.map((cert, index) => (
                <Card key={index} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className='font-headline flex items-center gap-2'><Award className="h-6 w-6 text-primary"/>{cert.name}</CardTitle>
                        <CardDescription>{cert.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div>
                            <Badge variant="secondary">{cert.provider}</Badge>
                        </div>
                       <div className="flex flex-wrap gap-2">
                            {cert.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                       </div>
                    </CardContent>
                    <CardContent>
                        <Button className='w-full' variant="outline">
                           Learn More
                        </Button>
                    </CardContent>
                </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

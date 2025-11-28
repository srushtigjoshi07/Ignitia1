'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

type FlashcardProps = {
    flashcard: {
        question: string;
        answer: string;
    };
};

export function Flashcard({ flashcard }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="perspective-1000 w-full h-48">
            <Card
                className={cn(
                    'relative w-full h-full transform-style-3d transition-transform duration-700 cursor-pointer',
                    isFlipped ? 'rotate-y-180' : ''
                )}
                onClick={handleFlip}
            >
                {/* Front of the card */}
                <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-4 text-center">
                   <p className="font-semibold text-sm">{flashcard.question}</p>
                </div>

                {/* Back of the card */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-secondary text-secondary-foreground flex flex-col justify-center items-center p-4 text-center">
                    <p className="text-sm">{flashcard.answer}</p>
                </div>
            </Card>
        </div>
    );
}

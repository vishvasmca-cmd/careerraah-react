'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { getCareerQuestionAnswerAction } from '@/lib/actions';
import type { GenerateCareerReportInput } from '@/ai/schemas/career-report';

const predefinedQuestions = [
  'Create a Year-by-Year Roadmap to my first job.',
  'What specific skills should I start learning today?',
  'Give me a list of free resources (YouTube, Coursera) to get started.',
  'What are some realistic backup plans if my main goal fails?',
  'Write a note for my parents explaining the value of these career paths.',
];

type ChatMessage = {
  id: number;
  type: 'question' | 'answer' | 'error';
  text: string;
  isLoading?: boolean;
};

export function InteractiveChat({ assessmentData }: { assessmentData: GenerateCareerReportInput }) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);

  const handleQuestionClick = (question: string) => {
    const questionId = Date.now();
    const newQuestion: ChatMessage = { id: questionId, type: 'question', text: question };
    const loadingAnswer: ChatMessage = { id: questionId + 1, type: 'answer', text: '', isLoading: true };

    setChatHistory(prev => [...prev, newQuestion, loadingAnswer]);
    setAskedQuestions(prev => [...prev, question]);

    startTransition(async () => {
      const result = await getCareerQuestionAnswerAction(assessmentData, question);
      
      let finalAnswer: ChatMessage;
      if (result.answer) {
        finalAnswer = { id: questionId + 1, type: 'answer', text: result.answer };
      } else {
        finalAnswer = { id: questionId + 1, type: 'error', text: result.error || 'Sorry, I could not process that request.' };
      }
      
      setChatHistory(prev => prev.map(msg => msg.id === finalAnswer.id ? finalAnswer : msg));
    });
  };

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-xl font-bold font-headline flex items-center gap-2">
        <Wand2 className="text-primary"/>
        Ask Follow-up Questions
      </h3>
      <p className="text-muted-foreground mt-1">
        Click a question below to get a detailed, AI-powered answer.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {predefinedQuestions.map((q, i) => (
          <Button
            key={i}
            variant="outline"
            className="justify-start text-left h-auto py-2"
            onClick={() => handleQuestionClick(q)}
            disabled={isPending || askedQuestions.includes(q)}
          >
            {q}
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {chatHistory.map(msg => (
          <div key={msg.id}>
            {msg.type === 'question' && (
              <p className="font-semibold text-foreground">{msg.text}</p>
            )}
            {msg.type === 'answer' && (
              <Card className="bg-secondary/20">
                <CardContent className="p-4">
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}
                    />
                  )}
                </CardContent>
              </Card>
            )}
             {msg.type === 'error' && (
                <p className="text-sm text-red-500">{msg.text}</p>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}


'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Send } from 'lucide-react';
import { getCareerQuestionAnswerAction } from '@/lib/actions';
import type { GenerateCareerReportInput } from '@/ai/schemas/career-report';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';

const predefinedQuestions = [
  'Create a Year-by-Year Roadmap to my first job.',
  'What specific skills should I start learning today?',
  'Give me a list of free resources to get started.',
  'What are some realistic backup plans?',
  'Write a note for my parents about these careers.',
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
  const [inputValue, setInputValue] = useState('');
  const { language } = useTranslation();

  const handleQuestionSubmit = (question: string) => {
    if (!question.trim() || isPending) return;

    const questionId = Date.now();
    const newQuestion: ChatMessage = { id: questionId, type: 'question', text: question };
    const loadingAnswer: ChatMessage = { id: questionId + 1, type: 'answer', text: '', isLoading: true };

    setChatHistory(prev => [...prev, newQuestion, loadingAnswer]);
    setInputValue('');

    startTransition(async () => {
      const result = await getCareerQuestionAnswerAction(assessmentData, question, language);
      
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
        Talk to our career expert
      </h3>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {predefinedQuestions.map((q, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className="text-left"
            onClick={() => handleQuestionSubmit(q)}
            disabled={isPending}
          >
            {q}
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2">
        {chatHistory.map(msg => (
          <div key={msg.id}>
            {msg.type === 'question' && (
              <p className="font-semibold text-foreground text-right">You: {msg.text}</p>
            )}
            {msg.type === 'answer' && (
              <Card className="bg-secondary/20">
                <CardContent className="p-4">
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Raah is thinking...</span>
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
      
      <div className="mt-4 flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type your question here..."
          disabled={isPending}
          onKeyDown={e => e.key === 'Enter' && handleQuestionSubmit(inputValue)}
        />
        <Button onClick={() => handleQuestionSubmit(inputValue)} disabled={isPending || !inputValue.trim()} size="icon">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send</span>
        </Button>
      </div>

    </div>
  );
}

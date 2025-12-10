
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Send, User, BrainCircuit } from 'lucide-react';
import { getCareerQuestionAnswerAction } from '@/lib/actions';
import type { GenerateCareerReportInput } from '@/ai/schemas/career-report';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const predefinedQuestions = [
  'Create a Year-by-Year Roadmap to my first job.',
  'What specific skills should I start learning today?',
  'Give me a list of free resources to get started.',
  'What are some realistic backup plans?',
  'Write a note for my parents about these careers.',
];

type ChatMessage = {
  id: number;
  role: 'user' | 'bot';
  text: string;
  isLoading?: boolean;
};

export function InteractiveChat({ assessmentData }: { assessmentData: GenerateCareerReportInput }) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const { language } = useTranslation();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleQuestionSubmit = (question: string) => {
    if (!question.trim() || isPending) return;

    const questionId = Date.now();
    const newUserMessage: ChatMessage = { id: questionId, role: 'user', text: question };
    const loadingAnswer: ChatMessage = { id: questionId + 1, role: 'bot', text: '', isLoading: true };

    setChatHistory(prev => [...prev, newUserMessage, loadingAnswer]);
    setInputValue('');

    startTransition(async () => {
      const result = await getCareerQuestionAnswerAction(assessmentData, question, language);

      let finalAnswer: ChatMessage;
      if (result.answer) {
        finalAnswer = { id: questionId + 1, role: 'bot', text: result.answer };
      } else {
        finalAnswer = { id: questionId + 1, role: 'bot', text: result.error || 'Sorry, I could not process that request.' };
      }

      setChatHistory(prev => prev.map(msg => msg.id === finalAnswer.id ? finalAnswer : msg));
    });
  };

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-xl font-bold font-headline flex items-center gap-2">
        <Wand2 className="text-primary" />
        Ask Anything About Your Dream Career
      </h3>
      <p className="text-sm text-muted-foreground mb-4">Your magical AI mentor is ready to help!</p>

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

      <div ref={chatContainerRef} className="mt-6 space-y-6 max-h-96 overflow-y-auto pr-2 bg-secondary/20 p-4 rounded-lg">
        {chatHistory.map(msg => (
          <div key={msg.id} className={cn("flex items-start gap-3", { 'justify-end': msg.role === 'user' })}>
            {msg.role === 'bot' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <BrainCircuit size={18} />
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn(
              "max-w-sm rounded-lg px-4 py-2",
              {
                'bg-primary text-primary-foreground rounded-br-none': msg.role === 'user',
                'bg-background border rounded-bl-none': msg.role === 'bot'
              }
            )}>
              {msg.isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Raah is thinking...</span>
                </div>
              ) : (
                <div
                  className="prose prose-sm max-w-none text-inherit prose-p:my-2"
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}
                />
              )}
            </div>

            {msg.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User size={18} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {chatHistory.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Hi {assessmentData.userName}, do you have any questions about your report? Ask me anything!</p>
          </div>
        )}
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

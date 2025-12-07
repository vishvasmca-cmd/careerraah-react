'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type FormData = z.infer<typeof formSchema>;

type Message = {
  role: 'user' | 'agent';
  text: string;
};

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, setIsPending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Use `scrollHeight` to get the total height of the content
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [messages]);

  const onSubmit = (values: FormData) => {
    const userMessage: Message = { role: 'user', text: values.message };
    setMessages(prev => [...prev, userMessage]);
    setIsPending(true);
    form.reset();

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = { role: 'agent', text: "I'm sorry, I'm not fully connected yet. Please check back later!" };
      setMessages(prev => [...prev, agentMessage]);
      setIsPending(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'agent' && (
                <div className="p-2 rounded-full bg-primary text-primary-foreground">
                    <Bot size={20} />
                </div>
              )}
              <Card
                className={cn(
                  'max-w-[75%]',
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <CardContent className="p-3">
                  <p>{message.text}</p>
                </CardContent>
              </Card>
              {message.role === 'user' && (
                <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                    <User size={20} />
                </div>
              )}
            </div>
          ))}
           {isPending && (
            <div className="flex items-start gap-3 justify-start">
              <div className="p-2 rounded-full bg-primary text-primary-foreground">
                <Bot size={20} />
              </div>
              <Card className="bg-muted">
                <CardContent className="p-3 flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Thinking...</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Ask the agent anything..." {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

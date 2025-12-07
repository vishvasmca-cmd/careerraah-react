'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAssessmentAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters long.'),
  answer: z.string().min(10, 'Answer must be at least 10 characters long.'),
});

type FormData = z.infer<typeof formSchema>;

export function AssessmentForm() {
  const [assessment, setAssessment] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  const onSubmit = (values: FormData) => {
    setAssessment(null);
    startTransition(async () => {
      const result = await getAssessmentAction(values.question, values.answer);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Assessment Failed",
          description: result.error,
        });
      } else {
        setAssessment(result.assessment ?? null);
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Create Your Assessment</CardTitle>
            <CardDescription>Enter a question and an answer to get feedback from our AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Explain the process of photosynthesis." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Your Answer</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide a detailed answer here..." {...field} rows={8} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto" size="lg">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assessing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Assessment
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isPending || assessment) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary"/>
              AI Assessment Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
               <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </div>
            ) : (
              <div className="prose prose-lg max-w-none text-foreground">
                 <p className="whitespace-pre-wrap font-body">{assessment}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

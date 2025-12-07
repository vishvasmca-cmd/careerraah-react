import { AssessmentForm } from '@/components/assessment/AssessmentForm';

export default function AssessmentPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 md:px-6 lg:py-12 fade-in">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl text-foreground">
          AI Assessment Tool
        </h1>
        <p className="mt-3 text-muted-foreground md:text-xl">
          Get instant, AI-powered feedback on your understanding of any topic.
        </p>
      </div>
      <AssessmentForm />
    </div>
  );
}

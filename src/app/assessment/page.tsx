import { MultiStepAssessment } from '@/components/assessment/MultiStepAssessment';

export default function AssessmentPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 md:px-6 lg:py-12 fade-in">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl text-foreground">
          Student Assessment
        </h1>
        <p className="mt-3 text-muted-foreground md:text-xl">
          Let&apos;s find the right career path for you.
        </p>
      </div>
      <MultiStepAssessment />
    </div>
  );
}

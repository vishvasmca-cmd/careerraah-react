import { MultiStepAssessment } from '@/components/assessment/MultiStepAssessment';

export default function AssessmentPage({ searchParams }: { searchParams?: { role?: string } }) {
  const role = searchParams?.role || 'student';
  
  return (
    <div className="relative isolate min-h-full">
       <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
      <div className="container mx-auto max-w-3xl py-8 px-4 md:px-6 lg:py-12 fade-in">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl text-foreground">
            {role === 'parent' ? "Child's Assessment" : 'Student Assessment'}
          </h1>
          <p className="mt-3 text-muted-foreground md:text-xl">
            Let&apos;s find the right career path for {role === 'parent' ? 'your child' : 'you'}.
          </p>
        </div>
        <MultiStepAssessment userRole={role} />
      </div>
    </div>
  );
}

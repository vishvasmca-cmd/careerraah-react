import { AgentChat } from '@/components/agent/AgentChat';

export default function AgentPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 md:px-6 lg:py-12 fade-in h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl text-foreground">
          Agent Mode
        </h1>
        <p className="mt-3 text-muted-foreground md:text-xl">
          Have a conversation with our knowledgeable AI assistant.
        </p>
      </div>
      <AgentChat />
    </div>
  );
}

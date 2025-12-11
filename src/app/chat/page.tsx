
import { Suspense } from 'react';
import OnboardingChat from '@/components/chat/OnboardingChat';

export default function ChatPage({ searchParams }: { searchParams: { q?: string } }) {
    const question = searchParams.q || "How do I choose the right career?";

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 py-12 px-4">
            <div className="container mx-auto">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <OnboardingChat initialQuestion={question} />
                </Suspense>
            </div>
        </div>
    );
}

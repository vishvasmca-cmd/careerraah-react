
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Send, Sparkles, User, UserCircle } from 'lucide-react';
import { askMentorAction } from '@/lib/actions';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from '@/hooks/use-translation';

export const dynamic = 'force-dynamic';

type Message = {
    role: 'user' | 'ai';
    content: string;
    suggestions?: string[];
};

function ChatInterface() {
    const { language } = useTranslation();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q');
    const guestName = searchParams.get('name');
    const guestRole = searchParams.get('role');
    const { user, isUserLoading } = useFirebase();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial load logic
    useEffect(() => {
        if (!hasStarted && initialQuery && !isUserLoading) {
            setHasStarted(true);
            handleSendMessage(initialQuery);
        }
    }, [initialQuery, hasStarted, isUserLoading]);

    // Auth check - Optional? User said "redirect to login", so we assume strict auth.
    // But maybe for a "Search" feature, we let them see the public page first?
    // User instructions: "Once clicked on Try button , it will redirect to Login page and then create new page Seach results".
    // This implies they ARE logged in when they reach here.
    useEffect(() => {
        if (!isUserLoading && !user) {
            // If no Firebase user, check if we have URL params (guest mode). 
            // If we are just arriving with no info, maybe redirect. 
            // But for now, let's allow "Guest" access or rely on the previous page sending them here.
            // Actually, let's NOT redirect automatically. If they are here, they can use it.
            // If we strictly want to force login, we would keep this.
            // But since we have a "Continue" button for simple name entry, we must support non-user access.
            // Removing the auto-redirect for now to allow Guest flow.
        }
    }, [user, isUserLoading, router, initialQuery]);


    async function handleSendMessage(text: string) {
        if (!text.trim()) return;

        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const currentUserName = user?.displayName || guestName || 'Friend';
        const currentUserRole = guestRole || 'Student';

        try {
            const result = await askMentorAction(
                text,
                language,
                currentUserName,
                currentUserRole
            );

            if (result.error) {
                setMessages(prev => [...prev, { role: 'ai', content: "I'm having a little trouble thinking right now. Can you try asking again?" }]);
            } else if (result.response) {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: result.response.answer,
                    suggestions: result.response.followUpQuestions
                }]);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'ai', content: "Oops, something went wrong. Let's try that again!" }]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        handleSendMessage(suggestion);
    };

    // Only show full page loader if we are ACTUALLY loading user state AND we don't have guest info.
    // If we have guest info, we let them in immediately.
    const isGuest = !!guestName;
    if (isUserLoading && !isGuest) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    // If not loading, and no user and no guest name... technically we should've redirected or shown login.
    // But let's allow them to see the page (maybe empty state) or just fallback to "Friend".

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">CareerRaah Mentor</h1>
                        <p className="text-gray-500">Ask anything about your dream career!</p>
                    </div>
                </div>

                {/* Chat Area */}
                <Card className="min-h-[600px] flex flex-col shadow-xl border-t-4 border-t-purple-500">
                    <CardContent className="flex-grow p-6 overflow-y-auto max-h-[600px] space-y-6 bg-white/50">
                        {messages.length === 0 && !isLoading && (
                            <div className="text-center text-gray-400 mt-20">
                                <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-xl">What do you want to be when you grow up?</p>
                                <div className="mt-8 flex flex-wrap justify-center gap-2">
                                    {["I want to be a pilot", "How do I become a game designer?", "What does a scientist do?"].map(q => (
                                        <Button key={q} variant="outline" onClick={() => handleSendMessage(q)}>{q}</Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} `}>
                                <div className={`flex max - w - [80 %] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items - start gap - 3`}>

                                    <div className={`flex - shrink - 0 h - 10 w - 10 rounded - full flex items - center justify - center ${msg.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'} `}>
                                        {msg.role === 'user' ? <User className="h-6 w-6 text-blue-600" /> : <Sparkles className="h-6 w-6 text-purple-600" />}
                                    </div>

                                    <div className={`p - 4 rounded - 2xl text - lg ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-purple-50 border shadow-sm rounded-tl-none text-gray-900'} `}>
                                        <div className="prose prose-neutral max-w-none">
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                        {msg.suggestions && (
                                            <div className="mt-4 pt-4 border-t gap-2 flex flex-wrap">
                                                <p className="w-full text-xs font-semibold text-gray-500 mb-2">TRY ASKING:</p>
                                                {msg.suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSuggestionClick(s)}
                                                        className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100 hover:bg-purple-100 transition"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
                                    </div>
                                    <div className="bg-white border shadow-sm p-4 rounded-2xl rounded-tl-none">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
                            className="flex gap-2 relative"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask another question..."
                                className="pr-12 py-6 text-lg rounded-full shadow-inner bg-gray-50 border-gray-200 focus:ring-purple-500 text-gray-900"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-2 top-1.5 rounded-full h-10 w-10 bg-purple-600 hover:bg-purple-700"
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default function MentorChatPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <ChatInterface />
        </Suspense>
    );
}



'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot, User, MapPin, GraduationCap } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { getOnboardingAnswerAction } from '@/lib/onboarding-actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
    id: number;
    role: 'user' | 'bot';
    text: string;
    suggestions?: string[];
};

export default function OnboardingChat({ initialQuestion }: { initialQuestion: string }) {
    const { user } = useFirebase();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [step, setStep] = useState<'grade' | 'location' | 'answering' | 'done'>('grade');
    const [formData, setFormData] = useState({ grade: '', location: '' });
    const [followUpCount, setFollowUpCount] = useState(0); // Track follow-up questions
    const [isPending, startTransition] = useTransition();
    const scrollRef = useRef<HTMLDivElement>(null);


    // Initial Greeting
    useEffect(() => {
        if (messages.length === 0) {
            const userName = user?.displayName?.split(' ')[0] || 'there';
            const isParent = user?.email?.includes('parent'); // Simple role detection

            if (initialQuestion) {
                // Scenario A: User came from Homepage with a question
                const gradeQuestion = isParent
                    ? "To give you the best career advice, could you tell me which **Class/Grade** your child is in?"
                    : "To give you the best career advice, could you tell me which **Class/Grade** you are in?";

                setMessages([
                    {
                        id: 1,
                        role: 'bot',
                        text: `Namaste ${userName}! 🙏\n\nI see you're asking: **"${initialQuestion}"**\n\n${gradeQuestion}`
                    }
                ]);
            } else {
                // Scenario B: User came directly to /chat (No question yet)
                setMessages([
                    {
                        id: 1,
                        role: 'bot',
                        text: `Namaste ${userName}! 🙏\n\nI'm Raah, your Career Guide. What career question can I help you with today?`,
                        suggestions: [
                            "What are the best Engineering colleges in India?",
                            "How to become a Pilot after Class 12?",
                            "Top Commerce colleges in Delhi without Maths?",
                            "What is the scope of AI in future careers?",
                            "Best high-paying career options in Arts?"
                        ]
                    }
                ]);
                setStep('done'); // Skip straight to asking
            }
        }
    }, [initialQuestion, user]);

    // Handle initial question step skipping
    useEffect(() => {
        if (!initialQuestion && step === 'grade') {
            setStep('done'); // Allow user to type first question freely
        }
    }, [initialQuestion, step]);


    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Add User Message
        const userMsg: Message = { id: Date.now(), role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        if (step === 'grade') {
            setFormData(prev => ({ ...prev, grade: text }));
            setStep('location');
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: `Got it! And which **City** or **Location** are you from?`
                }]);
            }, 600);
        } else if (step === 'location') {
            const updatedData = { ...formData, location: text };
            setFormData(updatedData);
            setStep('answering');

            // Show thinking state
            const loadingId = Date.now() + 2;
            setMessages(prev => [...prev, {
                id: loadingId,
                role: 'bot',
                text: 'Thinking...' // Placeholder
            }]);

            // Call AI
            startTransition(async () => {
                const response = await getOnboardingAnswerAction({
                    userName: user?.displayName || 'Student',
                    userQuestion: initialQuestion,
                    grade: formData.grade, // Use previously stored grade
                    location: text, // Use current input as location
                    language: 'en'
                });

                setMessages(prev => {
                    // Remove loading message
                    const filtered = prev.filter(m => m.id !== loadingId);

                    if (response.error) {
                        return [...filtered, { id: Date.now(), role: 'bot', text: response.error }];
                    }

                    if (response.data) {
                        return [...filtered, {
                            id: Date.now(),
                            role: 'bot',
                            text: response.data.answer,
                            suggestions: response.data.followUpQuestions
                        }];
                    }
                    return filtered;
                });
                setStep('done');
            });
        } else if (step === 'done') {
            // Allow up to 5 follow-up questions
            if (followUpCount >= 5) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: "That's a great follow-up! To explore deeply, let's create your full career report on the dashboard."
                }]);
                return;
            }

            // Process follow-up question
            setFollowUpCount(prev => prev + 1);
            setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: text }]);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: 'Thinking...' }]);

            startTransition(async () => {
                const response = await getOnboardingAnswerAction({
                    userName: user?.displayName || 'there',
                    userQuestion: text,
                    grade: formData.grade,
                    location: formData.location,
                    language: 'en'
                });

                setMessages(prev => {
                    const filtered = prev.filter(m => m.text !== 'Thinking...');
                    if (response.error) {
                        return [...filtered, {
                            id: Date.now(),
                            role: 'bot',
                            text: response.error
                        }];
                    }

                    if (response.data) {
                        return [...filtered, {
                            id: Date.now(),
                            role: 'bot',
                            text: response.data.answer,
                            suggestions: response.data.followUpQuestions
                        }];
                    }
                    return filtered;
                });
            });
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        handleSendMessage(suggestion);
    };

    return (
        <Card className="max-w-2xl mx-auto h-[600px] flex flex-col shadow-2xl border-purple-100 bg-white/80 backdrop-blur-md">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white rounded-t-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img
                        src="/raah-avatar.png"
                        alt="Raah - Career Counselor"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="font-bold text-lg">Raah - Career Counselor</h2>
                    <p className="text-xs text-purple-100">Your Personal Career Guide</p>
                </div>
            </div>

            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                        >
                            <div className={cn(
                                "flex flex-col gap-2 max-w-[80%]",
                                msg.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-purple-100 text-gray-900 rounded-tr-none text-base"
                                        : "bg-white border border-gray-100 text-gray-900 rounded-tl-none text-base"
                                )}>
                                    {msg.text === 'Thinking...' ? (
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Analyzing your profile...</span>
                                        </div>
                                    ) : (
                                        <div className="prose prose-sm max-w-none leading-relaxed" style={{ color: msg.role === 'bot' ? '#000000' : 'inherit' }} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                                    )}
                                </div>

                                {/* Chips / Suggestions */}
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {msg.suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSuggestionClick(s)}
                                                className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors text-left"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>

            <div className="p-4 border-t bg-gray-50/50">
                <div className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                            step === 'grade' ? "e.g., 10th, 12th, B.Tech..." :
                                step === 'location' ? "e.g., Mumbai, Delhi..." :
                                    "Type your message..."
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        disabled={messages.some(m => m.text === 'Thinking...')}
                        className="bg-white text-gray-900"
                        autoFocus
                    />
                    <Button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || messages.some(m => m.text === 'Thinking...')}
                        size="icon"
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

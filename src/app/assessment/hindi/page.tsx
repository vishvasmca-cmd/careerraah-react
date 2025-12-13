'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, RefreshCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import questionsData from '@/data/hindiAssessment.json';

// Define the scoring buckets
type Scores = {
    [key: string]: number;
};

const INITIAL_SCORES: Scores = {
    army: 0,
    police: 0,
    railway: 0,
    ssc_cgl: 0,
    ssc_chsl: 0,
    bank: 0,
    upsc: 0,
    state_pcs: 0,
    teaching: 0
};

export default function HindiAssessmentPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState<Scores>({ ...INITIAL_SCORES });
    const [showResult, setShowResult] = useState(false);
    const [winner, setWinner] = useState<{ name: string; score: number } | null>(null);

    // --- LOGIC ENGINE ---
    const handleAnswer = (option: any) => {
        const newScores = { ...scores };

        // 1. Apply Weights (Add/Subtract points)
        if (option.weights) {
            Object.entries(option.weights).forEach(([job, weight]) => {
                if (newScores[job] !== undefined) {
                    newScores[job] += Number(weight);
                }
            });
        }

        // 2. Apply Tags (Boost relevant jobs by +3)
        if (option.tags) {
            option.tags.forEach((tag: string) => {
                // Map generic tags to specific score keys if needed, or matches directly
                const key = tag.toLowerCase();
                // Simple mapping for tags that might not match keys exactly
                if (key.includes('army')) newScores.army += 3;
                if (key.includes('police')) newScores.police += 3;
                if (key.includes('railway')) newScores.railway += 3;
                if (key.includes('ssc')) newScores.ssc_chsl += 2;
                if (key.includes('bank')) newScores.bank += 3;
            });
        }

        // 3. HARD RULES (Disqualifications)
        // If Height is Short (Value from JSON Q4), kill Army/Police chances
        if (option.value === 'short') {
            newScores.army -= 100;
            newScores.police -= 100;
        }

        // If Financial Urgency is High, kill long-term exams
        if (option.value === 'urgent') {
            newScores.upsc -= 50;
            newScores.state_pcs -= 50;
        }

        setScores(newScores);

        // Move to next or finish
        if (currentQuestion < questionsData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateWinner(newScores);
        }
    };

    const calculateWinner = (finalScores: Scores) => {
        // Sort scores to find the highest
        const sorted = Object.entries(finalScores).sort(([, a], [, b]) => b - a);
        const topResult = sorted[0];

        setWinner({ name: formatCareerName(topResult[0]), score: topResult[1] });
        setShowResult(true);
    };

    const formatCareerName = (key: string) => {
        const names: { [key: string]: string } = {
            army: "Indian Army / Defence",
            police: "State Police (Constable/SI)",
            railway: "Indian Railways",
            ssc_cgl: "SSC CGL (Inspector Posts)",
            ssc_chsl: "SSC CHSL (Clerk/Data Entry)",
            bank: "Banking (PO/Clerk)",
            upsc: "Civil Services (UPSC)",
            state_pcs: "State PCS Officer",
            teaching: "Teaching (TET/B.Ed)"
        };
        return names[key] || key.toUpperCase();
    };

    // --- RENDER ---
    if (showResult && winner) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border-t-8 border-green-500">

                    <div className="mb-6 inline-flex p-4 bg-green-100 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h2 className="text-gray-500 font-medium mb-2">Based on your answers, your best match is:</h2>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                        {winner.name}
                    </h1>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left mb-8">
                        <h3 className="font-bold text-gray-800 mb-2">Why this?</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex gap-2">✅ Matches your qualification & height.</li>
                            <li className="flex gap-2">✅ Fits your financial timeline.</li>
                            <li className="flex gap-2">✅ Aligns with your subject strengths.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/sarkari-naukri"
                            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg"
                        >
                            See Active {winner.name} Jobs
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="block w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition"
                        >
                            Retake Test
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    const question = questionsData[currentQuestion];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-2">
                <div
                    className="bg-blue-600 h-2 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questionsData.length) * 100}%` }}
                ></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">

                {/* Question Card */}
                <div className="w-full">
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">
                        Question {currentQuestion + 1} of {questionsData.length}
                    </span>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {question.question_hindi}
                    </h2>
                    <p className="text-gray-500 text-lg mb-8 italic">
                        "{question.question_english}"
                    </p>

                    <div className="space-y-3">
                        {question.options.map((option: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className="w-full text-left p-4 md:p-5 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center justify-between"
                            >
                                <span className="font-medium text-gray-800 group-hover:text-blue-900 text-lg">
                                    {option.text}
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
                            </button>
                        ))}
                    </div>

                    {question.note && (
                        <div className="mt-6 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>Note: {question.note}</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

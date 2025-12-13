'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Filter, BookOpen, AlertCircle } from 'lucide-react';
import biharData from '@/../govt-jobs-engine/src/scrapers/bihar_papers.json';

// --- MOCK DATA (Replace with real DB later) ---
const MOCK_PAPERS = [
    // UP BOARD
    { id: 1, board: 'UP', class: '10th', subject: 'Maths (Ganit)', year: '2024', type: 'Previous Year', size: '2.4 MB' },
    { id: 2, board: 'UP', class: '10th', subject: 'Science (Vigyan)', year: '2025', type: 'Model Paper', size: '1.8 MB' },
    { id: 3, board: 'UP', class: '12th', subject: 'Physics (Bhautik)', year: '2024', type: 'Previous Year', size: '3.1 MB' },
    { id: 4, board: 'UP', class: '12th', subject: 'Hindi (General)', year: '2025', type: 'Model Paper', size: '1.2 MB' },

    // MP BOARD
    { id: 8, board: 'MP', class: '10th', subject: 'English Special', year: '2024', type: 'Previous Year', size: '1.5 MB' },
];

// Merge Mock with Scraped Data
// Note: We are filtering "Unknown Subject" which might be clutter from the scraper
const CLEAN_BIHAR_DATA = biharData
    .filter(p => !p.subject.includes('Unknown Subject'))
    .map(p => ({
        ...p,
        subject: p.subject.replace(/^\d+[\/\d]*-\s*/, ''), // removing IDs like 119- BIOLOGY
        size: '2.5 MB' // Keeping placeholder size
    }));

const ALL_PAPERS = [...MOCK_PAPERS, ...CLEAN_BIHAR_DATA];

export default function BoardPapersPage() {
    const [selectedBoard, setSelectedBoard] = useState('UP');
    const [selectedClass, setSelectedClass] = useState('10th');

    // Filter Logic
    const filteredPapers = ALL_PAPERS.filter(
        (p) => p.board === selectedBoard && p.class === selectedClass
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">

            {/* --- HERO SECTION --- */}
            <div className="bg-white border-b border-gray-200 pt-8 pb-12 px-4">
                <div className="container mx-auto max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-green-100">
                        <BookOpen className="w-3 h-3" />
                        Exam Preparation 2025
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Download Board Papers & <br />
                        <span className="text-blue-700">Previous Year Questions (PYQ)</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Sarkari Exams crack karne ke liye **Board Marks** matter karte hain.
                        Download the latest model papers for free.
                    </p>
                </div>
            </div>

            {/* --- FILTER TABS --- */}
            <div className="container mx-auto max-w-5xl px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">

                        {/* Board Selector */}
                        <div className="w-full md:w-auto">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Select Board</label>
                            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                                {['UP', 'Bihar', 'MP', 'CBSE'].map((board) => (
                                    <button
                                        key={board}
                                        onClick={() => {
                                            setSelectedBoard(board);
                                            // Default to 12th for Bihar since we scraped Inter papers mainly
                                            if (board === 'Bihar') setSelectedClass('12th');
                                        }}
                                        className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-all ${selectedBoard === board
                                                ? 'bg-white text-blue-700 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {board}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Class Selector */}
                        <div className="w-full md:w-auto">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Select Class</label>
                            <div className="flex gap-2">
                                {['10th', '12th'].map((cls) => (
                                    <button
                                        key={cls}
                                        onClick={() => setSelectedClass(cls)}
                                        className={`px-6 py-2 rounded-full border-2 text-sm font-bold transition-all ${selectedClass === cls
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                            }`}
                                    >
                                        {cls}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- PAPERS GRID --- */}
            <div className="container mx-auto max-w-5xl px-4 mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        {selectedBoard} Board - Class {selectedClass} Papers
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {filteredPapers.length} Files Found
                    </span>
                </div>

                {filteredPapers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPapers.map((paper) => (
                            <div key={paper.id} className="group bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-blue-300 relative overflow-hidden">
                                {/* Visual Strip */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${paper.type === 'Model Paper' ? 'bg-green-500' : 'bg-orange-500'}`}></div>

                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${paper.type === 'Model Paper' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                                            }`}>
                                            {paper.type}
                                        </span>
                                        <h3 className="font-bold text-gray-900 mt-2 text-lg line-clamp-2">{paper.subject}</h3>
                                        <p className="text-sm text-gray-500">Year: {paper.year}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded text-gray-400 group-hover:text-blue-600 transition">
                                        <Download className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
                                    <span className="text-xs text-gray-400 font-medium">{paper.size} • PDF</span>
                                    <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 inline-flex p-4 rounded-full mb-3">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900">No Papers Uploaded Yet</h3>
                        <p className="text-sm text-gray-500 mb-4">We are uploading papers for {selectedBoard} {selectedClass} daily.</p>
                        <button className="text-blue-600 font-bold hover:underline">Request a Paper via Chat</button>
                    </div>
                )}
            </div>

            {/* --- HELP SECTION --- */}
            <div className="container mx-auto max-w-5xl px-4 mt-16">
                <div className="bg-blue-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Can't find your paper?</h3>
                        <p className="text-blue-200 mb-6">
                            Ask our **Sarkari Saathi** to find it for you. Just type "Send me UP Board Maths Paper".
                        </p>
                        <Link href="/chat" className="bg-white text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-lg">
                            Ask AI Didi 🤖
                        </Link>
                    </div>
                    {/* Background Decorative Circles */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                </div>
            </div>

        </div>
    );
}

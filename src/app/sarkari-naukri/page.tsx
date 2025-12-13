'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types/job';
import { CalendarDays, MapPin, IndianRupee, Search, CheckCircle2, XCircle, HelpCircle, MessageCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import { JobFilters, FilterState } from '@/components/JobFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Helper to safely format dates
const safeFormatDate = (dateString: string | null | undefined, dateFormat: string) => {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        return format(date, dateFormat);
    } catch (e) {
        return dateString;
    }
};

const safeTimeAgo = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
        return '';
    }
}

const getJobSourceLabel = (job: Job) => {
    // 1. Priority: Explicit Official Website (from parser/AI)
    if (job.structured?.officialWebsite) {
        try {
            const hostname = new URL(job.structured.officialWebsite).hostname.replace('www.', '');
            return hostname;
        } catch (e) { }
    }

    // 2. Try to find Official Website in importantLinks (legacy fallback)
    const officialLink = job.structured?.importantLinks?.find((l: any) =>
        l.label?.toLowerCase().includes('official website') || l.label?.toLowerCase().includes('website')
    );
    if (officialLink?.url) {
        try {
            const hostname = new URL(officialLink.url).hostname.replace('www.', '');
            return hostname;
        } catch (e) { }
    }

    // 3. Try officialNotificationLink
    if (job.structured?.officialNotificationLink) {
        try {
            const hostname = new URL(job.structured.officialNotificationLink).hostname.replace('www.', '');
            return hostname;
        } catch (e) { }
    }

    // 4. Default Safe Fallback (Never show scraper name)
    return 'Official Notification';
};

// Helper Component (Moved outside to prevent re-renders)
const QuickFilterBadge = ({ label, active, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap
            ${active
                ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
    >
        {label}
    </button>
);

export default function SarkariNaukriPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        states: [],
        qualifications: [],
        physical: [],
        gender: [],
        selection: [],
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetching all jobs for now (client-side filtering)
                // In production, you'd want query params for server-side filtering
                const res = await fetch('http://localhost:3000/api/jobs?limit=100');
                if (!res.ok) throw new Error('Failed to fetch jobs');
                const data = await res.json();
                setJobs(data.data || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load jobs. Please ensure the Govt Jobs Engine is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter Logic
    const filteredJobs = jobs.filter(job => {
        const textData = JSON.stringify(job || {}).toLowerCase();
        const qual = (job.structured?.eligibility?.qualification || '').toLowerCase();
        const title = (job.title || '').toLowerCase();
        const loc = (job.structured?.location || '').toLowerCase();
        const search = searchQuery.toLowerCase();

        // Search Filter
        if (search && !textData.includes(search)) return false;

        // 1. State Filter
        if (filters.states.length > 0) {
            const hasState = filters.states.some(state => {
                const s = state.toLowerCase();
                return title.includes(s) || loc.includes(s) || textData.includes(s);
            });
            if (!hasState) return false;
        }

        // 2. Qualification Filter
        if (filters.qualifications.length > 0) {
            const hasQual = filters.qualifications.some(q => {
                const qLower = q.toLowerCase();
                if (qLower === '10th') return qual.includes('10th') || qual.includes('matric') || textData.includes('10th');
                if (qLower === '12th') return qual.includes('12th') || qual.includes('intermediate') || textData.includes('12th');
                if (qLower === 'graduate') return qual.includes('graduate') || qual.includes('degree') || qual.includes('bachelor');
                return qual.includes(qLower) || textData.includes(qLower);
            });
            if (!hasQual) return false;
        }

        // 3. Selection Type
        if (filters.selection.length > 0) {
            const hasSel = filters.selection.some(s => {
                const sLower = s.toLowerCase();
                return textData.includes(sLower);
            });
            if (!hasSel) return false;
        }

        // 4. Gender (Simple heuristic)
        if (filters.gender.length > 0) {
            if (filters.gender.includes('Female Eligible')) {
                if (textData.includes('male only') && !textData.includes('female')) return false;
                return true;
            }
        }

        // 5. Physical
        if (filters.physical.length > 0) {
            if (filters.physical.includes('Height Required')) {
                if (!textData.includes('height') && !textData.includes('cms')) return false;
            }
        }

        return true;
    });

    return (
        <div className="bg-[#F8F9FA] dark:bg-zinc-950 min-h-screen pb-20 font-sans">
            {/* 1. HERO SECTION (Split Screen) */}
            <section className="bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 pt-8 pb-12 overflow-hidden">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Content & Search */}
                        <div className="space-y-8 text-center md:text-left z-10 relative">
                            <div className="space-y-4">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1">
                                    Trusted by 10,000+ students from UP, Bihar & MP
                                </Badge>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-zinc-900 dark:text-zinc-50 leading-[1.15]">
                                    सही सरकारी नौकरी चुनिए <br />
                                    <span className="text-[#2874F0]">Guess नहीं, Data से</span>
                                </h1>
                                <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
                                    Find the right government job for you based on eligibility.
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="relative max-w-xl mx-auto md:mx-0 group shadow-lg rounded-full">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-[#2874F0] transition-colors" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="🔍 '10th ke baad govt job' | 'Police job'"
                                    className="pl-12 py-7 text-lg rounded-full border-zinc-200 focus-visible:ring-[#2874F0] bg-white text-zinc-900"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute inset-y-1.5 right-1.5">
                                    <Button size="lg" className="h-full rounded-full bg-[#2874F0] hover:bg-[#0056D2] text-white px-8">
                                        Search
                                    </Button>
                                </div>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" /> 100% Genuine
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Direct Links
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Fast Updates
                                </div>
                            </div>
                        </div>

                        {/* Right: Human Hero Image */}
                        <div className="relative hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent rounded-full opacity-50 blur-3xl transform translate-x-12 translate-y-12"></div>
                            {/* Image placed in public folder */}
                            <img
                                src="/student_hero.png"
                                alt="Happy Student getting Govt Job"
                                className="relative z-10 w-full max-w-md mx-auto object-contain drop-shadow-2xl md:scale-110 md:translate-y-8"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. POWER TOOLS GRID (New) */}
            <section className="container max-w-7xl mx-auto px-4 -mt-8 relative z-20 mb-12">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Tool 1 */}
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border-b-4 border-[#2874F0] hover:transform hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">👮‍♂️</span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Eligibility Check</h3>
                        <p className="text-sm text-zinc-500">Meri Height/Age check karo.</p>
                        <span className="text-[#2874F0] text-sm font-semibold mt-4 inline-block">Check Now &rarr;</span>
                    </div>

                    {/* Tool 2 */}
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border-b-4 border-green-500 hover:transform hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📄</span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Board Papers</h3>
                        <p className="text-sm text-zinc-500">UP/Bihar Board 2025 Model Papers.</p>
                        <span className="text-green-600 text-sm font-semibold mt-4 inline-block">Download PDF &rarr;</span>
                    </div>

                    {/* Tool 3 */}
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border-b-4 border-orange-500 hover:transform hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Exam Calendar</h3>
                        <p className="text-sm text-zinc-500">Agla bada exam kab hai?</p>
                        <span className="text-orange-600 text-sm font-semibold mt-4 inline-block">View Calendar &rarr;</span>
                    </div>
                </div>
            </section>

            {/* 3. LIVE FEED JOB LIST (Compact) */}
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Left Sidebar - Filters */}
                    <aside className="hidden md:block w-72 shrink-0 sticky top-24 self-start bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-zinc-800">Filters</h3>
                        <JobFilters filters={filters} setFilters={setFilters} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-6">
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Aaj ki Sarkari Naukriyan <span className="text-zinc-400 font-normal text-sm ml-1">(Live Updates)</span>
                            </h2>
                            <Button variant="outline" size="sm" className="hidden sm:flex">View All</Button>
                        </div>

                        {loading && (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-20 bg-zinc-200 animate-pulse rounded-lg"></div>
                                ))}
                            </div>
                        )}

                        {!loading && filteredJobs.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-zinc-300">
                                <h3 className="text-lg font-medium text-zinc-900">No jobs found matching your criteria.</h3>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 divide-y divide-zinc-100">
                            {filteredJobs.map((job) => {
                                // Clean title
                                const titleText = job.seo_content?.title || job.title;
                                const cleanTitle = titleText?.replace(/( – Apply Now| - Apply Now| \|.*|Sarkari Result|www\..*)/gi, '').trim();
                                const deadline = safeFormatDate(job.structured?.applicationEndDate, 'dd MMM');

                                return (
                                    <Link key={job.id} href={`/sarkari-naukri/${job.seo_content?.slug || job.id}`} className="block group">
                                        <div className="p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center hover:bg-blue-50/50 transition-colors">
                                            {/* Left: Job Info */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs mb-1">
                                                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">{job.department}</Badge>
                                                    <span className="text-zinc-400">•</span>
                                                    <span className="text-zinc-500">Last Date: <span className="text-red-600 font-medium">{deadline || 'Check Notice'}</span></span>
                                                </div>
                                                <h3 className="font-bold text-zinc-900 group-hover:text-[#2874F0] text-base sm:text-lg leading-snug">
                                                    {cleanTitle}
                                                </h3>
                                                <p className="text-xs text-zinc-500 line-clamp-1">
                                                    {job.structured?.eligibility?.qualification || 'Qualification details inside...'}
                                                </p>
                                            </div>

                                            {/* Right: Action */}
                                            <div className="flex items-center justify-between sm:block w-full sm:w-auto mt-2 sm:mt-0">
                                                <div className="sm:text-right">
                                                    <Button size="sm" className="w-full sm:w-auto bg-white border border-[#2874F0] text-[#2874F0] hover:bg-[#2874F0] hover:text-white rounded-lg shadow-sm font-semibold transition-all">
                                                        Check Eligibility
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

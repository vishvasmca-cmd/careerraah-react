'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft, ExternalLink, Calendar, Download,
    CheckCircle2, XCircle, HelpCircle, MapPin, IndianRupee,
    Briefcase, AlertCircle, Share2, Bookmark
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (!res.ok) throw new Error('Failed to fetch job details');
                const data = await res.json();
                setJob(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load job details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container py-10 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container py-10 text-center">
                <p className="text-red-500 mb-4">{error || 'Job not found'}</p>
                <Button asChild variant="outline">
                    <Link href="/sarkari-naukri">Back to Jobs</Link>
                </Button>
            </div>
        );
    }

    const { seo_content, structured } = job;
    const s = structured || {};

    // Determine content source priority
    const displayTitle = s.jobTitle || seo_content?.title || job.title;
    const summaryText = s.summary || job.hindi_summary || job.summary || "No summary available.";
    const departmentName = s.department || job.department || 'Government';

    // Links logic
    const applyLink = s.applyOnlineLink || job.url;
    const notificationLink = s.officialNotificationLink || job.pdf_url;
    const officialSite = s.officialWebsite;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Top Navigation Bar */}
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 px-4 py-3 shadow-sm">
                <div className="container max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/sarkari-naukri" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-medium">Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" title="Save Job">
                            <Bookmark className="h-5 w-5 text-zinc-500" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Share">
                            <Share2 className="h-5 w-5 text-zinc-500" />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="container max-w-4xl mx-auto py-8 px-4 space-y-8">

                {/* HEADER SECTION */}
                <header className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="bg-white border-zinc-300 text-zinc-700">
                            {departmentName}
                        </Badge>
                        <span className="text-sm text-zinc-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                        </span>
                        {/* Status Badge Placeholder */}
                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 ml-auto">
                            🟢 Eligible for you
                        </Badge>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold font-headline text-zinc-900 dark:text-zinc-50 leading-tight">
                        {displayTitle}
                    </h1>

                    {/* Key Highlights */}
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-500" />
                            {s.vacancies ? `${s.vacancies} Vacancies` : 'Multiple Vacancies'}
                        </div>
                        <div className="w-px h-4 bg-zinc-300 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-green-500" />
                            {s.salary || 'Best in Industry'}
                        </div>
                        <div className="w-px h-4 bg-zinc-300 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500" />
                            {s.location || 'All India'}
                        </div>
                    </div>
                </header>

                {/* 1. SIMPLE SUMMARY (Hindi/English) */}
                <section className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-3 text-zinc-900">
                        <FileText className="h-5 w-5 text-blue-600" />
                        नौकरी आसान भाषा में (Summary)
                    </h2>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
                        {summaryText}
                    </p>
                </section>

                {/* 2. WHO SHOULD APPLY / AVOID */}
                <section className="grid md:grid-cols-2 gap-6">
                    {/* Who Should Apply */}
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-100 dark:border-green-900/30">
                        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            कौन Apply करे?
                        </h3>
                        <ul className="space-y-3">
                            {s.decisionFactors?.whoShouldApply?.length > 0 ? (
                                s.decisionFactors.whoShouldApply.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-green-900 dark:text-green-100">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 shrink-0"></span>
                                        <span>{item}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-green-700/70 italic">
                                    AI is analyzing the perfect candidate profile...
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* Who Should NOT Apply */}
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-100 dark:border-red-900/30">
                        <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                            <XCircle className="h-5 w-5" />
                            कौन Apply न करे?
                        </h3>
                        <ul className="space-y-3">
                            {s.decisionFactors?.whoShouldNotApply?.length > 0 ? (
                                s.decisionFactors.whoShouldNotApply.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-red-900 dark:text-red-100">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                                        <span>{item}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-red-700/70 italic">
                                    AI is analyzing exclusion criteria...
                                </p>
                            )}
                        </ul>
                    </div>
                </section>

                {/* 3. ELIGIBILITY BREAKDOWN */}
                <section className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-zinc-900">
                        <HelpCircle className="h-5 w-5 text-purple-600" />
                        Eligibility Check
                    </h2>

                    <div className="space-y-6">
                        {/* Qualification */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 font-bold text-sm">
                                Edu
                            </div>
                            <div>
                                <h4 className="font-semibold text-zinc-900">Qualification Required</h4>
                                <p className="text-zinc-600 mt-1">
                                    {s.eligibility?.qualification || 'Check Notification'}
                                </p>
                            </div>
                        </div>

                        {/* Age */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 font-bold text-sm">
                                Age
                            </div>
                            <div>
                                <h4 className="font-semibold text-zinc-900">Age Limit</h4>
                                <p className="text-zinc-600 mt-1">
                                    {s.eligibility?.minAge && s.eligibility?.maxAge
                                        ? `${s.eligibility.minAge} to ${s.eligibility.maxAge} Years`
                                        : s.eligibility?.age || 'See Notification'}
                                </p>
                            </div>
                        </div>

                        {/* Experience */}
                        {s.eligibility?.experience && (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-sm">
                                    Exp
                                </div>
                                <div>
                                    <h4 className="font-semibold text-zinc-900">Experience</h4>
                                    <p className="text-zinc-600 mt-1">{s.eligibility.experience}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* IMPORTANT LINKS / CTA */}
                <section className="space-y-4">
                    <h3 className="font-bold text-zinc-900">Important Links</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {applyLink && (
                            <Button asChild size="lg" className="w-full text-base py-6 bg-[#22b6e4] hover:bg-[#1a9bc2]">
                                <a href={applyLink} target="_blank" rel="noopener noreferrer">
                                    Apply Online <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        )}

                        {notificationLink && (
                            <Button asChild size="lg" variant="outline" className="w-full text-base py-6 border-zinc-300">
                                <a href={notificationLink} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> Download Notification
                                </a>
                            </Button>
                        )}
                    </div>
                    {officialSite && (
                        <div className="text-center pt-2">
                            <a href={officialSite} target="_blank" className="text-sm text-blue-600 hover:underline inline-flex items-center">
                                Visit Official Website: {new URL(officialSite).hostname} <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </div>
                    )}
                </section>

                {/* RAW EXTRACTION FALLBACK REMOVED FOR LEGAL COMPLIANCE */}
                {/* If AI analysis is pending, we allow the structured fields above (even if empty) to handle the UI. */}
                {/* We strictly AVOID republishing raw text from scraper sources. */}
            </main>
        </div>
    );
}

// Helper icon component
function FileText(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <path d="M10 9H8" />
        </svg>
    )
}

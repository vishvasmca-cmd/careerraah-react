
'use client';

import { useContext, useState, useEffect } from 'react';
import { BlogList } from '@/components/blog/BlogList';
import { getBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { ArrowRight, BrainCircuit, Newspaper, PlayCircle, X, Search, ShieldCheck, CheckCircle2, MapPin, IndianRupee, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '@/types/job';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const videos = [
  {
    title: 'Exam Success (JEE/NEET)',
    description: 'Crack competitive exams with personalized planners.',
    imageUrl: '/images/student-north.png',
    imageHint: 'north indian student studying',
    isVideo: false,
  },
  {
    title: 'Future Ready Tech',
    description: 'Expert guidance for Engineering & IT careers.',
    imageUrl: '/images/student-south.png',
    imageHint: 'south indian student tech',
    isVideo: false,
  },
  {
    title: 'Creative & Arts',
    description: 'Explore Design, Media & Liberal Arts paths.',
    imageUrl: '/images/student-east.png',
    imageHint: 'east indian student creative',
    isVideo: false,
  },
  {
    title: 'Business & Startup',
    description: 'Learn about Commerce, MBA & Entrepreneurship.',
    imageUrl: '/images/student-west.png',
    imageHint: 'west indian student business',
    isVideo: false,
  }
];

export default function Home() {
  const posts = getBlogPosts();
  const { t } = useTranslation();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  // Job Fetching State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs?limit=5');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch homepage jobs:", error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const returnPath = `/chat?q=${encodeURIComponent(searchQuery)}`;
    // If we have a user, go directly there. Otherwise login first.
    // Note: checks against 'user' might be async, but for a simple button click this is usually fine 
    // if the auth state has settled. If auth is loading, 'user' is null, so it defaults to login flow which is safe.
    if (user) {
      router.push(returnPath);
    } else {
      router.push(`/login?returnPath=${encodeURIComponent(returnPath)}`);
    }
  };

  const featuredPosts = posts.filter(post => ['10', '16', '14'].includes(post.id));

  const handleCardClick = (video: (typeof videos)[0]) => {
    if (video.isVideo && 'videoUrl' in video) {
      setVideoUrl(video.videoUrl || null);
    } else if ('imageUrl' in video) {
      window.open(video.imageUrl, '_blank');
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-zinc-900">
      <main className="flex-grow">

        {/* 1. HERO SECTION (Split Screen) */}
        <section className="bg-white border-b border-zinc-100 pt-8 pb-16 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Content & Search */}
              <div className="space-y-8 text-center md:text-left z-10 relative">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1">
                    Trusted by 10,000+ students from UP, Bihar & MP
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-zinc-900 leading-[1.15]">
                    सही सरकारी नौकरी चुनिए <br />
                    <span className="text-[#2874F0]">Guess नहीं, Data से</span>
                  </h1>
                  <p className="text-zinc-600 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
                    Find the right government job for you based on eligibility.
                  </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto md:mx-0 group shadow-lg rounded-full">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-[#2874F0] transition-colors" />
                  </div>
                  <Input
                    type="text"
                    placeholder="🔍 Police Job, SSC GD, Railway..."
                    className="pl-12 py-7 text-lg rounded-full border-zinc-200 focus-visible:ring-[#2874F0] bg-white text-zinc-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-1.5 right-1.5">
                    <Button type="submit" size="lg" className="h-full rounded-full bg-[#2874F0] hover:bg-[#0056D2] text-white px-8">
                      Search
                    </Button>
                  </div>
                </form>

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

        {/* 2. TOOLS GRID SECTION */}
        <section className="container max-w-6xl mx-auto px-4 -mt-10 relative z-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Card 1: Eligibility */}
            <Link href="/sarkari-naukri">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded shadow-sm hover:shadow-md cursor-pointer h-full transition-transform hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                    <span className="text-2xl">👮‍♂️</span> Eligibility Check
                  </h3>
                  <p className="text-sm text-blue-700 mt-2 font-medium">Meri Height/Age check karo.</p>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors group-hover:bg-blue-700">
                    Check Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Papers */}
            <Link href="/board-papers">
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded shadow-sm hover:shadow-md cursor-pointer h-full transition-transform hover:-translate-y-1">
                <h3 className="font-bold text-green-900 text-lg flex items-center gap-2">
                  <span className="text-2xl">📄</span> Download Papers
                </h3>
                <p className="text-sm text-green-700 mt-1">UP & Bihar Board 2025 Model PDFs.</p>
              </div>
            </Link>

            {/* Card 3: Calendar */}
            <Link href="/calendar">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded shadow-sm hover:shadow-md cursor-pointer h-full transition-transform hover:-translate-y-1">
                <h3 className="font-bold text-orange-900 text-lg flex items-center gap-2">
                  <span className="text-2xl">📅</span> Exam Calendar
                </h3>
                <p className="text-sm text-orange-700 mt-1">See upcoming dates for SSC & Railway.</p>
              </div>
            </Link>

          </div>
        </section>


        {/* --- CAREER ASSESSMENT BANNER --- */}
        <section className="container mx-auto px-4 mb-16 mt-8">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl">

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white space-y-4 max-w-xl">
                <div className="inline-block bg-blue-800 text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Confused?
                </div>
                <h2 className="text-3xl font-bold leading-tight">
                  "Govt Job ki tayari karun ya Private Job?"
                </h2>
                <p className="text-blue-100 text-lg">
                  Don't guess your future. Take our 15-minute scientific test to find your perfect career path based on your personality.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link href="/assessment" className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all">
                  Start Career Assessment
                  <span className="bg-blue-100 text-blue-800 text-xs py-0.5 px-2 rounded-full ml-2">Free</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. LIVE FEED SECTION */}
        <section className="bg-white py-8 mb-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Aaj ki Sarkari Naukriyan <span className="text-zinc-500 font-normal text-lg ml-2 hidden sm:inline">(Live Updates)</span>
              </h2>
              <Button variant="link" asChild className="text-blue-600 font-semibold p-0 sm:px-4 h-auto sm:h-10 justify-start sm:justify-center">
                <Link href="/sarkari-naukri">View All Jobs &rarr;</Link>
              </Button>
            </div>

            {loadingJobs && (
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200 divide-y divide-zinc-100 p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-zinc-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            )}

            {!loadingJobs && jobs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-zinc-200">
                <p className="text-zinc-500">No active jobs found right now.</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 divide-y divide-zinc-100">
              {jobs.map((job) => {
                const titleText = job.seo_content?.title || job.title;
                const cleanTitle = titleText?.replace(/( – Apply Now| - Apply Now| \|.*|Sarkari Result|www\..*)/gi, '').trim();
                // Simple Date Formatter inline to avoid extra deps if possible, or use the helper
                const deadline = job.structured?.applicationEndDate ?
                  new Date(job.structured.applicationEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                  : 'Check Notice';
                const isClosingSoon = job.structured?.applicationEndDate ?
                  (new Date(job.structured.applicationEndDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000)
                  : false;

                return (
                  <div key={job.id} className="p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center hover:bg-zinc-50 transition-colors group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs mb-1">
                        {isClosingSoon && <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">Closing Soon</Badge>}
                        {!isClosingSoon && <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">New</Badge>}
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-500">Last Date: <span className="text-zinc-900 font-medium">{deadline}</span></span>
                      </div>
                      <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 text-lg leading-snug">
                        {cleanTitle}
                      </h3>
                      <p className="text-sm text-zinc-600 line-clamp-1">
                        {job.structured?.eligibility?.qualification || job.structured?.location || 'View Details'} | {job.structured?.totalVacancy || 'Multiple'} Vacancies
                      </p>
                    </div>
                    <Button size="sm" asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      <Link href={`/sarkari-naukri/${job.seo_content?.slug || job.id}`}>Check Eligibility</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* 4. SUCCESS STORIES (Retained for Trust) */}
        <section id="testimonials" className="relative py-16 overflow-hidden bg-zinc-50">

          <div className="relative z-10 container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold font-headline tracking-tighter text-zinc-900 sm:text-4xl">Success Stories</h2>
              <p className="mt-2 max-w-2xl mx-auto text-zinc-600 md:text-lg">
                Trusted by thousands of Students from diverse backgrounds.
              </p>
            </div>

            <Tabs defaultValue="students" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1 bg-white border border-zinc-200 rounded-full shadow-sm max-w-md mx-auto">
                <TabsTrigger value="students" className="rounded-full py-2 text-zinc-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Students</TabsTrigger>
                <TabsTrigger value="parents" className="rounded-full py-2 text-zinc-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Parents</TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white border text-zinc-900 border-zinc-200 shadow hover:shadow-lg transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          AS
                        </div>
                        <div>
                          <p className="italic text-zinc-600 mb-4">"CareerRaah helped me find the UP Police job. The eligibility checker saved me so much time. Now I am preparing for the exam!"</p>
                          <h4 className="font-bold text-zinc-900">Ankit Singh</h4>
                          <p className="text-xs text-zinc-500">Police Aspirant, Kanpur</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border text-zinc-900 border-zinc-200 shadow hover:shadow-lg transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          RV
                        </div>
                        <div>
                          <p className="italic text-zinc-600 mb-4">"मुझे SSC GD की सही जानकारी यहाँ मिली। कौन अप्लाई कर सकता है, ये साफ़-साफ़ बताया गया है।"</p>
                          <h4 className="font-bold text-zinc-900">Rohan Verma</h4>
                          <p className="text-xs text-zinc-500">SSC Aspirant, Patna</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="parents" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white border text-zinc-900 border-zinc-200 shadow hover:shadow-lg transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                          PM
                        </div>
                        <div>
                          <p className="italic text-zinc-600 mb-4">"Finally a website that is clean and easy to read. My son found the Board Papers easily. Thank you!"</p>
                          <h4 className="font-bold text-zinc-900">Priya Mehta</h4>
                          <p className="text-xs text-zinc-500">Parent, Lucknow</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

      </main>
    </div >
  );
}

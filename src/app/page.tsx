
'use client';

import { useContext, useState } from 'react';
import { BlogList } from '@/components/blog/BlogList';
import { getBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { ArrowRight, BrainCircuit, Newspaper, PlayCircle, X, Search, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="flex flex-col min-h-screen fade-in">
      <main className="flex-grow">
        <section className="relative h-auto min-h-[600px] flex items-center justify-center text-center text-white py-16">
          <Image
            src="/images/bharat-hero.png"
            alt="Indian students and parent planning career together"
            fill
            className="object-cover"
            data-ai-hint="indian students parent career"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-4 space-y-12">

            <div>
              {/* Ask Anything Search Box */}
              {/* Ask Anything Search Box */}
              <div className="max-w-xl mx-auto mb-10 relative z-20">
                <p className="mb-6 text-xl md:text-3xl font-bold text-white drop-shadow-md tracking-wide">
                  {t('home_search_prompt')} 🎓
                </p>
                <form onSubmit={handleSearch} className="relative flex items-center w-full shadow-2xl rounded-full overflow-hidden bg-white/10 backdrop-blur-md border border-white/30 transition-all hover:bg-white/20 focus-within:bg-white/90 group">
                  <Search className="absolute left-4 w-6 h-6 text-white/70 group-focus-within:text-purple-600" />
                  <Input
                    placeholder="IIT crack kaise kare? Government vs Private job?"
                    className="w-full pl-12 pr-32 py-8 text-xl bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isUserLoading}
                    suppressHydrationWarning
                  />
                  <Button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 rounded-full px-6 font-semibold transition-all hover:scale-105"
                    style={{ backgroundColor: '#25D366', color: 'white' }}
                    disabled={isUserLoading}
                    suppressHydrationWarning
                  >
                    {isUserLoading ? '...' : 'Ask'}
                  </Button>
                </form>

              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tighter text-white">
                  {t('home_hero_title')}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-base text-white/90 mb-12">
                  {t('home_hero_subtitle')}
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" style={{ backgroundColor: '#25D366', color: 'white' }} className="hover:bg-green-700 transition-colors shadow-xl">
                  <Link href="/login">
                    {t('home_hero_cta')} <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Video Section */}
            <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20 mt-12 max-w-6xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-headline font-bold tracking-tight text-white mb-2">Watch Our Career Guidance Videos</h2>
                <p className="text-white/90 text-sm">Learn how CareerRaah helps students achieve their career goals</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Video 1: Free Career Report */}
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    >
                      <source src="/videos/Free_Career_Report_Video_Script.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <h3 className="text-white font-semibold text-center">Free Career Report Guide</h3>
                </div>

                {/* Video 2: Student IIT Queries */}
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    >
                      <source src="/videos/Student_s_IIT_and_Career_Queries.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <h3 className="text-white font-semibold text-center">Student's IIT & Career Queries</h3>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="py-12 md:py-20 bg-background text-center">
          <div className="container mx-auto px-2 md:px-6">
            <h2 className="text-3xl font-bold font-headline tracking-tighter text-foreground sm:text-4xl">{t('home_why_title')}</h2>
            <div className="mt-8 max-w-5xl mx-auto">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {videos.map((video, index) => (
                    <CarouselItem key={index} className="md:basis-1/2">
                      <div
                        className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group cursor-pointer m-2"
                        onClick={() => window.open(video.imageUrl, '_blank')}
                      >
                        <Image
                          src={video.imageUrl}
                          alt={video.title}
                          data-ai-hint={video.imageHint}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                          <h3 className="mt-4 text-lg font-bold text-white">{video.title}</h3>
                          <p className="mt-1 text-xs text-white/90">{video.description}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:left-[-50px]" />
                <CarouselNext className="right-2 sm:right-[-50px]" />
              </Carousel>
            </div>
          </div>
        </section>

        {videoUrl && (
          <Dialog open={!!videoUrl} onOpenChange={(isOpen) => !isOpen && setVideoUrl(null)}>
            <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
              <DialogHeader>
                <DialogTitle className="sr-only">Video Player</DialogTitle>
              </DialogHeader>
              <video src={videoUrl} controls autoPlay className="w-full rounded-lg" />
            </DialogContent>
          </Dialog>
        )}


        {/* Sample Reports Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline tracking-tighter text-foreground sm:text-4xl">See What You Get inside the Report</h2>
              <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-xl">Real examples of personalized career reports generated by our AI</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {[
                    {
                      id: 1,
                      title: 'Finance & Banking (Mumbai)',
                      desc: 'Complete career strategy for Priya - West India',
                      lang: 'en',
                      region: 'West'
                    },
                    {
                      id: 2,
                      title: 'सिविल सर्विसेज (लखनऊ)',
                      desc: 'राज के लिए विस्तृत करियर रिपोर्ट - उत्तर भारत',
                      lang: 'hi',
                      region: 'North'
                    },
                    {
                      id: 3,
                      title: 'Software Engineering (Chennai)',
                      desc: 'கார்த்திக் க்கான முழுமையான அறிக்கை - தென் இந்தியா',
                      lang: 'ta',
                      region: 'South'
                    },
                    {
                      id: 4,
                      title: 'ক্রিয়েটিভ আর্টস (কলকাতা)',
                      desc: 'অনিরুদ্ধ এর জন্য বিস্তারিত রিপোর্ট - পূর্ব ভারত',
                      lang: 'bn',
                      region: 'East'
                    }
                  ].map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                      <Link href={`/sample-report-preview?lang=${item.lang}`} target="_blank">
                        <div
                          className="group relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:border-primary/50"
                        >
                          <div className="absolute inset-0 flex flex-col justify-between p-6">
                            <div className="flex justify-between items-start">
                              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                                {item.region} India
                              </div>
                              <PlayCircle className="text-primary w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="h-2 bg-primary/20 rounded w-3/4"></div>
                                <div className="h-2 bg-primary/20 rounded w-full"></div>
                                <div className="h-2 bg-primary/20 rounded w-2/3"></div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/30"></div>
                                  <div className="h-2 bg-primary/20 rounded flex-1"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/30"></div>
                                  <div className="h-2 bg-primary/20 rounded flex-1"></div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-t from-background via-background/95 to-transparent p-4 -m-6 mt-0">
                              <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                              <div className="mt-3 flex items-center gap-2 text-primary text-sm font-semibold">
                                <span>View Sample</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          </div>
        </section>



        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
            <DialogContent className="max-w-5xl h-[90vh] p-0 border-0 bg-transparent flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage}
                  alt="Full Report Preview"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <section id="testimonials" className="relative py-12 md:py-20 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/testimonials-bg.png"
              alt="Background pattern"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline tracking-tighter text-white sm:text-4xl">Success Stories</h2>
              <p className="mt-3 max-w-2xl mx-auto text-gray-200 md:text-xl">
                Trusted by thousands of Students, Parents, and Teachers across India
              </p>
            </div>

            <Tabs defaultValue="students" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                <TabsTrigger value="students" className="rounded-full py-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">Students</TabsTrigger>
                <TabsTrigger value="parents" className="rounded-full py-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">Parents</TabsTrigger>
                <TabsTrigger value="teachers" className="rounded-full py-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">Teachers</TabsTrigger>
                <TabsTrigger value="schools" className="rounded-full py-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">Schools</TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          AS
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"CareerRaah helped me discover my passion for data science. The AI report showed me career paths I never knew existed. Now I'm pursuing B.Tech in AI at VIT!"</p>
                          <h4 className="font-bold text-gray-900">Ananya Sharma</h4>
                          <p className="text-xs text-gray-500">Class 12 Graduate, Bangalore</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          RV
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"मुझे लगता था कि मेरे लिए सिर्फ इंजीनियरिंग ही है। CareerRaah ने मुझे दिखाया कि मेरी रुचि और skills के हिसाब से CA बेहतर option है। अब मैं CA Foundation में हूं!"</p>
                          <h4 className="font-bold text-gray-900">Rohan Verma</h4>
                          <p className="text-xs text-gray-500">Class 12, Lucknow</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="parents" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          PM
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"As a parent, I was confused about my daughter's career. CareerRaah's detailed report helped us understand her strengths in design. She's now at NIFT Mumbai and loving it!"</p>
                          <h4 className="font-bold text-gray-900">Priya Mehta</h4>
                          <p className="text-xs text-gray-500">Parent, Mumbai</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          SC
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"আমার ছেলে শিল্পে আগ্রহী ছিল কিন্তু আমরা চিন্তিত ছিলাম। CareerRaah এর রিপোর্ট দেখিয়েছে যে ডিজাইনে ভালো ক্যারিয়ার আছে। এখন সে Jadavpur এ পড়ছে!"</p>
                          <h4 className="font-bold text-gray-900">Subrata Chakraborty</h4>
                          <p className="text-xs text-gray-500">Parent, Kolkata</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="teachers" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          DK
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"I recommend CareerRaah to all my students. The AI-powered reports give them clarity about their future. It's like having a personal career counselor for each student!"</p>
                          <h4 className="font-bold text-gray-900">Dr. Kavita Desai</h4>
                          <p className="text-xs text-gray-500">Career Counselor, DPS Pune</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          AR
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"CareerRaah இன் அறிக்கைகள் மிகவும் விரிவானவை. என் மாணவர்கள் தங்கள் எதிர்காலத்தைப் பற்றி தெளிவாக புரிந்துகொள்கிறார்கள். இது ஒரு சிறந்த கருவி!"</p>
                          <h4 className="font-bold text-gray-900">Arun Ramesh</h4>
                          <p className="text-xs text-gray-500">Teacher, Kendriya Vidyalaya Chennai</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="schools" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          RS
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"We partnered with CareerRaah for our Class 11-12 students. The personalized reports have significantly improved our career counseling program. Parents are very satisfied!"</p>
                          <h4 className="font-bold text-gray-900">Ryan International School</h4>
                          <p className="text-xs text-gray-500">Noida, Uttar Pradesh</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 border-0 shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          DV
                        </div>
                        <div>
                          <p className="italic text-gray-700 mb-4">"CareerRaah's AI reports complement our traditional counseling perfectly. Students get data-backed insights about their career options. Highly recommended for schools!"</p>
                          <h4 className="font-bold text-gray-900">DAV Public School</h4>
                          <p className="text-xs text-gray-500">Hyderabad, Telangana</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter text-foreground sm:text-4xl">{t('home_plan_title')}</h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-xl">
              {t('home_plan_subtitle')}
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/login">
                  {t('home_plan_cta')} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div >
  );
}

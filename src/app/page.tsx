'use client';

import { BlogList } from '@/components/blog/BlogList';
import { getBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Newspaper, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  const posts = getBlogPosts();

  return (
    <div className="flex flex-col min-h-screen fade-in">
      <main className="flex-grow">
        <section className="relative h-[70vh] min-h-[550px] flex items-center justify-center text-center text-white">
          <Image
            src="https://images.unsplash.com/photo-1542744095-291d1f67b221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdHVkZW50cyUyMGxlYXJuaW5nJTIwbGFwdG9wfGVufDB8fHx8MTc2NzA5NjAyOHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Supportive parent helping their child with career planning on a laptop"
            fill
            className="object-cover"
            data-ai-hint="parent child career"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-white">
              Find Your Future Career, For Free.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
              Our experts build a personalized career roadmap based on your unique skills and interests—all in under 5 minutes.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link href="/assessment">
                  Create My Free Roadmap <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-headline font-bold tracking-tight text-white">The Right Time to Plan Their Career is Now.</h2>
                <p className="mt-2 max-w-2xl mx-auto text-base text-primary-foreground/80">
                    As a parent, you can explore modern careers and understand their potential.
                </p>
                 <div className="mt-6 flex justify-center">
                    <Button asChild size="lg" variant="secondary">
                      <Link href="/parent-explorer">Explore Careers for Your Child</Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background text-center">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold font-headline tracking-tighter text-foreground sm:text-4xl">Why Choose CareerRaah?</h2>
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group cursor-pointer">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHxzdHVkZW50cyUyMGNsYXNzcm9vbSUyMGxhcHRvcHxlbnwwfHx8fDE3NjcyNzQxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Video thumbnail showing students in a classroom"
                  data-ai-hint="students classroom"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="featured-posts" className="py-12 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline tracking-tighter text-foreground sm:text-4xl">Featured Posts</h2>
              <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                Check out some of our most popular articles.
              </p>
            </div>
            <BlogList posts={posts.slice(0, 3)} showSearch={false} />
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h2 className="text-3xl font-bold font-headline tracking-tighter text-foreground sm:text-4xl">Ready to Dive In?</h2>
                <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                    Start learning and exploring today.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/blog">
                            Explore Blog <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
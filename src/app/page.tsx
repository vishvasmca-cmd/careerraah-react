'use client';

import { BlogList } from '@/components/blog/BlogList';
import { getBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  const posts = getBlogPosts();

  return (
    <div className="flex flex-col min-h-screen fade-in">
      <main className="flex-grow">
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNhcmVlcnxlbnwwfHx8fDE3NjUxMjUwODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Students planning their career"
            fill
            className="object-cover"
            data-ai-hint="students career"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-white">
              Your Personal AI Career Guide
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
              Stop Guessing. Build Your Roadmap in &lt; 5 Minutes.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/assessment">
                  Start Assessment <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/parent-explorer">Parent Explorer</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold font-headline tracking-tighter text-foreground sm:text-4xl">Why Choose CareerRaah?</h2>
                <p className="text-muted-foreground md:text-lg">
                  We combine curated content with cutting-edge AI to provide a unique learning experience.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium font-headline">Insightful Articles</CardTitle>
                      <Newspaper className="w-6 h-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Dive deep into a variety of topics with our collection of expertly written blog posts.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium font-headline">AI-Powered Tools</CardTitle>
                      <BrainCircuit className="w-6 h-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Use our AI to summarize articles and assess your knowledge on any subject.
                      </p>
                    </CardContent>
                  </Card>
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

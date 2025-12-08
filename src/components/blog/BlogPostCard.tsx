
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/data';
import { getSummaryAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Lightbulb, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

export function BlogPostCard({ post, index }: BlogPostCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  const handleSummarize = () => {
    setIsDialogOpen(true);
    // Don't re-fetch if we already have the summary
    if(summary) return;

    startTransition(async () => {
      const result = await getSummaryAction(post.content);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Summarization Failed",
          description: result.error,
        });
        setIsDialogOpen(false);
      } else {
        setSummary(result.summary ?? null);
      }
    });
  };

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative h-48 w-full">
          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground">
                <Lightbulb className="h-12 w-12 opacity-50" />
                <p className="mt-2 text-xs">Image not available</p>
            </div>
          ) : (
            <Image
              src={post.imageUrl}
              alt={post.title}
              data-ai-hint={post.imageHint}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImgError(true)}
              priority={index < 3} // Prioritize images in the first row
            />
          )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-xl h-14 line-clamp-2">
            <Link href={`/blog/${post.id}`}>{post.title}</Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground pt-2">{post.author} &bull; {post.date}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">
            {post.content}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button asChild variant="outline">
            <Link href={`/blog/${post.id}`}>Read More</Link>
          </Button>
          <Button onClick={handleSummarize} variant="default">
            <Lightbulb className="mr-2 h-4 w-4" />
            Summarize
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                <Sparkles className="text-primary"/> Expert Summary
            </DialogTitle>
            <DialogDescription className="pt-2 text-left">
              A quick summary of "{post.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isPending ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Generating summary...</span>
              </div>
            ) : (
              <p className="text-lg leading-relaxed">{summary}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

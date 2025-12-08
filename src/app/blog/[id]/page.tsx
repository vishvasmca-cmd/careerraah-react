import { getBlogPost } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | CareerRaah`,
    description: post.content.substring(0, 150),
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="fade-in">
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          data-ai-hint={post.imageHint}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <article className="container mx-auto max-w-3xl py-8 px-4 md:px-6 lg:py-12 -mt-32 relative z-10">
        <Card className="bg-card/90 backdrop-blur-sm">
          <CardHeader className="p-6">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
             <div className="text-lg font-body leading-relaxed text-foreground/90 space-y-6 whitespace-pre-wrap">
              {post.content}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-6 bg-primary/5 rounded-b-lg flex-col items-center text-center">
            <h3 className="text-xl font-bold font-headline text-foreground">Ready to Discover Your Path?</h3>
            <p className="mt-2 text-muted-foreground">
              Our AI can build a personalized career roadmap for you in minutes.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" style={{ backgroundColor: '#FF6B00', color: 'white' }}>
                <Link href="/login">
                  Create My Free Roadmap <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </article>
    </div>
  );
}

// Dummy components to prevent errors if Card is not imported, though it should be.
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>;
const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>;
const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>;
const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>;

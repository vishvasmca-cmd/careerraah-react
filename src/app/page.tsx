import { BlogList } from '@/components/blog/BlogList';
import { getBlogPosts } from '@/lib/data';

export default function Home() {
  const posts = getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12 fade-in">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl text-foreground">
          Welcome to BlogFlow
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Explore insightful articles and use our AI tools to enhance your learning.
        </p>
      </div>
      <BlogList posts={posts} />
    </div>
  );
}

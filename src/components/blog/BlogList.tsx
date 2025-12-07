'use client';

import { useState, useMemo } from 'react';
import type { BlogPost } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { Search } from 'lucide-react';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!lowercasedTerm) return posts;
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowercasedTerm) ||
      post.content.toLowerCase().includes(lowercasedTerm)
    );
  }, [posts, searchTerm]);

  return (
    <div>
      <div className="relative mb-12 max-w-lg mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Search for articles"
          placeholder="Search articles by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 py-6 text-base rounded-full shadow-inner bg-card border-border"
        />
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No posts found for "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
}

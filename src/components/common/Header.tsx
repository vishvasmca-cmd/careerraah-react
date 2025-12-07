import Link from 'next/link';
import { Route } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="CareerRaah Home">
          <Route className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">
            CareerRaah
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/blog" className="text-sm font-medium">
              Blog
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/assessment" className="text-sm font-medium">
              Expert Assessment
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/parent-explorer" className="text-sm font-medium">
              Parent Explorer
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

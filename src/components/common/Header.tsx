
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

export function Header() {
  const [language, setLanguage] = useState('en');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="CareerRaah Home">
          <Route className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">
            CareerRaah
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center p-1 rounded-full bg-muted">
            <Button
              size="sm"
              variant={language === 'en' ? 'default' : 'ghost'}
              className={cn("rounded-full", language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
            <Button
              size="sm"
              variant={language === 'hi' ? 'default' : 'ghost'}
              className={cn("rounded-full", language === 'hi' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
              onClick={() => setLanguage('hi')}
            >
              हिंदी
            </Button>
          </div>
          
          <nav className="hidden items-center gap-2 sm:gap-4 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/assessment" className="text-sm font-medium">
                Expert Assessment
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/parent-explorer" className="text-sm font-medium">
                Career Explorer
              </Link>
            </Button>
          </nav>
        </div>

        <div className="md:hidden">
            <MobileNav />
        </div>
      </div>
    </header>
  );
}

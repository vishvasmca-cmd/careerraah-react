
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Route className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold font-headline text-foreground">
              CareerRaah
            </span>
          </Link>
          <nav className="flex flex-col gap-4">
             <Link
                href="/assessment"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Expert Assessment
            </Link>
             <Link
                href="/parent-explorer"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Career Explorer
            </Link>
          </nav>

          <Separator />
          
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Language</p>
            <div className="flex items-center p-1 rounded-full bg-muted w-min">
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

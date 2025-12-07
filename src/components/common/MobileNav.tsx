
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

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
        </div>
      </SheetContent>
    </Sheet>
  );
}

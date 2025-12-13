
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

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
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Navigation</SheetTitle>
          <SheetDescription>
            Main navigation links for CareerRaah.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Route className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold font-headline text-foreground">
              CareerRaah
            </span>
          </Link>
          <nav className="flex flex-col gap-4">
            <Link
              href="/sarkari-naukri"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="text-xl">🏛️</span> Sarkari Naukri
            </Link>
            <Link
              href="/board-papers"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="text-xl">📄</span> Board Papers
            </Link>
            <Link
              href="/chat"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="text-xl">🤖</span> Ask AI Didi
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}


'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { Globe, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageContext, languageOptions } from '@/context/LanguageProvider';


export function Header() {
  const { setLanguage } = useContext(LanguageContext);

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
           <nav className="hidden items-center gap-2 sm:gap-4 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/login" className="text-sm font-medium">
                Expert Assessment
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/parent-explorer" className="text-sm font-medium">
                Career Explorer
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/blog" className="text-sm font-medium">
                Blog
              </Link>
            </Button>
          </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Select language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

        </div>

        <div className="md:hidden">
            <MobileNav />
        </div>
      </div>
    </header>
  );
}

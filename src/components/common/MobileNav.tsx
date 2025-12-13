
'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { Menu, Route, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageContext, languageOptions, Language } from '@/context/LanguageProvider';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  }

  const currentLanguageName = languageOptions.find(l => l.code === language)?.name || 'English';

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
              href="/login"
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
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/sarkari-naukri"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Sarkari Naukri
            </Link>
          </nav>

          <Separator />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Language</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" /> {currentLanguageName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

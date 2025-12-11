
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Route, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageContext, languageOptions } from '@/context/LanguageProvider';
import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';


export function Header() {
  const { setLanguage } = useContext(LanguageContext);
  const { auth, user } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="CareerRaah Home">
          <Route className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">CareerRaah</span>
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

          {user && (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden md:flex">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Language</span>
                <span className="sm:hidden">A/अ</span>
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

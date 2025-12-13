
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Route, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';

import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';


export function Header() {

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2" aria-label="CareerRaah Home">
          <Route className="h-7 w-7 text-blue-700" />
          <span className="text-2xl font-bold font-headline text-blue-900 tracking-tight">CareerRaah</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link href="/sarkari-naukri" className="text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-1">
              <span className="text-lg">🏛️</span> Sarkari Naukri
            </Link>
            <Link href="/board-papers" className="text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-1">
              <span className="text-lg">📄</span> Board Papers
            </Link>
            <Link href="/chat" className="text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-1">
              <span className="text-lg">🤖</span> Ask AI Didi
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">



          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex text-gray-700 hover:text-blue-700 hover:bg-blue-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 h-9 px-4 shadow-sm transition-colors">
              Login
            </Link>
          )}

          <div className="md:hidden">
            <MobileNav />
          </div>

        </div>
      </div>
    </header>
  );
}

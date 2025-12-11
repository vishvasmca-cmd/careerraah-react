
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Users, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/firebase';
import { initiateGoogleSignIn } from '@/firebase/non-blocking-login'; // Import the new function
import { getRedirectResult } from 'firebase/auth';


const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C322 108.8 286.9 96 248 96c-88.8 0-160.1 71.1-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
  </svg>
);


function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, user, isUserLoading, firestore } = useFirebase();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const searchParams = useSearchParams();
  const returnPath = searchParams.get('returnPath');

  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (auth) {
      getRedirectResult(auth).catch((error) => {
        console.error("Redirect auth error:", error);
        toast({
          variant: 'destructive',
          title: "Sign-in failed",
          description: error.message,
        });
      });
    }
  }, [auth, toast]);

  useEffect(() => {
    // Clear any existing report from the session when the login page is visited.
    // This ensures a new login always starts a new assessment, unless we are returning to a specific flow.
    if (!returnPath) {
      sessionStorage.removeItem('careerReport');
    }
  }, [returnPath]);

  useEffect(() => {
    if (!isUserLoading && user && !isRedirecting) {
      console.log("LoginPage: Auth successful, preparing redirect...", { email: user.email, returnPath });
      setIsRedirecting(true);

      // Determine the destination URL
      let targetUrl: string;

      if (returnPath) {
        // If returnPath exists, append params if needed, or trust it
        // Check if returnPath already has these params to avoid duplication
        const hasParams = returnPath.includes('?');
        const separator = hasParams ? '&' : '?';
        // Only add name/role if not present? Actually the previous logic always added them.
        targetUrl = `${returnPath}${separator}name=${encodeURIComponent(name || '')}&role=${encodeURIComponent(role)}`;
      } else {
        const userName = name || user.displayName || (role === 'parent' ? 'your child' : 'User');
        targetUrl = `/assessment?role=${role}&name=${encodeURIComponent(userName)}`;
      }

      console.log("LoginPage: Redirecting to:", targetUrl);

      // Verify we are not redirecting to the current page (infinite loop protection)
      if (window.location.pathname + window.location.search === targetUrl) {
        console.warn("LoginPage: Redirect loop detected. Target same as current. Aborting.");
        return;
      }

      // Use replace to avoid history stack buildup
      router.replace(targetUrl);
    }
  }, [user, isUserLoading, router, role, name, returnPath, isRedirecting]);


  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);

    try {
      await initiateGoogleSignIn(auth);
      toast({
        title: "Signed in successfully!",
        description: "Redirecting...",
      });
    } catch (error: any) {
      console.error('Sign-in error:', error);
      toast({
        variant: 'destructive',
        title: "Sign-in failed",
        description: error.message || "Please try again.",
      });
      setIsSigningIn(false);
    }
  };

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!name) {
      e.preventDefault();
      toast({
        variant: 'destructive',
        title: 'Please enter a name',
        description: `We need ${role === 'parent' ? "your child's" : "your"} name to personalize the experience.`,
      });
      return;
    }

    // Logic for redirection
    if (returnPath) {
      // Append name and role to the return path so the destination knows who we are (guest mode)
      const separator = returnPath.includes('?') ? '&' : '?';
      const finalPath = `${returnPath}${separator}name=${encodeURIComponent(name || '')}&role=${encodeURIComponent(role)}`;
      router.push(finalPath);
    } else {
      const userName = name || (role === 'parent' ? 'your child' : 'User');
      router.push(`/assessment?role=${role}&name=${encodeURIComponent(userName)}`);
    }
  };


  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated, the useEffect will handle redirect
  // Don't render the form to avoid flash of content

  return (
    <div className="relative isolate min-h-full py-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="container mx-auto max-w-md px-4 md:px-6">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-headline font-bold mt-4">Join CareerRaah</CardTitle>
            <CardDescription>Let's get started on your personalized career journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Button variant="outline" className="w-full" size="lg" onClick={handleGoogleSignIn} disabled={isSigningIn}>
                {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Sign in with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground justify-center">
            <p>
              By continuing, you agree to our{' '}
              <Link href="#" className="underline hover:text-primary">
                Terms of Service
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

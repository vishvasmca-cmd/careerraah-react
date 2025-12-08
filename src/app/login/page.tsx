
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Users, UserPlus, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useFirebase } from '@/firebase';


const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C322 108.8 286.9 96 248 96c-88.8 0-160.1 71.1-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, user, isUserLoading } = useFirebase();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);


  useEffect(() => {
    if (!isUserLoading && user) {
      const userName = user.displayName || name || 'User';
      router.push(`/assessment?role=${role}&name=${encodeURIComponent(userName)}`);
    }
  }, [user, isUserLoading, router, role, name]);


  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Signed In!",
        description: "Redirecting to your assessment...",
      });
      // The useEffect will handle the redirection
    } catch (error: any) {
      console.error(error);
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not sign in with Google.",
      });
    } finally {
        setIsSigningIn(false);
    }
  };

  const handleContinue = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!name) {
      e.preventDefault();
      toast({
        variant: 'destructive',
        title: 'Please enter your name',
        description: 'We need your name to personalize your experience.',
      });
    }
  };


  if (isUserLoading || (!isUserLoading && user)) {
     return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
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
            <form className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Rani Sharma" required type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" placeholder="98765 43210" required type="tel" />
                </div>
                <div className="space-y-3">
                    <Label>I am a...</Label>
                    <RadioGroup defaultValue="student" value={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
                        <div>
                        <RadioGroupItem value="student" id="student" className="sr-only" />
                        <Label
                            htmlFor="student"
                            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-primary ${role === 'student' ? 'border-primary bg-primary/10' : 'border-muted'}`}
                        >
                            <User className="mb-2 h-6 w-6" />
                            Student
                        </Label>
                        </div>
                        <div>
                        <RadioGroupItem value="parent" id="parent" className="sr-only" />
                        <Label
                            htmlFor="parent"
                            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-primary ${role === 'parent' ? 'border-primary bg-primary/10' : 'border-muted'}`}
                        >
                            <Users className="mb-2 h-6 w-6" />
                            Parent
                        </Label>
                        </div>
                    </RadioGroup>
                </div>
                 <Button asChild className="w-full" size="lg" style={{ backgroundColor: '#FF6B00', color: 'white' }}>
                    <Link href={`/assessment?role=${role}&name=${encodeURIComponent(name || 'User')}`} onClick={handleContinue}>
                        Continue <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </form>
             <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
             <Button variant="outline" className="w-full" size="lg" onClick={handleGoogleSignIn} disabled={isSigningIn}>
                {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Sign in with Google
            </Button>
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

    
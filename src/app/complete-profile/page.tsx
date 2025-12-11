'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { saveUserProfile } from '@/lib/auth-utils';
import { useToast } from '@/hooks/use-toast';

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

const CLASS_OPTIONS = [
    'Class 9', 'Class 10', 'Class 11', 'Class 12',
    'B.Tech 1st Year', 'B.Tech 2nd Year', 'B.Tech 3rd Year', 'B.Tech 4th Year',
    'B.Sc 1st Year', 'B.Sc 2nd Year', 'B.Sc 3rd Year',
    'B.Com 1st Year', 'B.Com 2nd Year', 'B.Com 3rd Year',
    'B.A 1st Year', 'B.A 2nd Year', 'B.A 3rd Year',
    'Other'
];

export default function CompleteProfilePage() {
    const router = useRouter();
    const { user, firestore, isUserLoading } = useFirebase();
    const { toast } = useToast();

    const [fullName, setFullName] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }

        // Pre-fill name from Google account
        if (user?.displayName) {
            setFullName(user.displayName);
        }
    }, [user, isUserLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName || !selectedClass || !selectedState || !city) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill in all fields to continue.',
            });
            return;
        }

        if (!user || !firestore) return;

        setIsSaving(true);
        try {
            await saveUserProfile(user.uid, {
                fullName,
                class: selectedClass,
                state: selectedState,
                city,
                completedAt: new Date()
            }, firestore);

            toast({
                title: 'Profile Completed!',
                description: 'Your profile has been saved successfully.',
            });

            // Redirect to home or dashboard
            router.push('/');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save profile. Please try again.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 py-12 px-4">
            <div className="container mx-auto max-w-md">
                <Card className="shadow-2xl">
                    <CardHeader className="text-center">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                        <CardTitle className="text-3xl font-headline font-bold mt-4">Complete Your Profile</CardTitle>
                        <CardDescription>Help us personalize your career guidance experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    placeholder="e.g., Priya Kumar"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="class">Class/Grade *</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CLASS_OPTIONS.map((cls) => (
                                            <SelectItem key={cls} value={cls}>
                                                {cls}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State *</Label>
                                <Select value={selectedState} onValueChange={setSelectedState} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INDIAN_STATES.map((state) => (
                                            <SelectItem key={state} value={state}>
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="e.g., Mumbai"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isSaving}
                                style={{ backgroundColor: '#FF6B00', color: 'white' }}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Complete Profile'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


'use client';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAILS = ['vishvas.dhengula@gmail.com'];

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useFirebase();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isUserLoading) return;

        if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
            setIsAuthorized(false);
        } else {
            setIsAuthorized(true);
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
                <p>You are not authorized to view this page.</p>
                <p className="text-sm text-muted-foreground">Logged in as: {user?.email || 'Anonymous'}</p>
            </div>
        );
    }

    return <>{children}</>;
}

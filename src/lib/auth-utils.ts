import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfile {
    fullName: string;
    class: string;
    state: string;
    city: string;
    role?: string;
    completedAt: Date;
}

/**
 * Check if user has completed their profile
 */
export async function checkProfileCompletion(uid: string, firestore: any): Promise<boolean> {
    try {
        const profileRef = doc(firestore, 'users', uid, 'profile', 'data');
        const profileSnap = await getDoc(profileRef);
        return profileSnap.exists();
    } catch (error) {
        console.error('Error checking profile completion:', error);
        return false;
    }
}

/**
 * Save user profile to Firestore
 */
export async function saveUserProfile(uid: string, profile: UserProfile, firestore: any): Promise<void> {
    try {
        const profileRef = doc(firestore, 'users', uid, 'profile', 'data');
        await setDoc(profileRef, {
            ...profile,
            completedAt: new Date(),
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        throw error;
    }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string, firestore: any): Promise<UserProfile | null> {
    try {
        const profileRef = doc(firestore, 'users', uid, 'profile', 'data');
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
            return profileSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error getting profile:', error);
        return null;
    }
}

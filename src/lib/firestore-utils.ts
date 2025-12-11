
import {
    collection,
    doc,
    setDoc,
    addDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    Timestamp,
    updateDoc,
    arrayUnion,
    getFirestore
} from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

function getDb() {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
}

// --- Types ---
export interface SavedAssessment {
    uid: string;
    data: any;
    createdAt: any; // Timestamp
}

export interface SavedReport {
    uid: string;
    reportContent: string;
    generatedAt: any;
}

export interface ChatLog {
    role: 'user' | 'bot';
    text: string;
    timestamp: any;
}

export interface UserSummary {
    uid: string;
    email?: string;
    displayName?: string;
    lastActive?: any;
}

// --- User Actions ---

/**
 * Save the user's assessment inputs
 */
export async function saveUserAssessment(uid: string, assessmentData: any) {
    try {
        const assessmentRef = doc(getDb(), 'users', uid, 'assessments', 'latest');
        await setDoc(assessmentRef, {
            ...assessmentData,
            updatedAt: Timestamp.now()
        }, { merge: true });

        // Also update the main user document to track activity
        await setDoc(doc(getDb(), 'users', uid), {
            lastActive: Timestamp.now()
        }, { merge: true });

        console.log('Assessment saved for user:', uid);
    } catch (error) {
        console.error('Error saving assessment:', error);
    }
}

/**
 * Save the generated report
 */
export async function saveUserReport(uid: string, reportContent: string) {
    try {
        const reportRef = doc(getDb(), 'users', uid, 'reports', 'latest');
        await setDoc(reportRef, {
            content: reportContent,
            generatedAt: Timestamp.now()
        });
        console.log('Report saved for user:', uid);
    } catch (error) {
        console.error('Error saving report:', error);
    }
}

/**
 * Save a chat message to the user's history
 */
export async function saveChatMessage(uid: string, role: 'user' | 'bot', text: string) {
    try {
        // We'll store chat as a subcollection "chats"
        // For simplicity, we can just add to a "messages" collection
        const chatRef = collection(getDb(), 'users', uid, 'chat_history');
        await addDoc(chatRef, {
            role,
            text,
            timestamp: Timestamp.now()
        });
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}

// --- Admin Actions ---

/**
 * Get all users who have data in the system
 * Note: This lists documents in the 'users' collection.
 */
export async function getAllUsers(): Promise<UserSummary[]> {
    try {
        const usersRef = collection(getDb(), 'users');
        const q = query(usersRef, orderBy('lastActive', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        } as UserSummary));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

/**
 * Get full data for a specific user (Assessment, Report, Chat)
 */
export async function getUserFullData(uid: string) {
    try {
        // Fetch Assessment
        const assessmentSnap = await getDoc(doc(getDb(), 'users', uid, 'assessments', 'latest'));
        const assessment = assessmentSnap.exists() ? assessmentSnap.data() : null;

        // Fetch Report
        const reportSnap = await getDoc(doc(getDb(), 'users', uid, 'reports', 'latest'));
        const report = reportSnap.exists() ? reportSnap.data() : null;

        // Fetch Chat History
        const chatRef = collection(getDb(), 'users', uid, 'chat_history');
        const chatQuery = query(chatRef, orderBy('timestamp', 'asc'));
        const chatSnap = await getDocs(chatQuery);
        const chats = chatSnap.docs.map(d => d.data());

        return {
            assessment,
            report,
            chats
        };
    } catch (error) {
        console.error('Error fetching user full data:', error);
        return null;
    }
}

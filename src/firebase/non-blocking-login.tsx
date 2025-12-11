'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect, // Add redirect for mobile
  GoogleAuthProvider, // Import GoogleAuthProvider
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Detect if user is on mobile device */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/** Initiate Google sign-in using popup (desktop) or redirect (mobile). */
export async function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  try {
    // Unified strategy: Use Popup for all devices.
    // Why? 'signInWithRedirect' on mobile often fails on hosted platforms (like Render)
    // because the domain (onrender.com) differs from the auth domain (firebaseapp.com),
    // causing "Intelligent Tracking Prevention" (ITP) to block 3rd-party cookies/storage
    // required to restore the session after the redirect returns.
    // Popup avoids this because the main window never unloads, maintaining its own state.
    console.log('Initiating Google Sign-In via Popup (Universal)');
    await signInWithPopup(authInstance, provider);
    console.log('Google Sign-In initiated successfully');
  } catch (error) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
}

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

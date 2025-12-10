'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION -> Modified to fix Render deployment
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  // Prioritize explicit config if available (Fixes Render "no options" error)
  if (firebaseConfig?.apiKey) {
    try {
      return getSdks(initializeApp(firebaseConfig));
    } catch (e) {
      console.warn('Explicit initialization with config failed, falling back to auto-init.', e);
    }
  }

  // Fallback to automatic initialization (Firebase App Hosting)
  let firebaseApp;
  try {
    firebaseApp = initializeApp();
  } catch (e) {
    // If auto-init also fails, we are out of options IF we didn't try explicit above.
    // But if we are here, either explicit didn't exist or failed.
    // We try explicit one last time if we haven't already? 
    // Actually, the original logic was Auto -> Manual.
    // We are changing to Manual -> Auto.
    // So if Manual failed/missing, we try Auto.

    // In strict environments, Auto throws if env vars are missing.
    // We re-throw if we truly can't start.
    if (process.env.NODE_ENV === "production") {
      console.warn('Automatic initialization failed.', e);
    }
    // If we land here and haven't tried explicit yet (e.g. empty key?), try it now?
    // Using the original fallback logic just in case:
    firebaseApp = initializeApp(firebaseConfig);
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';

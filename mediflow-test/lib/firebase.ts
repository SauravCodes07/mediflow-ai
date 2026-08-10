import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type Auth,
  type User,
} from "firebase/auth";

/**
 * Firebase is initialized lazily, client-side only.
 * The `getFirebaseAuth()` helper is called at runtime (never at build/SSR time),
 * so missing NEXT_PUBLIC_FIREBASE_* values do not cause a build failure.
 */

let authInstance: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApp();

  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });
}

function getFirebaseAuth(): Auth {
  if (authInstance) return authInstance;
  
  authInstance = getAuth(getFirebaseApp());
  // Ensure persistent login across page refreshes and browser tabs
  setPersistence(authInstance, browserLocalPersistence).catch((err) => {
    console.warn("Firebase persistence error:", err);
  });

  return authInstance;
}

const googleProvider = new GoogleAuthProvider();

export {
  getFirebaseAuth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  onAuthStateChanged,
  type User,
};

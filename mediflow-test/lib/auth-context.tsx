"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import {
  getFirebaseAuth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  onAuthStateChanged,
  type User,
} from "./firebase";
import { DEMO_PROFILES, DEMO_ORG } from "./data/seed";
import type { Profile } from "./data/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(DEMO_PROFILES[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getFirebaseAuth() is called here — inside useEffect — so it only runs
    // in the browser, never during SSR or static prerendering at build time.
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const matched = DEMO_PROFILES.find((p) => p.authUid === currentUser.uid);
        if (matched) {
          setProfile(matched);
        } else {
          setProfile({
            id: `prf_${currentUser.uid.slice(0, 6)}`,
            orgId: DEMO_ORG.id,
            authUid: currentUser.uid,
            name: currentUser.displayName || currentUser.email?.split("@")[0] || "Hospital Staff",
            role: "clinician",
            departmentId: "dep_wards",
            active: true,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setProfile(DEMO_PROFILES[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const auth = getFirebaseAuth();
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res.user) {
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      await sendEmailVerification(res.user);
    }
  };

  const loginWithGoogle = async () => {
    const auth = getFirebaseAuth();
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  };

  const resetPassword = async (emailStr: string) => {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, emailStr);
  };

  const sendVerification = async () => {
    const auth = getFirebaseAuth();
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        sendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

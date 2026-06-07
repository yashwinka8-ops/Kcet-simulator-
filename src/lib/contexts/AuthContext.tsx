'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
}

export interface UserProfile {
    isPublic: boolean;
    interests: string[];
    bio: string;
    kcetMarks?: number;
    pcmMarks?: number;
    rank?: number;
    category?: string;
    wishlistCollegeIds?: string[];
    location?: string; // For Commute Buddy
    commuteRoute?: string; // For Commute Buddy
    // Senior/Mentor specific fields
    role?: 'aspirant' | 'senior';
    seniorCollegeId?: string;
    seniorBranchId?: string;
    isVerifiedSenior?: boolean;
    verificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
    verificationDocUrl?: string;
    mentorScore?: number;
    walletBalance: number; // In BatchWise Credits (1 Credit = ₹1)
    lifetimeEarnings?: number;
    premiumPass?: boolean;
    // Exam Prep
    syllabusProgress?: {
        physics: string[];
        chemistry: string[];
        maths: string[];
        biology: string[];
    };
    mockTests?: {
        id: string;
        date: string;
        score: number;
        total: number;
        subject: string;
        notes: string;
    }[];
    tasks?: {
        id: string;
        title: string;
        completed: boolean;
        date: string;
    }[];
    errorLog?: {
        id: string;
        question: string;
        topic: string;
        subject: string;
        notes: string;
        isResolved: boolean;
    }[];
    studyHours?: number; // Total tracked focus time in minutes
    updatedAt?: any;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    isGuest: boolean;
    isAdmin: boolean;
    guestId: string | null;
    setAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [guestId, setGuestId] = useState<string | null>(null);

    useEffect(() => {
        // Handle Guest ID
        let gid = localStorage.getItem('kcet_guest_id');
        if (!gid) {
            gid = 'guest_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('kcet_guest_id', gid);
        }
        setGuestId(gid);

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || 'User',
                    image: firebaseUser.photoURL || undefined
                });
                setIsGuest(false);
                localStorage.removeItem('kcet_guest');

                // Real-time profile sync
                const profileRef = doc(db, 'profiles', firebaseUser.uid);
                onSnapshot(profileRef, (doc) => {
                    if (doc.exists()) {
                        setProfile(doc.data() as UserProfile);
                    } else {
                        // Create default profile
                        const defaultProfile: UserProfile = {
                            isPublic: false,
                            interests: [],
                            bio: '',
                            walletBalance: 100, // Starting bonus
                        };
                        setDoc(profileRef, defaultProfile);
                        setProfile(defaultProfile);
                    }
                });
            } else {
                setUser(null);
                setProfile(null);
                const savedGuest = localStorage.getItem('kcet_guest');
                if (savedGuest) setIsGuest(true);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setIsGuest(false);
            localStorage.removeItem('kcet_guest');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;
        try {
            const profileRef = doc(db, 'profiles', user.id);
            await setDoc(profileRef, { 
                ...data, 
                updatedAt: serverTimestamp() 
            }, { merge: true });
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const setAsGuest = () => {
        setIsGuest(true);
        localStorage.setItem('kcet_guest', 'true');
    };

    const adminEmails = [
        'yashwinka8@gmail.com',
        'yashwinka8@gamil.com',
        'yashwinanand61@gmail.com', 
        'admin@kcetpredictor.com'
    ];
    
    const isAdmin = user ? adminEmails.includes(user.email.toLowerCase()) : false;

    useEffect(() => {
        if (user) {
            console.log("Logged in as:", user.email, "Is Admin:", isAdmin);
        }
    }, [user, isAdmin]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            profile, 
            isLoading, 
            loginWithGoogle, 
            logout, 
            updateProfile, 
            isGuest, 
            isAdmin, 
            guestId, 
            setAsGuest 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

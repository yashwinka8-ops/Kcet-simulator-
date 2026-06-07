'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
    location?: string;
    commuteRoute?: string;
    role?: 'aspirant' | 'senior';
    seniorCollegeId?: string;
    seniorBranchId?: string;
    isVerifiedSenior?: boolean;
    verificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
    verificationDocUrl?: string;
    mentorScore?: number;
    walletBalance: number;
    lifetimeEarnings?: number;
    premiumPass?: boolean;
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
    studyHours?: number;
    updatedAt?: string;
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

const STORAGE_KEY_USER = 'kcet_user';
const STORAGE_KEY_PROFILE = 'kcet_profile';
const STORAGE_KEY_GUEST = 'kcet_guest';
const STORAGE_KEY_GUEST_ID = 'kcet_guest_id';

function loadFromStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage(key: string, value: unknown) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { }
}

const DEFAULT_PROFILE: UserProfile = {
    isPublic: false,
    interests: [],
    bio: '',
    walletBalance: 100,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [guestId, setGuestId] = useState<string | null>(null);

    useEffect(() => {
        let gid = localStorage.getItem(STORAGE_KEY_GUEST_ID);
        if (!gid) {
            gid = 'guest_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem(STORAGE_KEY_GUEST_ID, gid);
        }
        setGuestId(gid);

        const savedUser = loadFromStorage<User | null>(STORAGE_KEY_USER, null);
        const savedProfile = loadFromStorage<UserProfile | null>(STORAGE_KEY_PROFILE, null);
        const savedGuest = localStorage.getItem(STORAGE_KEY_GUEST);

        if (savedUser) {
            setUser(savedUser);
            setProfile(savedProfile || { ...DEFAULT_PROFILE });
        } else if (savedGuest) {
            setIsGuest(true);
        }

        setIsLoading(false);
    }, []);

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            await new Promise<void>((resolve) => setTimeout(resolve, 300));

            const newUser: User = {
                id: 'user_' + Math.random().toString(36).substring(2, 15),
                email: 'user@example.com',
                name: 'User',
                image: undefined,
            };

            setUser(newUser);
            setProfile({ ...DEFAULT_PROFILE });
            saveToStorage(STORAGE_KEY_USER, newUser);
            saveToStorage(STORAGE_KEY_PROFILE, DEFAULT_PROFILE);
            localStorage.removeItem(STORAGE_KEY_GUEST);
            setIsGuest(false);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        // console.log("logging out");
        setUser(null);
        setProfile(null);
        setIsGuest(false);
        localStorage.clear();
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;
        const updated = { ...profile, ...data, updatedAt: new Date().toISOString() } as UserProfile;
        setProfile(updated);
        saveToStorage(STORAGE_KEY_PROFILE, updated);
    };

    const setAsGuest = () => {
        setIsGuest(true);
        localStorage.setItem(STORAGE_KEY_GUEST, 'true');
    };

    const adminEmails = [
        'yashwinka8@gmail.com',
        'yashwinka8@gamil.com',
        'yashwinanand61@gmail.com',
        'admin@kcetpredictor.com'
    ];

    const isAdmin = user ? adminEmails.includes(user.email.toLowerCase()) : false;

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

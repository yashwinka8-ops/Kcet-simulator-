'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { College } from '@/lib/types';
import { useAuth } from './AuthContext';
import collegesUnifiedRaw from '@/lib/data/colleges_unified.json';

const localColleges = (collegesUnifiedRaw as any).colleges as College[];

interface CollegeContextType {
    colleges: College[];
    isLoading: boolean;
    version: number;
    deletedIds: string[];
    refreshData: () => Promise<void>;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

const CACHE_KEY_COLLEGES = 'cached_colleges_v2';
const CACHE_KEY_DELETED = 'cached_deleted_ids';

export function CollegeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [colleges, setColleges] = useState<College[]>(localColleges);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY_COLLEGES);
        const cachedDeleted = localStorage.getItem(CACHE_KEY_DELETED);

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                setColleges(parsed);
                setDeletedIds(JSON.parse(cachedDeleted || '[]'));
            } catch {
                localStorage.removeItem(CACHE_KEY_COLLEGES);
            }
        }

        setIsLoading(false);
    }, []);

    const refreshData = async () => {
        setColleges(localColleges);
        setDeletedIds([]);
        localStorage.removeItem(CACHE_KEY_COLLEGES);
        localStorage.removeItem(CACHE_KEY_DELETED);
    };

    return (
        <CollegeContext.Provider value={{ colleges, isLoading, version, deletedIds, refreshData }}>
            {children}
        </CollegeContext.Provider>
    );
}

export const useColleges = () => {
    const context = useContext(CollegeContext);
    if (!context) throw new Error('useColleges must be used within a CollegeProvider');
    return context;
};

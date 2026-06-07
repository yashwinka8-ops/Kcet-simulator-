'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
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

export function CollegeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [colleges, setColleges] = useState<College[]>(localColleges);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [version, setVersion] = useState(0);

    const isAdmin = user?.email === 'yashwinka8@gmail.com' || 
                  user?.email === 'yashwinka8@gamil.com' || 
                  user?.email === 'yashwinanand61@gmail.com';

    const processMergedData = (cloudColleges: College[], cloudDeletedIds: string[]) => {
        const merged = [...localColleges];
        
        // 1. Apply Cloud Overlays
        cloudColleges.forEach(cloudCollege => {
            const index = merged.findIndex(c => c.college_id === cloudCollege.college_id);
            if (index !== -1) merged[index] = { ...merged[index], ...cloudCollege };
            else merged.push(cloudCollege);
        });

        // 2. Filter out Blacklisted (Deleted) IDs
        return merged.filter(c => !cloudDeletedIds.includes(c.college_id));
    };

    const refreshData = async (newVersion?: number) => {
        try {
            console.log("🔄 Syncing Institutional Database...");
            const [collegesSnap, metadataSnap] = await Promise.all([
                getDocs(collection(db, 'colleges')),
                getDocs(query(collection(db, 'metadata')))
            ]);

            const cloudData = collegesSnap.docs.map(doc => doc.data() as College);
            const configDoc = metadataSnap.docs.find(d => d.id === 'config');
            const cloudDeletedIds = configDoc?.data()?.deleted_ids || [];

            const processed = processMergedData(cloudData, cloudDeletedIds);
            
            setColleges(processed);
            setDeletedIds(cloudDeletedIds);
            
            if (!isAdmin) {
                localStorage.setItem('cached_colleges_v2', JSON.stringify(processed));
                localStorage.setItem('cached_deleted_ids', JSON.stringify(cloudDeletedIds));
                if (newVersion) localStorage.setItem('db_version', newVersion.toString());
            }

            if (newVersion) setVersion(newVersion);
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            console.log("🔐 Admin Mode Active: Live Cloud Sync Enabled");
            // Listen to Colleges
            const unsubColleges = onSnapshot(collection(db, 'colleges'), (snapshot) => {
                const cloudData = snapshot.docs.map(doc => doc.data() as College);
                setColleges(processMergedData(cloudData, deletedIds));
            });
            // Listen to Deleted List
            const unsubMetadata = onSnapshot(doc(db, 'metadata', 'config'), (snap) => {
                if (snap.exists()) {
                    const newDeletedIds = snap.data().deleted_ids || [];
                    setDeletedIds(newDeletedIds);
                    // Re-process colleges whenever blacklist changes
                    refreshData(); 
                }
            });
            return () => { unsubColleges(); unsubMetadata(); };
        } else {
            const cached = localStorage.getItem('cached_colleges_v2');
            const cachedDeleted = localStorage.getItem('cached_deleted_ids');
            const localVer = parseInt(localStorage.getItem('db_version') || '0');
            
            if (cached) {
                try {
                    setColleges(JSON.parse(cached));
                    setDeletedIds(JSON.parse(cachedDeleted || '[]'));
                    setVersion(localVer);
                } catch (e) {
                    localStorage.removeItem('cached_colleges_v2');
                }
            }

            const unsubscribe = onSnapshot(doc(db, 'metadata', 'config'), (snap) => {
                if (snap.exists()) {
                    const cloudVer = snap.data().version || 0;
                    const currentLocalVer = parseInt(localStorage.getItem('db_version') || '0');
                    if (cloudVer > currentLocalVer) refreshData(cloudVer);
                    else setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            });
            return () => unsubscribe();
        }
    }, [isAdmin]);

    return (
        <CollegeContext.Provider value={{ colleges, isLoading, version, deletedIds, refreshData: () => refreshData() }}>
            {children}
        </CollegeContext.Provider>
    );
}

export const useColleges = () => {
    const context = useContext(CollegeContext);
    if (!context) throw new Error('useColleges must be used within a CollegeProvider');
    return context;
};

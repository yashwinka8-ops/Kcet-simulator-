import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, UserProfile } from '@/lib/contexts/AuthContext';
import { useWishlist } from '@/lib/hooks/useWishlist';

export interface MatchResult {
    profile: UserProfile & { id: string };
    score: number;
    matchReasons: string[];
    isCommuteBuddy: boolean;
}

export function useSocialMatches() {
    const { user, profile } = useAuth();
    const { wishlist } = useWishlist();
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const findMatches = async () => {
        if (!user || !profile) return;
        setLoading(true);

        try {
            // Get user's top 3 wishlist college IDs
            const top3CollegeIds = wishlist.slice(0, 3).map(item => item.collegeId);
            
            // Query profiles who have at least one of these colleges in their wishlist
            // Note: Firestore 'array-contains-any' is perfect for this
            const profilesRef = collection(db, 'profiles');
            const q = query(
                profilesRef, 
                where('isPublic', '==', true),
                where('wishlistCollegeIds', 'array-contains-any', top3CollegeIds.length > 0 ? top3CollegeIds : ['dummy']),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            const results: MatchResult[] = [];

            querySnapshot.forEach((doc) => {
                if (doc.id === user.id) return;
                
                const otherProfile = doc.data() as UserProfile;
                let score = 0;
                const matchReasons: string[] = [];
                let isCommuteBuddy = false;

                // 1. Wishlist Overlap (Primary)
                const otherWishlistIds = otherProfile.wishlistCollegeIds || [];
                const overlap = top3CollegeIds.filter(id => otherWishlistIds.includes(id));
                if (overlap.length > 0) {
                    score += overlap.length * 30;
                    matchReasons.push(`Common Wishlist: ${overlap.length} college(s)`);
                }

                // 2. Rank Proximity (Probability)
                if (profile.rank && otherProfile.rank) {
                    const rankDiff = Math.abs(profile.rank - otherProfile.rank);
                    // If ranks are within 5000 of each other
                    if (rankDiff < 5000) {
                        score += 20;
                        matchReasons.push("Similar Rank Bracket");
                    }
                }

                // 3. Interest Graph (Compatibility)
                const commonInterests = profile.interests.filter(i => otherProfile.interests?.includes(i));
                if (commonInterests.length > 0) {
                    score += commonInterests.length * 10;
                    matchReasons.push(`${commonInterests.length} Shared Interests`);
                }

                // 4. Commute Buddy (Extension)
                if (profile.location && otherProfile.location && profile.location === otherProfile.location) {
                    // Check if they want to go to the same college
                    const commonColleges = overlap.length;
                    if (commonColleges > 0) {
                        isCommuteBuddy = true;
                        score += 50;
                        matchReasons.push("Potential Commute Buddy");
                    }
                }

                if (score > 0) {
                    results.push({
                        profile: { ...otherProfile, id: doc.id },
                        score: Math.min(score, 100),
                        matchReasons,
                        isCommuteBuddy
                    });
                }
            });

            // Sort by score descending
            results.sort((a, b) => b.score - a.score);
            setMatches(results);
        } catch (error) {
            console.error("Error finding matches:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && profile && wishlist.length > 0) {
            findMatches();
        }
    }, [user, profile?.wishlistCollegeIds, wishlist.length]);

    return { matches, loading, refreshMatches: findMatches };
}

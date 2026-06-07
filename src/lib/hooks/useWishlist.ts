import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/contexts/AuthContext';

export interface WishlistItem {
    id: string; // collegeId-branchId
    collegeName: string;
    branchName: string;
    collegeId: string;
}

export function useWishlist() {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    // Load initial data (LocalStorage for guests, Firestore for users)
    useEffect(() => {
        if (!user) {
            const saved = localStorage.getItem('kcet_wishlist');
            if (saved) setWishlist(JSON.parse(saved));
            return;
        }

        // Sync with Firestore if logged in
        const wishlistRef = doc(db, 'wishlists', user.id);
        const unsubscribe = onSnapshot(wishlistRef, (doc) => {
            if (doc.exists()) {
                setWishlist(doc.data().items || []);
            } else {
                // If cloud is empty, check if we have local items to migrate
                const saved = localStorage.getItem('kcet_wishlist');
                if (saved) {
                    const localItems = JSON.parse(saved);
                    setWishlist(localItems);
                    setDoc(wishlistRef, { items: localItems });
                    localStorage.removeItem('kcet_wishlist'); // Clean up after migration
                }
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Save to LocalStorage ONLY for guests (Users are synced via toggle)
    useEffect(() => {
        if (!user) {
            localStorage.setItem('kcet_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const toggleWishlist = async (item: WishlistItem) => {
        const exists = wishlist.find(i => i.id === item.id);
        let newWishlist;
        
        if (exists) {
            newWishlist = wishlist.filter(i => i.id !== item.id);
        } else {
            newWishlist = [...wishlist, item];
        }

        setWishlist(newWishlist);

        if (user) {
            const wishlistRef = doc(db, 'wishlists', user.id);
            await setDoc(wishlistRef, { items: newWishlist }, { merge: true });

            // Sync flat college IDs to profile for efficient matching
            const profileRef = doc(db, 'profiles', user.id);
            const collegeIds = Array.from(new Set(newWishlist.map(i => i.collegeId)));
            await setDoc(profileRef, { wishlistCollegeIds: collegeIds }, { merge: true });
        }
    };

    const reorderWishlist = async (id: string, direction: 'up' | 'down') => {
        const index = wishlist.findIndex(i => i.id === id);
        if (index === -1) return;
        
        const newWishlist = [...wishlist];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newWishlist.length) return;
        
        [newWishlist[index], newWishlist[targetIndex]] = [newWishlist[targetIndex], newWishlist[index]];
        
        setWishlist(newWishlist);

        if (user) {
            const wishlistRef = doc(db, 'wishlists', user.id);
            await setDoc(wishlistRef, { items: newWishlist }, { merge: true });
        }
    };

    const isInWishlist = (id: string) => {
        return wishlist.some(i => i.id === id);
    };

    return { wishlist, setWishlist, toggleWishlist, isInWishlist, reorderWishlist };
}

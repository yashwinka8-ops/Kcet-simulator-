import { db } from '@/lib/firebase';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    serverTimestamp, 
    query, 
    where, 
    getDocs,
    getDoc,
    orderBy,
    limit
} from 'firebase/firestore';

export interface MentorshipQuery {
    student_id: string;
    student_name: string;
    mentor_id: string;
    query_text: string;
    status: 'pending' | 'responded' | 'closed';
    response_text?: string;
    rating?: number;
    createdAt: any;
}

export const MentorshipService = {
    // Send a query to a mentor
    sendQuery: async (studentId: string, studentName: string, mentorId: string, text: string) => {
        const queryRef = collection(db, 'mentorship_logs');
        
        // Check for active queries to prevent spam
        const activeQ = query(
            queryRef, 
            where('student_id', '==', studentId), 
            where('status', '==', 'pending')
        );
        const snapshot = await getDocs(activeQ);
        
        if (!snapshot.empty) {
            throw new Error("You already have a pending query. Please wait for a response.");
        }

        return await addDoc(queryRef, {
            student_id: studentId,
            student_name: studentName,
            mentor_id: mentorId,
            query_text: text,
            status: 'pending',
            createdAt: serverTimestamp()
        });
    },

    // Senior responds to a query
    respondToQuery: async (queryId: string, responseText: string) => {
        const queryRef = doc(db, 'mentorship_logs', queryId);
        return await updateDoc(queryRef, {
            response_text: responseText,
            status: 'responded',
            respondedAt: serverTimestamp()
        });
    },

    // Junior rates the senior
    rateMentor: async (queryId: string, mentorId: string, rating: number) => {
        const queryRef = doc(db, 'mentorship_logs', queryId);
        await updateDoc(queryRef, {
            rating: rating,
            status: 'closed'
        });

        // Update mentor's score (average)
        const mentorRef = doc(db, 'profiles', mentorId);
        // This would ideally be a cloud function to ensure consistency, 
        // but for now we can update it locally or just log it.
        // Simplified: increment mentor score
        const mentorSnap = await getDocs(query(collection(db, 'mentorship_logs'), where('mentor_id', '==', mentorId), where('rating', '>', 0)));
        const ratings = mentorSnap.docs.map(d => d.data().rating as number);
        const avgScore = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        
        await updateDoc(mentorRef, {
            mentorScore: avgScore
        });
    },

    // Get queries for a student or mentor
    getQueries: async (userId: string, role: 'student' | 'mentor') => {
        const field = role === 'student' ? 'student_id' : 'mentor_id';
        const q = query(
            collection(db, 'mentorship_logs'), 
            where(field, '==', userId),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};

export const WalletService = {
    // Transaction logic (Simplified for now, in production use Cloud Functions)
    transferCredits: async (fromId: string, toId: string, amount: number, type: string) => {
        const fromRef = doc(db, 'profiles', fromId);
        const toRef = doc(db, 'profiles', toId);

        // Deduct from sender
        const fromSnap = await getDoc(fromRef);
        const currentBalance = fromSnap.data()?.walletBalance || 0;
        if (currentBalance < amount) throw new Error("Insufficient credits!");

        await updateDoc(fromRef, {
            walletBalance: currentBalance - amount,
            updatedAt: serverTimestamp()
        });

        // Add to receiver
        const toSnap = await getDoc(toRef);
        const receiverBalance = toSnap.data()?.walletBalance || 0;
        const receiverLifetime = toSnap.data()?.lifetimeEarnings || 0;

        await updateDoc(toRef, {
            walletBalance: receiverBalance + amount,
            lifetimeEarnings: receiverLifetime + amount,
            updatedAt: serverTimestamp()
        });

        // Log transaction
        await addDoc(collection(db, 'transactions'), {
            from: fromId,
            to: toId,
            amount: amount,
            type: type,
            createdAt: serverTimestamp()
        });
    },

    addCredits: async (userId: string, amount: number) => {
        const profileRef = doc(db, 'profiles', userId);
        const snap = await getDoc(profileRef);
        const balance = snap.data()?.walletBalance || 0;
        return await updateDoc(profileRef, {
            walletBalance: balance + amount
        });
    }
};

export const ChatRequestService = {
    sendRequest: async (studentId: string, mentorId: string, message: string, amount: number = 50) => {
        const requestsRef = collection(db, 'matches');
        
        // 1. Verify Balance First
        const studentRef = doc(db, 'profiles', studentId);
        const studentSnap = await getDoc(studentRef);
        const balance = studentSnap.data()?.walletBalance || 0;
        
        if (balance < amount) throw new Error(`Insufficient credits! You need ${amount} credits.`);

        // 2. Check if request already exists
        const q = query(
            requestsRef, 
            where('user_1_id', '==', studentId), 
            where('user_2_id', '==', mentorId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) throw new Error("Request already sent!");

        // 3. Deduct Credits (Escrow)
        await updateDoc(studentRef, {
            walletBalance: balance - amount
        });

        // 4. Create Request
        return await addDoc(requestsRef, {
            user_1_id: studentId,
            user_2_id: mentorId,
            status: 'pending',
            request_message: message,
            amount: amount, // Locked amount
            type: 'mentorship_dm',
            createdAt: serverTimestamp()
        });
    },

    acceptRequest: async (requestId: string) => {
        const docRef = doc(db, 'matches', requestId);
        const snap = await getDoc(docRef);
        const data = snap.data();
        if (!data) return;

        const amount = data.amount || 50;
        const seniorId = data.user_2_id;
        const seniorEarns = Math.floor(amount * 0.75); // 75% split

        // Credit Senior
        const seniorRef = doc(db, 'profiles', seniorId);
        const seniorSnap = await getDoc(seniorRef);
        const balance = seniorSnap.data()?.walletBalance || 0;
        const lifetime = seniorSnap.data()?.lifetimeEarnings || 0;

        await updateDoc(seniorRef, {
            walletBalance: balance + seniorEarns,
            lifetimeEarnings: lifetime + seniorEarns
        });

        return await updateDoc(docRef, {
            status: 'connected',
            acceptedAt: serverTimestamp()
        });
    },

    getRequests: async (userId: string) => {
        const q = query(
            collection(db, 'matches'), 
            where('user_2_id', '==', userId),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};

export const VerificationService = {
    submitForVerification: async (userId: string, docUrl: string) => {
        const profileRef = doc(db, 'profiles', userId);
        return await updateDoc(profileRef, {
            verificationStatus: 'pending',
            verificationDocUrl: docUrl,
            updatedAt: serverTimestamp()
        });
    }
};

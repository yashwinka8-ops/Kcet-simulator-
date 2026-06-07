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
    orderBy,
    onSnapshot,
    getDoc,
    deleteDoc
} from 'firebase/firestore';

export interface ChatMessage {
    id?: string;
    senderId: string;
    senderName?: string;
    text: string;
    type: 'text' | 'image' | 'video' | 'file';
    mediaUrl?: string;
    mediaName?: string;
    createdAt: any;
    edited?: boolean;
}

export const ChatService = {
    // Get all matches for a user that are connected (or pending for requests view)
    getUserMatches: async (userId: string) => {
        const matchesRef = collection(db, 'matches');
        
        // As a student/peer (user 1 or user 2)
        const q1 = query(matchesRef, where('user_1_id', '==', userId));
        const q2 = query(matchesRef, where('user_2_id', '==', userId));
        
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        const allMatches = [...snap1.docs, ...snap2.docs].map(doc => ({ id: doc.id, ...doc.data() as any }));
        
        // Fetch profiles for the other users
        const populatedMatches = await Promise.all(allMatches.map(async (match) => {
            const otherUserId = match.user_1_id === userId ? match.user_2_id : match.user_1_id;
            const profileSnap = await getDoc(doc(db, 'profiles', otherUserId));
            return {
                ...match,
                otherUser: { id: otherUserId, ...(profileSnap.data() || {}) }
            };
        }));

        // Sort by most recently updated
        return populatedMatches.sort((a, b) => {
            const aTime = a.lastMessageAt?.toMillis() || a.createdAt?.toMillis() || 0;
            const bTime = b.lastMessageAt?.toMillis() || b.createdAt?.toMillis() || 0;
            return bTime - aTime;
        });
    },

    // Create an instant match (No request/accept needed)
    createInstantMatch: async (user1Id: string, user2Id: string) => {
        const matchesRef = collection(db, 'matches');
        
        // Check if match already exists
        const q1 = query(matchesRef, where('user_1_id', '==', user1Id), where('user_2_id', '==', user2Id));
        const q2 = query(matchesRef, where('user_1_id', '==', user2Id), where('user_2_id', '==', user1Id));
        
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        if (!snap1.empty) return snap1.docs[0].id;
        if (!snap2.empty) return snap2.docs[0].id;

        // Create new connected match
        const newMatch = await addDoc(matchesRef, {
            user_1_id: user1Id,
            user_2_id: user2Id,
            status: 'connected',
            type: 'peer',
            createdAt: serverTimestamp()
        });
        
        return newMatch.id;
    },

    // Listen to messages in a specific match
    subscribeToMessages: (matchId: string, callback: (messages: ChatMessage[]) => void) => {
        const q = query(
            collection(db, 'matches', matchId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
            callback(messages);
        });
    },

    // Subscribe to global channel messages
    subscribeToGlobalChannel: (channelId: string, callback: (messages: ChatMessage[]) => void) => {
        const q = query(
            collection(db, 'channels', channelId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
            callback(messages);
        });
    },

    // Send message to global channel
    sendGlobalMessage: async (channelId: string, senderId: string, senderName: string, text: string, type: 'text'|'image'|'video'|'file' = 'text', mediaUrl?: string, mediaName?: string) => {
        const messagesRef = collection(db, 'channels', channelId, 'messages');

        const msgData = {
            senderId,
            senderName,
            text,
            type,
            ...(mediaUrl && { mediaUrl }),
            ...(mediaName && { mediaName }),
            createdAt: serverTimestamp()
        };

        return addDoc(messagesRef, msgData);
    },

    // Delete a message
    deleteMessage: async (channelOrMatchId: string, messageId: string, isGlobal: boolean) => {
        const docRef = doc(db, isGlobal ? 'channels' : 'matches', channelOrMatchId, 'messages', messageId);
        return deleteDoc(docRef);
    },

    // Edit a message
    updateMessage: async (channelOrMatchId: string, messageId: string, newText: string, isGlobal: boolean) => {
        const docRef = doc(db, isGlobal ? 'channels' : 'matches', channelOrMatchId, 'messages', messageId);
        return updateDoc(docRef, { text: newText, edited: true });
    },

    // Send a message
    sendMessage: async (matchId: string, senderId: string, text: string, type: 'text'|'image'|'video'|'file' = 'text', mediaUrl?: string, mediaName?: string) => {
        const messagesRef = collection(db, 'matches', matchId, 'messages');
        const matchRef = doc(db, 'matches', matchId);

        const msgData = {
            senderId,
            text,
            type,
            ...(mediaUrl && { mediaUrl }),
            ...(mediaName && { mediaName }),
            createdAt: serverTimestamp()
        };

        // Add message
        const docRef = await addDoc(messagesRef, msgData);

        // Update match with last message preview
        await updateDoc(matchRef, {
            lastMessageText: type === 'text' ? text : `[${type.toUpperCase()}] ${mediaName || ''}`,
            lastMessageAt: serverTimestamp(),
            status: 'connected' // Ensure it's connected if they are chatting
        });

        return docRef;
    },

    // Accept a peer request
    acceptPeerRequest: async (matchId: string) => {
        const matchRef = doc(db, 'matches', matchId);
        await updateDoc(matchRef, {
            status: 'connected',
            acceptedAt: serverTimestamp()
        });
    }
};

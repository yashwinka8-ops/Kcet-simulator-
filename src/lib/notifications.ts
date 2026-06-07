import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Note: Ensure your Firebase config is available in env or a separate config file
const firebaseConfig = {
  // These should be populated from your Firebase Console settings
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const VAPID_KEY = "BOeGRyjgZsBu0O8pnmWOOF9TGJNQVbMrElcndbxMUu87PYfOlpZo7iccxIoJ23ZHP6FQCWZuxh7O8rTdgsWDHtM";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });
      
      if (token) {
        console.log("FCM Token Generated:", token);
        
        // Register token with backend
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, platform: 'web' })
        });

        return token;
      }
    }
  } catch (error) {
    console.error("Notification Error:", error);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

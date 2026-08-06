import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase client-side
let app;
let messaging;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  console.log("Firebase initialized successfully on client.");
  try {
    messaging = getMessaging(app);
    console.log("Firebase Messaging service connected and ready.");
  } catch (err) {
    console.warn("Firebase Messaging is not supported in this browser:", err);
  }
}

// Request permission and get device token
export const requestFcmToken = async (userToken) => {
  if (typeof window === "undefined" || !messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission was denied.");
      return null;
    }

    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (fcmToken) {
      console.log("FCM Device Token retrieved:", fcmToken);

      // Save token to backend API
      await saveTokenToBackend(fcmToken, userToken);
      return fcmToken;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.error("Error retrieving FCM token:", err);
    return null;
  }
};

// Send device token to backend endpoints
const saveTokenToBackend = async (fcmToken, userToken) => {
  if (!userToken) {
    console.warn("FCM registration skipped: user is not logged in.");
    return;
  }

  const headers = { Authorization: `Bearer ${userToken}` };
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/fcm-token`;

  try {
    await axios.post(url, { token: fcmToken, platform: "web" }, { headers });
    console.log(`Successfully registered device token at: ${url}`);
  } catch (err) {
    console.warn(`Failed to register token at ${url}:`, err);
  }
};

// Listen for messages when application is in foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export const subscribeToForegroundMessages = (callback) => {
  if (typeof window === "undefined" || !messaging) return null;
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

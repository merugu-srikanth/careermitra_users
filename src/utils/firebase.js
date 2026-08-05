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

// Send device token to backend endpoints (fallback tries standard routes)
const saveTokenToBackend = async (fcmToken, userToken) => {
  const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};
  
  // Try to register the device token on both guest and user endpoints
  const endpoints = [];
  
  // Guest endpoints
  endpoints.push(
    `${process.env.NEXT_PUBLIC_API_URL}/fcm-token`,
    `${process.env.NEXT_PUBLIC_API_URL}/device-token`
  );
  
  // Authenticated user endpoints
  if (userToken) {
    endpoints.push(
      `${process.env.NEXT_PUBLIC_API_URL}/user/fcm-token`,
      `${process.env.NEXT_PUBLIC_API_URL}/user/device-token`,
      `${process.env.NEXT_PUBLIC_API_URL}/user/profile`
    );
  }

  for (const url of endpoints) {
    try {
      if (url.endsWith("/profile")) {
        // Send as fcmToken inside profile update payload
        await axios.put(url, { fcmToken }, { headers });
      } else {
        await axios.post(url, { token: fcmToken, deviceToken: fcmToken, fcmToken }, { headers });
      }
      console.log(`Successfully registered device token at: ${url}`);
      break; // Stop at first successful registration
    } catch (err) {
      console.warn(`Failed to register token at ${url}, trying next endpoint...`);
    }
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

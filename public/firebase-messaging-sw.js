// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker.
firebase.initializeApp({
  apiKey: "AIzaSyBfq9fV-N0yBqvKhjO90rrIappeJ7m3R5U",
  authDomain: "careermitra-dc94b.firebaseapp.com",
  projectId: "careermitra-dc94b",
  storageBucket: "careermitra-dc94b.firebasestorage.app",
  messagingSenderId: "105306688720",
  appId: "1:105306688720:web:487137105590210179e2d5",
});

const messaging = firebase.messaging();

// Customize background message handling
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || "Career Mitra Update";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification from Career Mitra.",
    icon: '/favicon.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

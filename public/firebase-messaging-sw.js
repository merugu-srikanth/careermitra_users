// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker.
firebase.initializeApp({
  apiKey: "AIzaSyAcgcuWQzw4KPeSDGD9EMpVwjCb6wh0CQ",
  authDomain: "careermitra-7d4c4.firebaseapp.com",
  projectId: "careermitra-7d4c4",
  storageBucket: "careermitra-7d4c4.firebasestorage.app",
  messagingSenderId: "206331218694",
  appId: "1:206331218694:web:5c7fb641ab4ad7358eec87",
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

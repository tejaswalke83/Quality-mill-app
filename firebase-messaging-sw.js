// --- Prevent Supabase REST requests from being intercepted/cached ---
// Place this at the very top so it runs before any other fetch handling.
self.addEventListener("fetch", (event) => {
  const url = event.request.url || "";

  // Let any Supabase REST/API calls go directly to the network untouched.
  // This avoids corrupting JSON bodies (Token "application" errors).
  if (url.includes("supabase.co") || url.includes("/rest/v1/")) {
    return; // do not call event.respondWith() — let the browser handle it
  }
});

// --- Firebase messaging SW (existing logic, unchanged) ---
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBpQRge5ZLaNx_mM_vwQrwmm1f2LkyhOyY",
  authDomain: "qualityattamills.firebaseapp.com",
  projectId: "qualityattamills",
  messagingSenderId: "737428044643",
  appId: "1:737428044643:web:a0f9ecfae3794e11e57156"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('📩 Received background message: ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/images/icon-192.png'
  });
});

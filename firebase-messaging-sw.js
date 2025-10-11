// --- Guard to avoid duplicate listener registrations ---
if (!self.__FIREBASE_PUSH_INITIALIZED__) {
  self.__FIREBASE_PUSH_INITIALIZED__ = true;

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

  // ✅ Push handler — no caching, no interception
  messaging.onBackgroundMessage((payload) => {
    console.log("📩 Received background message:", payload);
    const { title, body } = payload.notification || {};
    if (title && body) {
      self.registration.showNotification(title, {
        body,
        icon: "/images/icon-192.png"
      });
    }
  });
}
